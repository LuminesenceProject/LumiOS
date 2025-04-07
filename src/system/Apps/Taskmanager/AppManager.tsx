import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import virtualFS from "../../../utils/VirtualFS";
import { App, File, Folder } from "../../../utils/types";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { saveStamp } from "../../../structures/Timestamp";

interface AppManagerProps {
    openedApps: Array<string>;
    setOpenedApps: (prev: string[]) => void;
}

const AppManager: React.FC<AppManagerProps> = ({ openedApps, setOpenedApps }) => {
    const [undidApps, setUndidApps] = useState<{ [key: string]: File | Folder }>({});

    useEffect(() => {
        const fetchApps = async () => {
            const stored = await virtualFS.readdir("Apps");

            setUndidApps(stored);
        }

        fetchApps();
    }, []);

    const handleCloseApp = async (app: App) => {
        const name = Object.keys(undidApps).find((value) => {
            const undidApp = undidApps[value] as { content: string }; // Type assertion here
            return JSON.parse(undidApp.content).name === app.name;
        });
        const filteredApps = openedApps.filter(value => !value.includes(name as string));
        
        setOpenedApps(filteredApps);
        saveStamp({
            app: "AppManager",
            content: `Closed: ${app}`,
            openedApps: [],
        });
    }
    
    return ( 
        <div className="flex flex-col gap-2 p-2 h-full">
            <div className="flex flex-row justify-between border-b">
                <h3 className="font-bold text-xl">Title</h3>
                <h3 className="font-semibold text-xl">Terminate Process</h3>
            </div>
            <div className="flex flex-col h-full">
            {Object.keys(undidApps).length != 0 && openedApps.map((name, index) => {
                // @ts-ignore
                const app: App = JSON.parse(undidApps[name].content);
                const isEven: boolean = index % 2 == 0;

                return (
                    <div key={index} className={`flex items-center justify-between py-1 px-2 ${isEven ? "bg-secondary" : "bg-primary"}`}>
                        <h3 className="font-semibold">{ app.name }</h3>
                        <button className="button-main flex justify-center items-center gap-2" onClick={() => handleCloseApp(app)}>
                        Terminate
                        <FontAwesomeIcon icon={faClose} />
                        </button>
                    </div>
                );
            })}
            </div>
      </div>
    );
}
 
export default AppManager;