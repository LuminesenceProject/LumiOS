import React, { useLayoutEffect, useState } from "react";
import { useContextMenu } from "../../ContextMenu/useContextMenu";
import "@ruffle-rs/ruffle";
import "../../../structures/ruffle.js";
import ContextMenu from "../../ContextMenu/ContextMenu";
import virtualFS from "../../../utils/VirtualFS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExpand, faMaximize } from "@fortawesome/free-solid-svg-icons";

interface HTMLProps {
    path: string;
    link?: string;
}

const HTMLFileViewer: React.FC<HTMLProps> = ({ path, link }) => {
    const [content, setContent] = useState<string | null>(null);
    const [type, setType] = useState<string>("");
    const [updatedMenuPosition, setUpdatedMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const [showContent, setShowContent] = useState<boolean>(true);
    const [showSwf, setShowSwf] = useState<boolean>(false);
    const { menuVisible, menuActions, showMenu, hideMenu } = useContextMenu();

    useLayoutEffect(() => {
        const getContent = async () => {
            const apps = await virtualFS.readdir("Apps/");
            const app = apps[path];
            const parsedContent = typeof app.content === "string" ? JSON.parse(app.content) : app.content;
            setContent(await parsedContent.fileContent);
            
            setType(await app.fileType);
            
        };

        if (!path.includes("HTMLFileViewer")) {                        
            if (type === "swf" || link?.endsWith(".swf") && link.startsWith("https://")) {
                setShowSwf(true);
                loadSWFFromLink(link);
            } else {
                getContent();
                setShowSwf(false);
            }
        } else {
            setShowContent(false);
        }
    }, []);

    const handleIframeContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        const x = event.clientX;
        const y = event.clientY;
        const rect = document.getElementById(`${path}viewer`);
        const bounds = rect?.getBoundingClientRect();
    
        if (bounds) {
            const relativeX = x - bounds.left;
            const relativeY = y - bounds.top;
            setUpdatedMenuPosition({ x: relativeX, y: relativeY });
        }

        showMenu(event, path, {
            "Fullscreen": () => {
                const fullscreenDiv = document.getElementById(`${path}fullscreen`);
                if (fullscreenDiv) {
                    fullscreenDiv.classList.toggle("fullscreen");
                }
            }
        });

        event.stopPropagation();
    }

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const fileContent = e.target?.result as string;
                const fileType = file.type;
                if (fileType.includes("html")) {
                    setShowSwf(false);
                    setContent(fileContent);
                    setShowContent(true);
                } else if (fileType.includes("x-shockwave-flash")) {
                    setShowSwf(true);
                    loadSWFFromFile(file);
                    setShowContent(true);
                } else {
                    console.error("Unsupported file type.");
                }
            };
            reader.readAsText(file);
        }
    };

    const loadSWFFromFile = async (file: File): Promise<void> => {
        const swfData = await file.arrayBuffer();
        startPlayer(swfData);
    };

    const loadSWFFromLink = async (link: string | undefined): Promise<void> => {
        if (!link) {
            console.error("No SWF link provided.");
            return;
        }

        try {
            const response = await fetch(link);
            if (!response.ok) {
                throw new Error(`Failed to fetch SWF from ${link}. Status code: ${response.status}`);
            }

            const swfData = await response.arrayBuffer();
            startPlayer(swfData);
        } catch (error) {
            console.error("Error loading SWF:", error);
        }
    };

    const startPlayer = (data: ArrayBuffer) => {
        console.log("Initializing with " + data.byteLength + " bytes of data");
        const flashObject = document.createElement("object");
        flashObject.classList.add("gembed");
        flashObject.type = "application/x-shockwave-flash";
        flashObject.data = URL.createObjectURL(new Blob([data], { type: "application/x-shockwave-flash" }));
        flashObject.id = `player${link}`;
        const swfPlayer = document.getElementById("swfplayer" + link);
        if (swfPlayer) {
            swfPlayer.innerHTML = "";
            swfPlayer.appendChild(flashObject);
            flashObject.style.width = "100%";
            flashObject.style.height = "100%";
        }
    };

    const handleFullscreen = () => {
        const iframe = document.getElementById("swfplayer" + link);

        if (iframe) {
            iframe.requestFullscreen();
        }
    }

    const handleMaximize = () => {

    }

    return (
        <div id={`${path}viewer`} className="w-full h-full" onContextMenu={(e) => handleIframeContextMenu(e)}>
            {showContent ? (
                <>
                    <div className="absolute backdrop-blur-lg backdrop-brightness-75 left-0 flex flex-row gap-2 p-2 transition-opacity duration-200 opacity-0 hover:opacity-100 rounded-b z-30">
                        <div className="group relative">
                            <div className="absolute bg-primary-light rounded px-2 p-1 -translate-y-10 origin-bottom scale-0 ease-linear duration-100 group-hover:scale-100">
                            <h2>Fullscreen</h2>
                            </div>
                            <FontAwesomeIcon className="cursor-pointer active:scale-95 hover:bg-primary-light transition-all duration-200 p-2 rounded" icon={faExpand} onClick={handleFullscreen} />
                        </div>

                        <div className="group relative">
                            <div className="absolute bg-primary-light rounded px-2 p-1 -translate-y-10 origin-bottom scale-0 ease-linear duration-100 group-hover:scale-100">
                            <h2>Maximize</h2>
                            </div>
                            <FontAwesomeIcon className="cursor-pointer active:scale-95 hover:bg-primary-light transition-all duration-200 p-2 rounded" icon={faMaximize} onClick={handleMaximize} />
                        </div>
                    </div>
                    {/* If SWF file, use SWF player */}
                    {showSwf ? (
                        <div className="w-full h-full overflow-hidden" id={"swfplayer" + link} />
                    ) : (
                        <iframe className="w-full h-full" srcDoc={content || "<p>Loading...</p>"} id={"swfplayer" + link}>Iframe is blocked</iframe>
                    )}
                    {menuVisible && (
                        <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} />
                    )}
                </>
            ) : (
                <div className="w-full h-full flex flex-col items-center justify-center">
                    <div id={`${path}fullscreen`} className="w-full h-full flex flex-col items-center justify-center">
                        <label htmlFor="file-upload" className="custom-file-upload">
                            Upload html/flash
                        </label>
                        <input id="file-upload" type="file" title="html/swf files only" accept=".html,.swf" onChange={handleFileChange} />
                    </div>
                    {menuVisible && (
                        <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} />
                    )}
                </div>
            )}
        </div>
    );
}

export default HTMLFileViewer;