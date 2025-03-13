import { useState } from "react";
import Button from "../../util/Button";
import Users from "./Users";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faGear, faServer, faUsersGear, faX } from "@fortawesome/free-solid-svg-icons";
import Pruxy from "./Pruxy";
import System from "./System";

const Boot = ({ setBootScreen }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [currentScreen, setCurrentScreen] = useState(0);

    const getCurrentScreen = () => {
        switch(currentScreen) {
            case 1: {
                // Was system, but is redundant
                return <System />;
            }

            case 2: {
                return <Users />;
            }

            case 3: {
                return <Pruxy />;
            }

            default: {
                return (
                    <div className="flex flex-col w-full h-full justify-center items-center">
                        <h3 className="font-bold text-lg my-2">Boot Screen</h3>
                        <p>The boot screen offer a higher level of control for fixing bugs, but can cause permanant errors.</p>
                        <p className="my-2">If you got here by mistake, please click the button below to leave.</p>
                        <Button onClick={handleClose}>
                            Close
                        </Button>
                    </div>
                )
            }
        }
    }

    const handleClose = () => {
        setBootScreen(false);
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return ( 
        <div className="absolute flex flex-row inset-0 bg-primary-light z-50 text-text-base">
            <div className={`flex flex-col justify-between h-full w-1/4 min-w-16 gap-2 p-2 bg-primary text-white rounded-t-md transition-all duration-500 ease-in-out overflow-y-auto overflow-x-hidden ${sidebarOpen ? '' : 'w-16'}`}>
                <div className="flex flex-col gap-2">
                    <Button onClick={() => setCurrentScreen(0)}>
                        {sidebarOpen ? "Back" : <FontAwesomeIcon icon={faArrowLeft} />}
                    </Button>
                    <Button onClick={() => setCurrentScreen(1)}>
                        {sidebarOpen ? "System" : <FontAwesomeIcon icon={faGear} />}
                    </Button>
                    <Button onClick={() => setCurrentScreen(2)}>
                        {sidebarOpen ? "Users" : <FontAwesomeIcon icon={faUsersGear} />}
                    </Button>
                    <Button onClick={() => setCurrentScreen(3)}>
                        {sidebarOpen ? "Proxy" : <FontAwesomeIcon icon={faServer} />}
                    </Button>
                </div>
                <div className="flex flex-col gap-2">
                    <Button onClick={handleClose} className={``}>
                        {sidebarOpen ? "Close" : <FontAwesomeIcon icon={faX} />}
                    </Button>
                    <button
                    className="button-main mt-auto flex items-center justify-center"
                    onClick={toggleSidebar}
                    >
                    {/* Circle Arrow Icon (Customize as needed) */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-6 w-6 transform transition-transform ${sidebarOpen ? '' : 'rotate-180'}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d={sidebarOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                        />
                    </svg>
                    </button>
                </div>
            </div>
            <div className="w-3/4 flex-grow overflow-x-hidden overflow-y-auto">
                {getCurrentScreen()}
            </div>
        </div>
    );
}
 
export default Boot;