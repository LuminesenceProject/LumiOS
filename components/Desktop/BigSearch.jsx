import React, { useLayoutEffect, useState } from "react";
import Prompt from "../../util/Prompt";
import Apps from "../apps/Apps.json";

const BigSearch = ({ setShown, openApp }) => {
    const [apps, setApps] = useState([]);
    const [input, setInput] = useState("");
    const [showBigScreen, setShowBigScreen] = useState(false);
    const [opacity, setOpacity] = useState(0);

    useLayoutEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        const installedApps = JSON.parse(localStorage.getItem(currentUser.name + "installedApps")) || [];

        setApps([...Apps, ...installedApps]);

        setTimeout(() => {
            setShowBigScreen(true);
            setOpacity(1); // Set opacity to 1 after 200ms
        }, 200);
    }, []);

    return (
        <Prompt setShown={setShown} className={`opacity-${Math.round(opacity * 100)} transition-opacity duration-200`}>
            <div className="flex flex-col items-center h-48">
                <div className="flex flex-row gap-2 p-2 justify-center items-center">
                    {apps && input && apps.filter((app) => app.name.toLowerCase().includes(input.toLowerCase())).slice(0, 6).map((app, index) => (
                        <div
                            className="flex flex-col gap-4 justify-center items-center cursor-pointer transition-transform duration-200 hover:scale-105 active:scale-95"
                            key={index}
                            onClick={() => {
                                openApp(app.name);
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
                <label htmlFor="appSearch" className="sr-only">Enter App Name</label>
                <input
                    type="text"
                    id="appSearch"
                    name="appSearch"
                    placeholder="Enter App Name..."
                    onChange={(e) => setInput(e.target.value)}
                    className="absolute p-2 shadow w-56 h-12 bottom-0 rounded border"
                    style={{
                        color: "white",
                        backgroundColor: "transparent",
                        opacity: "1",
                        backdropFilter: "blur(20px) brightness(50%)"
                    }}
                />
            </div>
        </Prompt>
    );
}

export default BigSearch;