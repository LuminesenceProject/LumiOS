import { faGaugeHigh, faList, faMicrochip } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import AppManager from "./AppManager";
import PerformanceManager from "./PerformenceManager";
import BenchMarkManager from "./BenchmarkManager";
import { Stamp } from "../../../utils/types";
import { saveStamp } from "../../../structures/Timestamp";

interface TaskmanagerProps {
  openedApps: Array<string>;
  setOpenedApps: (prev: Array<string>) => void;
}

const Taskmanager: React.FC<TaskmanagerProps> = ({ openedApps, setOpenedApps }) => {
    const [activeMenu, setActiveMenu] = useState<number>(0);
    const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

    const getCurrentMenu = (): React.JSX.Element => {
        switch (activeMenu) {
            case 0: return <AppManager openedApps={openedApps} setOpenedApps={setOpenedApps} />;
            case 1: return <BenchMarkManager />;
            case 2: return <PerformanceManager />;
        }

        return <div />
    }

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    useEffect(() => {
      const stamp: Stamp = {
          app: "Taskmanager",
          content: `Menu: ${activeMenu}`,
          openedApps: openedApps,
      };

      saveStamp(stamp);
  }, [activeMenu]);

    return ( 
        <div className="flex flex-row h-full w-full bg-primary text-text-base overflow-hidden">
        {/* Collapsible Sidebar */}
        <div className={`flex flex-col h-full w-1/4 gap-2 p-2 bg-primary-light text-white rounded-t-md transition-all duration-500 ease-in-out ${sidebarOpen ? '' : 'w-16'}`}>
          <button className={`button-main ${activeMenu == 0 && "!bg-secondary"}`} onClick={() => setActiveMenu(0)}>
            {sidebarOpen ? <h3>Apps</h3> : <FontAwesomeIcon icon={faList} className="w-full h-full" />}
          </button>
          <button className={`button-main ${activeMenu == 1 && "!bg-secondary"}`} onClick={() => setActiveMenu(1)}>
            {sidebarOpen ? <h3>Benchmark</h3> : <FontAwesomeIcon icon={faGaugeHigh} className="w-full h-full" />}
          </button>
          <button className={`button-main ${activeMenu == 2 && "!bg-secondary"}`} onClick={() => setActiveMenu(2)}>
            {sidebarOpen ? <h3>GPU</h3> : <FontAwesomeIcon icon={faMicrochip} className="w-full h-full" />}
          </button>
          {/* Collapse/Expand Button */}
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
        {/* Main Content Area */}
        <div className="flex-1 w-3/4 flex-grow p-4 bg-white rounded-b-md overflow-auto">
          {getCurrentMenu()}
        </div>
      </div>
    );
}
 
export default Taskmanager;