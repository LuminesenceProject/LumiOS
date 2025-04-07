import { useEffect, useLayoutEffect, useState } from "react";
import virtualFS from "../../../utils/VirtualFS";
import { App } from "../../../utils/types";
import Button from "../../../structures/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faArrowUpFromBracket, faArrowUpRightFromSquare, faStore, faThumbTack, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useTopbar } from "../../Topbar/useTopbar";

interface AppsProps {
    setOpenedApps: (prev: string[]) => void;
}

const Apps: React.FC<AppsProps> = ({ setOpenedApps }) => {
    const [apps, setApps] = useState<Array<App>>([]);
    const [undidApps, setUndidApps] = useState({});
    const [selectedApp, setSelectedApp] = useState<App | null>();
    const [pinned, setPinned] = useState<boolean>(false);
    const [shortcutted, setShortcutted] = useState<boolean>(false);
    const { addMenu, removeMenu } = useTopbar();

    useLayoutEffect(() => {
        const fetchApps = async () => {
            const stored = await virtualFS.readdir("Apps/");

            const parsed = Object.keys(stored).map((app) => {
                return JSON.parse(stored[app].content);
            });

            setApps(parsed);
            setUndidApps(stored);
        }

        fetchApps();
    }, []);

    useEffect(() => {
        removeMenu("Apps");

        addMenu({
            title: "Apps",
            icon: faStore,
            dropdown: selectedApp ? [
                { label: "Open", onClick: openApp, icon: faArrowUpFromBracket },
                { label: "Pin", onClick: pin, icon: faThumbTack },
                { label: "Shortcut", onClick: shortcut, icon: faArrowUpRightFromSquare },
                { label: "Delete", onClick: deleteApp, icon: faTrash },
            ] : [
                { label: "Choose...", onClick: () => {} }
            ],
        });

        return () => {
            removeMenu("Apps");
        }
    }, [selectedApp]);

    useEffect(() => {
        const fetchedPinnedShortcut = async () => {
            const pinnedApps = await virtualFS.readdir("System/Taskbar");

            const isPinned = Object.keys(pinnedApps).some((name) => {
                const app = JSON.parse(pinnedApps[name].content).name === selectedApp?.name;

                return app;
            });

            setPinned(isPinned);

            const shortcutApps = await virtualFS.readdir("Desktop");

            const isShortcut = Object.keys(shortcutApps).some((name) => {
                const app = JSON.parse(shortcutApps[name].content).name === selectedApp?.name;

                return app;
            });

            setShortcutted(isShortcut);
        }

        fetchedPinnedShortcut();        
    }, [selectedApp]);

    const pin = async () => {
        const pinnedApps = await virtualFS.readdir("System/Taskbar");
        const name = Object.keys(undidApps).find((value) => JSON.parse(undidApps[value].content).name === selectedApp?.name);
        const app: App = JSON.parse(undidApps[name].content);
        
        if (!Object.keys(pinnedApps).includes(name)) {
            await virtualFS.writeFile("System/Taskbar", name, JSON.stringify({
                name: app.name,
                svg: app.svg,
            }), "pinn");
        } else {
            await virtualFS.deleteFile("System/Taskbar", name);
        }

        setSelectedApp(null);
    }

    const shortcut = async () => {
        const desktopApps = await virtualFS.readdir("Desktop");
        const name = Object.keys(undidApps).find((value) => JSON.parse(undidApps[value].content).name === selectedApp?.name);
        const app: App = JSON.parse(undidApps[name].content);
        
        if (!Object.keys(desktopApps).includes(name)) {
            await virtualFS.writeFile("Desktop", name, JSON.stringify({
                name: app.name,
                svg: app.svg,
            }), "shrt");
        } else {
            await virtualFS.deleteFile("Desktop", name);
        }

        setSelectedApp(null);
    }

    const deleteApp = async (): Promise<void> => {
        const apps = await virtualFS.readdir("Apps/");
    
        const thisApp = Object.keys(apps).find(name => {
            const app = JSON.parse(apps[name].content);
            return app.name === selectedApp?.name;
        });
        
        await virtualFS.deleteFile("Apps/", thisApp);
        return;
    }

    const openApp = async () => {
        const apps = await virtualFS.readdir("Apps/");
    
        const thisApp = Object.keys(apps).find(name => {
            const app = JSON.parse(apps[name].content);
            return app.name === selectedApp?.name;
        });

        setOpenedApps((prev) => [...prev, thisApp]);
    }

    return ( 
        <div className="p-2 text-text-base">
            {!selectedApp ? <div className="flex flex-col gap-2">
            {apps.map((app: App, index: number) => (
                <div className="flex flex-col w-full items-center justify-between hover:bg-secondary transition-colors duration-200 rounded p-1 cursor-pointer" key={index} onClick={() => setSelectedApp(app)}>
                    <div className="w-full flex flex-row justify-between items-center">
                        {app.svg.includes("svg") ? (
                            <div dangerouslySetInnerHTML={{ __html: app.svg }} className="invert w-12 h-12 p-2 rounded" />
                        ) : (
                            <img src={app.svg} alt={app.name} className="cursor-pointer w-12 h-12" />
                        )}
                        <h4 className="text-sm font-bold">{ app.name }</h4>
                    </div>
                    <hr className="" style={{ color: "white" }}/>
                </div>
            ))}
            </div> : <>
            <div className="flex flex-col gap-2 p-4">
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row gap-2 items-center justify-center">
                    {!selectedApp?.svg?.startsWith("data:image") && !selectedApp?.svg?.startsWith("https://") ? (
                        <div dangerouslySetInnerHTML={{ __html: selectedApp.svg }} className="invert w-12 h-12 p-2 rounded" />
                    ) : (
                        <img src={selectedApp.svg} alt={selectedApp.name} className="cursor-pointer w-10 h-10 rounded" />
                    )}
                    <h2 className="font-bold text-xl">{ selectedApp.name }</h2>
                    </div>
                    <Button onClick={() => setSelectedApp(null)}>Back <FontAwesomeIcon icon={faArrowLeft} /></Button>
                </div>
                <Button onClick={openApp}><FontAwesomeIcon icon={faArrowUpFromBracket} className="pr-1" />Open</Button>
                <Button onClick={pin}><FontAwesomeIcon icon={faThumbTack} className="pr-1" />{pinned ? "Unpin" : "Pin"}</Button>
                <Button onClick={shortcut}><FontAwesomeIcon icon={faArrowUpRightFromSquare} className="pr-1" />{shortcutted ? "Unshortcut" : "Shortcut"}</Button>
                <Button onClick={deleteApp}><FontAwesomeIcon icon={faTrash} className="pr-1" />Delete {selectedApp.name}</Button>
            </div>
            </>}
        </div>
    );
}
 
export default Apps;