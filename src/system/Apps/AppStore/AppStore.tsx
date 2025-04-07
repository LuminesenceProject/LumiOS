import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import PluginStore from "./AppStore/PluginStore";
import GameStore from "./GameStore/GameStore";
import { faCaretUp, faDownload, faGamepad, faPlug } from "@fortawesome/free-solid-svg-icons";
import { saveStamp } from "../../../structures/Timestamp";
import { useTopbar } from "../../Topbar/useTopbar";
import Downloads from "./Downloads";

interface AppStoreProps {
  setPrompts: (prev: any[]) => void;
}

const AppStore: React.FC<AppStoreProps> = ({ setPrompts }) => {
  const [sidebar, setSidebar] = useState(false);
  const [menu, setMenu] = useState(0);
  const { addMenu, removeMenu } = useTopbar();

  useEffect(() => {
    saveStamp({
      app: "AppStore",
      content: `Menu: ${menu}`,
      openedApps: [],
    });
  }, [menu]);

  useEffect(() => {
    const appMenu = {
      title: "Appstore",
      dropdown: [
        { label: "Games", onClick: () => setMenu(0), icon: faGamepad },
        { label: "Plugins", onClick: () => setMenu(1), icon: faPlug },
      ],
    };

    setTimeout(() => {
      addMenu(appMenu);
    }, 0);

    return () => removeMenu("Appstore");
  }, []);

  const getMenu = () => {
    switch (menu) {
      case 0: return <GameStore setPrompts={setPrompts} />
      case 1: return <PluginStore />
      case 2: return <Downloads />
    }
  };

  return (
    <div className="flex flex-row h-full w-full overflow-hidden text-text-base overflow-y-auto">
      <div className={`flex flex-col justify-between h-full ${sidebar ? "min-w-[25%]" : "w-16"} bg-secondary`}>
          <div className="flex flex-col gap-2">
              <button className={`button-main ${menu !== 0 && "!bg-secondary"}`} onClick={() => setMenu(0)}>{sidebar && "Games"}<FontAwesomeIcon icon={faGamepad} /></button>
              <button className={`button-main ${menu !== 1 && "!bg-secondary"}`} onClick={() => setMenu(1)}>{sidebar && "Plugins"} <FontAwesomeIcon icon={faPlug} /></button>
              <button className={`button-main ${menu !== 2 && "!bg-secondary"}`} onClick={() => setMenu(2)}>{sidebar && "Downloads"} <FontAwesomeIcon icon={faDownload} /></button>
          </div>
          <button onClick={() => setSidebar(!sidebar)}><FontAwesomeIcon icon={faCaretUp} /></button>
      </div>
      <div className="flex-grow overflow-hidden overflow-y-auto h-full">
        {getMenu()}
      </div>
    </div>
  );
};

export default AppStore;