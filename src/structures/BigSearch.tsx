import { useEffect, useRef, useState } from "react";
import virtualFS from "../utils/VirtualFS";
import alertSound from "../assets/sound/alert.wav";
import { App } from "../utils/types";

interface BigSearchProps {
    setShown: (prev: boolean) => void;
    handleAppClick: (app: string, type: string | boolean) => Promise<void>;
}

const BigSearch: React.FC<BigSearchProps> = ({ setShown, handleAppClick }) => {
    const [input, setInput] = useState<string>("");
    const [apps, setApps] = useState<App[]>([]);

    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchApps = async (): Promise<void> => {
            const apps = await virtualFS.readdir("Apps/");

            const updatedApps = Object.keys(apps).map((app) => {
                const parsed = apps[app] && JSON.parse(apps[app].content);
                
                return parsed
            });
                   
            setApps(updatedApps)
        }

        fetchApps();
    }, []);

    useEffect(() => {
        // Play sound on component mount
        const audio = new Audio(alertSound);
        audio.play();

        const handleOutsideClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setShown(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    const handleApp = (appName: string) => {
        handleAppClick(appName, 'file');
    }

    return ( 
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 backdrop-blur-lg text-text-base">
            <div ref={searchRef} className="flex flex-col gap-2 h-fit">
                <div className="flex flex-row gap-2 p-2 justify-center items-center">
                    {apps && input && apps.filter((app) => app.name.toLowerCase().includes(input.toLowerCase())).slice(0, 6).map((app, index) => (
                        <div
                            className="flex flex-col gap-4 justify-center items-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                            key={index}
                            onClick={() => {
                                handleApp(app.name)
                                setShown(false);
                            }}
                        >
                            {app && app.svg && app.svg.includes('<svg') ? (
                                // Render SVG content directly if it's an SVG
                                <div dangerouslySetInnerHTML={{ __html: app.svg }} className="h-20 w-20 invert" />
                            ) : (
                                // Render default SVG if app or app.svg is undefined
                                <img src={app.svg} alt={app.name} className="h-20 w-20" />
                            )}
                            <h2 className="font-bold text-xl" style={{ color: "white" }}>{app.name}</h2>
                        </div>
                    ))}
                    {apps && input.length === 0 && (
                        <h2 style={{ color: "white" }} className="font-bold text-2xl">Enter an App Name</h2>
                    )}
                </div>
                <div className="flex w-full justify-center items-center">
                <label htmlFor="appSearch" className="sr-only">Enter App Name</label>
                <input
                    type="text"
                    id="appSearch"
                    name="appSearch"
                    placeholder="Enter App Name..."
                    onChange={(e) => setInput(e.target.value)}
                    className="p-2 shadow w-56 h-12 bottom-0 rounded border"
                    style={{
                        color: "white",
                        backgroundColor: "transparent",
                        opacity: "1",
                        backdropFilter: "blur(20px) brightness(50%)"
                    }}
                />
                </div>
            </div>
        </div>
     );
}
 
export default BigSearch;