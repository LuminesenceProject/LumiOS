import { useState } from "react";
import { useContextMenu } from "../../ContextMenu/useContextMenu";
import ContextMenu from "../../ContextMenu/ContextMenu";
import Console from "./Console";
import JavascriptConsole from "./JavascriptConsole";

interface TerminalProps {
    setOpenedApps: (prev: string[]) => void;
    setCustomWindowContent: (prev: null[]) => void;
  }

const Terminal: React.FC<TerminalProps> = ({ setOpenedApps, setCustomWindowContent }) => {
    const [currentMenu, setCurrentMenu] = useState<number>(0);
    const [updatedMenuPosition, setUpdatedMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const { menuVisible, menuActions, showMenu, hideMenu } = useContextMenu();

    const getCurrentMenu = () => {
        switch (currentMenu) {
            case 0: {
                return <Console setCurrentMenu={setCurrentMenu} setOpenedApps={setOpenedApps} setCustomWindowContent={setCustomWindowContent} />;
            }
            case 1: {
                return <JavascriptConsole setCurrentMenu={setCurrentMenu} />;
            }
        };
    }

    const terminalContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
    
        // Get the position relative to the window
        const x = event.clientX;
        const y = event.clientY;
    
        // Get the bounding client rect of the parent component
        const rect = document.getElementById("terminal");
        const bounds = rect?.getBoundingClientRect();
    
        if (bounds) {
            // Calculate the relative position within the bounding rectangle
            const relativeX = x - bounds.left;
            const relativeY = y - bounds.top;
    
            // Update the state variable with the adjusted menu position
            setUpdatedMenuPosition({ x: relativeX, y: relativeY });
        }

        showMenu(event, currentMenu.toString(), {
            "Change Terminal": () => {
                setCurrentMenu((prevMenu: number) => prevMenu == 0 ? 1 : 0);
                hideMenu();
            },

        });

        event.stopPropagation();
    }

    return ( 
        <div className="w-full h-full" id="terminal" onContextMenu={(e) => terminalContextMenu(e)}>
            {getCurrentMenu()}
            {menuVisible && (
                <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} />
            )}
        </div>
    );
}
 
export default Terminal;