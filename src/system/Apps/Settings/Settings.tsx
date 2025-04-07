import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretUp, faGear, faPalette, faShield, faStore, faWifiStrong } from "@fortawesome/free-solid-svg-icons";
import System from "./System";
import Themes from "./Themes";
import User from "./User";
import Apps from "./Apps";
import Security from "./Security";
import { Stamp } from "../../../utils/types";
import { saveStamp } from "../../../structures/Timestamp";
import Network from "./Network";
import { useTopbar } from "../../Topbar/useTopbar";

interface SettingsProps {
    openedApps: Array<string>;
    prePath: string;
    setOpenedApps: (prev: string[]) => void;
    setShowBootScreen: (prev: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({ openedApps, prePath, setOpenedApps, setShowBootScreen }) => {
    const [currentMenu, setCurrentMenu] = useState<number>(Number(prePath) || 0);
    const [sidebar, setSidebar] = useState(true);
    const { addMenu, removeMenu } = useTopbar();

    useEffect(() => {
        const menuToAdd = {
            title: 'Navigate',
            icon: faGear,
            dropdown: [
                { label: 'System', onClick: () => setCurrentMenu(0), icon: faGear },
                { label: 'Themes', onClick: () => setCurrentMenu(1), icon: faPalette },
                { label: 'Apps', onClick: () => setCurrentMenu(2), icon: faStore },
                { label: 'Network', onClick: () => setCurrentMenu(4), icon: faWifiStrong },
                { label: 'Security', onClick: () => setCurrentMenu(5), icon: faShield },
            ],
        };

        setTimeout(() => {
            addMenu(menuToAdd);
        }, 0);

        return () => removeMenu("Navigate");
    }, []);

    const getCurrentMenu = () => {
        switch (currentMenu) {
            case 0: {
                return <System />
            }
            case 1: {
                return <Themes />
            }
            case 2: {
                return <Apps setOpenedApps={setOpenedApps} />
            }
            case 3: {
                return <User />
            }
            case 4: {
                return <Network />
            }
            case 5: {
                return <Security setShowBootScreen={setShowBootScreen} />
            }
        }
    };

    useEffect(() => {
        const stamp: Stamp = {
            app: "Settings",
            content: `Menu: ${currentMenu}`,
            openedApps: openedApps,
        };

        saveStamp(stamp);
    }, [currentMenu]);

    return ( 
        <div className="flex flex-row h-full w-full overflow-hidden text-text-base">
            <div className={`flex flex-col h-full justify-between w-1/4 gap-2 p-2 bg-primary-light text-white rounded-t-md transition-all duration-500 ease-in-out ${sidebar ? '' : 'w-16'}`}>
                <div className="flex flex-col gap-2">
                    <button className={`button-main ${currentMenu == 0 && "!bg-secondary border-l-4"}`} style={{ borderColor: "var(--primary)"}} onClick={() => setCurrentMenu(0)}>{sidebar && "System"}<FontAwesomeIcon icon={faGear} /></button>
                    <button className={`button-main ${currentMenu == 1 && "!bg-secondary border-l-4"}`} style={{ borderColor: "var(--primary)"}} onClick={() => setCurrentMenu(1)}>{sidebar && "Themes"} <FontAwesomeIcon icon={faPalette} /></button>
                    <button className={`button-main ${currentMenu == 2 && "!bg-secondary border-l-4"}`} style={{ borderColor: "var(--primary)"}} onClick={() => setCurrentMenu(2)}>{sidebar && "Apps"} <FontAwesomeIcon icon={faStore} /></button>
                    <button className={`button-main ${currentMenu == 4 && "!bg-secondary border-l-4"}`} style={{ borderColor: "var(--primary)"}} onClick={() => setCurrentMenu(4)}>{sidebar && "Network"} <FontAwesomeIcon icon={faWifiStrong} /></button>
                    <button className={`button-main ${currentMenu == 5 && "!bg-secondary border-l-4"}`} style={{ borderColor: "var(--primary)"}} onClick={() => setCurrentMenu(5)}>{sidebar && "Security"} <FontAwesomeIcon icon={faShield} /></button>
                </div>
                <button onClick={() => setSidebar(!sidebar)}><FontAwesomeIcon icon={faCaretUp} /></button>
            </div>
            <div className="flex-1 w-3/4 flex-grow p-4 bg-white rounded-b-md overflow-auto">
                {getCurrentMenu()}
            </div>
        </div>
    );
}
 
export default Settings;