import { useEffect, useState } from "react";
import Button from "../Button";
import Welcome from "../FirstStart/Welcome";
import Themes from "../FirstStart/Themes";
import Background from "../FirstStart/Background";
import Apps from "../FirstStart/Apps";
import Endscreen from "../FirstStart/Endscreen";
import virtualFS from "../../utils/VirtualFS";
import User from "../FirstStart/User";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StartupProps {
    setFirstLogin: (prev: boolean) => void;
    setSignedIn: (prev: boolean) => void;
    setShowBootScreen: (prev: boolean) => void;
}

const Startup: React.FC<StartupProps> = ({ setFirstLogin, setSignedIn, setShowBootScreen }) => {
    const [currentMenu, setCurrentMenu] = useState<number>(0);
    const [canContinue, setCanContinue] = useState<boolean>(false);
    const [finishedMenus, setFinishedMenus] = useState<boolean[]>([false, false, false, false, false]);

    useEffect(() => {
        if (canContinue) {
            finishedMenus[currentMenu] = true;
        }

        if (finishedMenus[currentMenu]) {
            setCanContinue(true);
        }
    }, [canContinue]);

    const getMenu = () => {
        switch (currentMenu) {
            case 0: return <Welcome setCanContinue={setCanContinue} />
            case 1: return <Themes setCanContinue={setCanContinue} canContinue={canContinue} />
            case 2: return <Background setCanContinue={setCanContinue} canContinue={canContinue} />
            case 3: return <Apps setCanContinue={setCanContinue} />
            case 4: return <User setSignedIn={setSignedIn} setCanContinue={setCanContinue} />
            case 5: return <Endscreen setCanContinue={setCanContinue} />
        }
    }

    const handleFinish = async () => {
        await virtualFS.deleteFile("System/", "FirstStart");
        await virtualFS.writeFile("System/", "FirstStart", JSON.stringify("false"), "sys");

        setFirstLogin(false);
        localStorage.setItem("firstlogin", JSON.stringify("false"));
    }

    const nextMenu = () => {
        if (currentMenu!==5) {
            setCanContinue(false);
        }

        setCurrentMenu(currentMenu+1);
    };

    const prevMenu = () => {
        setCanContinue(true);
        setCurrentMenu(currentMenu-1);
    };

    const handleSkip = () => {
        setCurrentMenu(5);

        setFinishedMenus([true, true, true, true, true]);
    };

    return (
        <div className="flex flex-col w-full h-screen bg-primary text-text-base">
            <div className="flex justify-center items-center flex-grow h-full w-full bg-primary">
            {getMenu()}
            </div>
            {currentMenu == 0 &&             <div className="absolute p-2 z-20 left-0">
                <Button onClick={() => setShowBootScreen(true)}>Enter BIOS</Button>
            </div>}
            <div className="absolute p-2 z-20 right-0">
                <Button onClick={handleSkip} disabled={currentMenu == 5}>Skip <FontAwesomeIcon icon={faChevronRight} /></Button>
            </div>
            <div className="flex justify-around w-full">
                <Button className="w-full" disabled={currentMenu==0} onClick={prevMenu}>Back</Button>
                {currentMenu == 5 ? 
                <>
                    <Button className="w-full" onClick={handleFinish}>Finish</Button>
                </> :
                    <Button className="w-full" disabled={!canContinue} onClick={nextMenu}>Forward</Button>
                }
            </div>
        </div> 
    );
}
 
export default Startup;