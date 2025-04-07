import { useEffect, useRef, useState } from "react";
import virtualFS from "../../utils/VirtualFS";
import { App } from "../../utils/types";
import { useContextMenu } from "../ContextMenu/useContextMenu";
import ContextMenu from "../ContextMenu/ContextMenu";

interface TrayProps {
    shown: boolean;
    openedApps: string[];
    htmlOpenedApps: object[];
    setShown: (prev: boolean) => void;
    setOpenedApps: (prev: string[]) => void;
    setHTMLOpenedApps: (prev: object[]) => void;
}

const AppTray: React.FC<TrayProps> = ({ shown, openedApps, htmlOpenedApps, setOpenedApps, setHTMLOpenedApps, setShown }) => {
    const [allApps, setAllApps] = useState<object>({});
    const [updatedMenuPosition, setUpdatedMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    const { menuPosition, menuVisible, menuActions, showMenu, hideMenu } = useContextMenu();

    const trayRef = useRef(null);

    useEffect(() => {
        const fetchApps = async (): Promise<void> => {
            const apps = await virtualFS.readdir("Apps");

            setAllApps(apps);
        }
        
        fetchApps();
    }, []);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
              setShown(false);
            }
        };
    
        document.addEventListener("mousedown", handleOutsideClick);
    
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleAppContextMenu = (event: React.MouseEvent<HTMLDivElement>, app: string, custom: boolean) => {
        event.preventDefault();

        // Get the position relative to the window
        const x = event.clientX;
        const y = event.clientY;
    
        // Get the bounding client rect of the parent component
        const rect = document.getElementById("appTray");
        const bounds = rect?.getBoundingClientRect();
    
        if (bounds) {
            // Calculate the relative position within the bounding rectangle
            const relativeX = x - bounds.left;
            const relativeY = y - bounds.top - 20; // just to make sure it is not hidden
    
            // Update the state variable with the adjusted menu position
            setUpdatedMenuPosition({ x: relativeX, y: relativeY });
        }

        const handleAppClick = async (app: string) => {
            const allApps = await virtualFS.readdir("Apps");
          
            const thisApp = Object.keys(allApps).find(allApp => {
              const appContent = JSON.parse(allApps[allApp].content);
              return appContent.name === app;
            });
            
            setOpenedApps((prev: string[]) => [...prev, thisApp]);
        };

        showMenu(event, app, {
            "Close": () => {                
                if (!custom) {
                    setOpenedApps((prev: string[]) => prev.filter(value => value !== app));
                } else {
                    setHTMLOpenedApps((prev: Array<object>) => prev.filter(customContent => customContent.title !== app.title));                        
                }

                hideMenu();
                setShown(false);
            }
        });

        event.stopPropagation();
    };
    
    return ( 
        <div
            ref={trayRef}
            id="appTray"
            className={`${
                shown ? "scale-100 pointer-events-auto z-50" : "scale-0 pointer-events-none"
            } transition-transform duration-200 absolute -translate-y-20 backdrop-blur-lg w-1/6 mx-20 right-0 origin-bottom p-4 rounded`}
            style={{ bottom: 0, backdropFilter: "blur(20px)", color: "white" }}
        >
            <div className="flex flex-wrap flex-row gap-1">
                {[...openedApps, ...htmlOpenedApps].map((app, index) => {
                    var parsed: App;
                    var custom: boolean = false;
                    
                    if (!allApps[app]) {
                        parsed = {
                            name: "Notepad",
                            description: "Write and save files across LumiOS.",
                            userInstalled: false,
                            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>`
                        };

                        custom = true;
                    } else {
                        parsed = JSON.parse(allApps[app]?.content);
                    }

                    return (
                        <div key={index} onContextMenu={(e) => handleAppContextMenu(e, app as string, custom)} onClick={(e) => handleAppContextMenu(e, app as string, custom)} className="bg-primary hover:bg-primary-light duration-200 transition-colors rounded shadow-sm">
                            {!parsed.svg.startsWith("data:image") && !parsed.svg.startsWith("https://") ? (
                              <div dangerouslySetInnerHTML={{ __html: parsed.svg }} className="cursor-pointer invert w-10 h-10 p-2 rounded" />
                            ) : (
                                <img src={parsed.svg} alt={parsed.name} className="h-5/6 w-5/6 object-cover" />
                            )}
                        </div>
                    )
                })}
                {openedApps.length == 0 && (
                    <p className="font-semibold text-xs">No opened apps</p>
                )}
            </div>
            {menuVisible && (
                <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} />
            )}
        </div>
    );
}
 
export default AppTray;