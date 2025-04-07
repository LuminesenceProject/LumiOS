import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize, faMinus, faPlus, faWindowClose, faWindowMaximize, faX } from '@fortawesome/free-solid-svg-icons';
import { Rnd, RndResizeCallback, RndDragCallback } from 'react-rnd';
import { useContextMenu } from '../system/ContextMenu/useContextMenu';
import ContextMenu from '../system/ContextMenu/ContextMenu';
import virtualFS from '../utils/VirtualFS';
import { Stamp } from '../utils/types';
import { saveStamp } from './Timestamp';
import { useTopbar } from '../system/Topbar/useTopbar';

interface WindowProps {
  title: string;
  children: React.ReactNode;
  openedApps: Array<string>;
  setOpenedApps: Function;
  id: string | number;
  custom?: boolean;
}

const Window: React.FC<WindowProps> = ({ title, children, setOpenedApps, openedApps, id = title, custom }) => {
  const windowRef = useRef<HTMLDivElement>(null);
  const childrenRef = useRef<HTMLDivElement>(null);
  const [isMaximized, setMaximized] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [originalSizeAndPos, setOriginalSizeAndPos] = useState({
    width: 500,
    height: 400,
    x: (window.innerWidth - 500) / 2,
    y: (window.innerHeight - 400) / 2,
  });
  const [topbarStyle, setTopBarStyle] = useState({});
  const [lastNonMaximizedPosition, setLastNonMaximizedPosition] = useState({ x: (window.innerWidth - 500) / 2, y: (window.innerHeight - 400) / 2 });
  const [position, setPosition] = useState({ x: (window.innerWidth - 500) / 2, y: (window.innerHeight - 400) / 2 });
  const [size, setSize] = useState({ width: 500, height: 400 });
  const [updatedMenuPosition, setUpdatedMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zIndex, setZIndex] = useState(10);
  const { menuVisible, menuActions, showMenu, hideMenu } = useContextMenu();
  const { menus, addMenu, removeMenu } = useTopbar();

  useLayoutEffect(() => {

    const fetchStoredStyles = async (): Promise<void> => {
      const value = await virtualFS.readfile("System/Plugins/", "Window");
      
      setTopBarStyle(JSON.parse(value.content));
      
      const fetchedSVG = await virtualFS.readfile("Apps/", title);
      const svg = fetchedSVG?.content && JSON.parse(await fetchedSVG.content).svg || "";
      
      addMenu({
        title: title,
        icon: svg,
        dropdown: [
          { label: "Quit", onClick: handleClose, icon: faX },
          { label: `${isMaximized ? "Exit Fullscreen" : "Fullscreen"}`, onClick: onMaximize, icon: faWindowMaximize },
          { label: `${isMinimized ? "Restore" : "Minimize"}`, onClick: onMinimize, icon: faMinus },
        ],
      });
    }

    fetchStoredStyles();

    const stamp: Stamp = {
      app: title,
      content: `Custom: ${custom}`,
      openedApps: openedApps,
    }

    saveStamp(stamp);

    return () => removeMenu(title);
  }, [isMaximized, isMinimized]);

  useEffect(() => {
    if (windowRef.current) {
      const windowElement = windowRef.current;
      // Set initial state for fade-in and slide-up
      windowElement.style.opacity = "0";
      windowElement.style.transform = "translateY(20px)";
  
      // Force reflow to apply initial styles before transition
      windowElement.getBoundingClientRect();
  
      // Apply the transition and final state
      windowElement.style.transition = "opacity 300ms ease, transform 300ms ease"; // Transition for both opacity and transform
      windowElement.style.opacity = "1";
      windowElement.style.transform = "translateY(0)";
    }
  }, []);  

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
  
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [title, openedApps]);

  useEffect(() => {
    if (!isMaximized) {
      setPosition(lastNonMaximizedPosition);
    }
  }, [isMaximized]);

  const handleOutsideClick = (e: MouseEvent) => {
    const childrenElement = document.getElementById(`${title}-content`);
    const isOnlyApp = openedApps.length == 1;
    
    if (windowRef.current && !windowRef.current.contains(e.target as Node) && !isOnlyApp) {
      setZIndex(5);
      childrenElement!.style.transition = "filter 0.3s ease"; // Add transition effect
      childrenElement!.style.filter = "brightness(50%)";

      //removeMenu(title);
    } else {
      setZIndex(10);
      childrenElement!.style.transition = "filter 0.3s ease"; // Add transition effect
      childrenElement!.style.filter = "brightness(100%)";

      if (menus.some(value => value.title === title)) return;

      addMenu({
        title: title,
        icon: faWindowMaximize,
        dropdown: [
          { label: "Quit", onClick: handleClose, icon: faX },
          { label: `${isMaximized ? "Exit Fullscreen" : "Fullscreen"}`, onClick: onMaximize, icon: faWindowMaximize },
          { label: `${isMinimized ? "Restore" : "Minimize"}`, onClick: onMinimize, icon: faMinus },
        ],
      });
    }
  };

  const onMaximize = () => {
    if (!isMaximized) {
      setOriginalSizeAndPos({
        width: size.width,
        height: size.height,
        x: position.x,
        y: position.y,
      });
      setSize({ width: window.innerWidth - 10, height: window.innerHeight - 10 });
      setPosition({ x: 0, y: 0 });
    } else {
      setSize({ width: originalSizeAndPos.width, height: originalSizeAndPos.height });
      setPosition({ x: originalSizeAndPos.x, y: originalSizeAndPos.y });
    }
    setMaximized(!isMaximized);    
  };

  const onMinimize = () => {
    const content = document.getElementById(`${title}-content`);

        if (!isMinimized) {
            content!.style.display = "none";
            setSize(prevSize => ({ ...prevSize, height: 0 }));
            setIsMinimized(true);
        } else {
            content!.style.display = "";
            setSize(prevSize => ({ ...prevSize, height: originalSizeAndPos.height }));
            setIsMinimized(false);
        }
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    handleOutsideClick(e);

    setDragging(true);
  };
  

  const handleDragStop: RndDragCallback = (e, d) => {
    if (!isMaximized) {
      setPosition({ x: d.x, y: d.y });
      setLastNonMaximizedPosition({ x: d.x, y: d.y });
    }
  };

  const handleResizeStop: RndResizeCallback = (e, direction, ref, delta, position) => {
    if (!isMaximized) {
      const newSize = {
        width: size.width + delta.width,
        height: size.height + delta.height,
      };
      setSize(newSize);
    }
  };

  const handleClose = () => {
    const windowElement = windowRef.current;
    if (!windowElement) return;    

    // Fade out with opacity transition
    windowElement.style.opacity = "0";
    windowElement.style.transition = "opacity 300ms ease"; // Adjust the duration and easing as needed

    // Slide up with translateY
    windowElement.style.transform = "translateY(20px)";
    windowElement.style.transition += ", transform 300ms ease"; // Append to the existing transition

    // After the transition is complete, call onClick
    setTimeout(() => {
      if (custom) {        
        setOpenedApps((prev: Array<object>) => prev.filter((customContent) => customContent.title !== title));
      } else {
        setOpenedApps((prev: Array<string>) => prev.filter((name) => name !== title));
      }      
      windowElement.style.opacity = "1";
      windowElement.style.transform = "none";

      removeMenu(title);
    }, 300);
  };

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault();

    // Get the position relative to the window
    const x = event.clientX;
    const y = event.clientY;

    // Get the bounding client rect of the parent component
    const rect = document.getElementById(id as string);
    const bounds = rect?.getBoundingClientRect();

    if (bounds) {
        // Calculate the relative position within the bounding rectangle
        const relativeX = x - bounds.left;
        const relativeY = y - bounds.top;

        // Update the state variable with the adjusted menu position
        setUpdatedMenuPosition({ x: relativeX, y: relativeY });
    }

    const funcname = isMaximized ? "Unfullscreen" : "Fullscreen";

    const menuOptions: { [key: string]: () => void } = {
      "Close": () => {
        handleClose();
        hideMenu();
      },
    };
    
    menuOptions[funcname] = () => {
      onMaximize();
      hideMenu();
    };
    
    showMenu(event, "", menuOptions);
    

    event.stopPropagation();
  }

  return (
    <Rnd
      bounds="body"
      size={size}
      position={position}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      disableDragging={dragging}
      style={{
        boxSizing: 'border-box',
        position: isMaximized ? 'fixed' : 'absolute',
        width: isMaximized ? window.innerWidth : size.width,
        height: isMaximized ? window.innerHeight : size.height,
        minHeight: '400px',
        minWidth: "500px",
        maxWidth: window.innerWidth,
        maxHeight: window.innerHeight,
        zIndex: zIndex,
      }}
      default={{
        x: position.x,
        y: position.y,
        width: size.width,
        height: size.height,
      }}
      className={`rounded-sm shadow-lg z-40 transition-opacity flex flex-col ${isMaximized && "mt-7"}`}
      element-type="window"
      id={id}
    >
      <div className="h-[calc(100%-32px)] block z-50" ref={windowRef} onContextMenu={() => {}}>
        <div style={topbarStyle} onContextMenu={(e) => handleContextMenu(e)} onDoubleClick={onMaximize} onMouseDown={() => setDragging(false)}>
          <div className="flex items-center justify-between">
            <div className="flex-grow font-bold pl-2">{title}</div>
              <div className="flex">
                  <button className="text-white transition-all duration-100 active:scale-95 w-8 h-8 p-0 hover:bg-primary-light" onClick={onMinimize}>
                      <FontAwesomeIcon
                          icon={isMinimized ? faPlus : faMinus}
                          style={{
                              cursor: 'pointer',
                              transition: 'color 0.3s ease-in-out',
                          }}
                      />
                  </button>
                  <button className="text-white transition-all duration-100 active:scale-95 w-8 h-8 p-0 hover:bg-primary-light" onClick={onMaximize}>
                      <FontAwesomeIcon
                          icon={faWindowMaximize}
                          style={{
                              cursor: 'pointer',
                              transition: 'color 0.3s ease-in-out',
                          }}
                      />
                  </button>
                  <button className="text-white transition-all duration-100 active:scale-95 w-8 h-8 p-0 hover:bg-[#ff0000]" onClick={handleClose}>
                      <FontAwesomeIcon
                          icon={faWindowClose}
                          style={{
                              cursor: 'pointer',
                              transition: 'color 0.3s ease-in-out',
                          }}
                      />
                  </button>
              </div>
          </div>
        </div>
        <div id={`${title}-content`} ref={childrenRef} className={`bg-primary cursor-auto overflow-auto flex-grow w-full h-full !text-text-base ${isMaximized && "pb-14"}`} onMouseDown={handleMouseDown} onContextMenu={() => {}}>
          {children}
        </div>
      </div>
      {menuVisible && (
        <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} emojis={[faX, faMaximize]} />
      )}
    </Rnd>
  );
};

export default Window;