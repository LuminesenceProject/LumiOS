import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Draggable from 'react-draggable';
import CustomContextMenu from './CustomContextMenu';
import apps from "../apps/Apps.json";
import { getFilesAndFolders } from '../Filesystem/indexedDB';

const Desktop = ({ openApp }) => {
  const [positions, setPositions] = useState({});
  const [currentUser, setCurrentUser] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [contextMenuVisible, setContextMenuVisible] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const [contextMenuApp, setContextMenuApp] = useState(null);
  const [selectedSize, setSelectedSize] = useState(32);
  const [isWhiteTheme, setIsWhiteTheme] = useState(false);
  const contextMenuRef = useRef(null);
  const [desktopItems, setDesktopItems] = useState([]); 

  useLayoutEffect(() => {
    const crntusr = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(crntusr);

    const storedPositions = localStorage.getItem(crntusr.name + 'desktopPositions');
    const iconSizes = localStorage.getItem(crntusr.name + 'iconSize');
    
    if (storedPositions) {
      setPositions(JSON.parse(storedPositions));
    }
    if (iconSizes) {
      setSelectedSize(iconSizes);
    }

    setIsWhiteTheme(true);

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    const fetchDesktopItems = async () => {
      const filesAndFolders = await getFilesAndFolders();
  
      // Filter folders from filesAndFolders
      const folders = filesAndFolders.filter((item) => item.type === 'folder' && item.parentId === 'desktop');
  
      // Filter apps with shortcut set to true
      const user = JSON.parse(localStorage.getItem("currentUser"));
      const appsWithShortcut = JSON.parse(localStorage.getItem(user.name + "-shortcutted-apps")) || [];
  
      // Combine folders and apps
      const desktopItems = [...folders, ...appsWithShortcut];
  
      setDesktopItems(desktopItems);
    };
  
    fetchDesktopItems();
  }, [positions]);
  

  const handleClickOutside = (event) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(event.target)) {
      setContextMenuVisible(false);
    }
  };

  const handleDrag = (app, position) => {
    setPositions((prevPositions) => ({
      ...prevPositions,
      [app.name]: { x: position.x, y: position.y },
    }));
  };

  const handleStop = () => {
    localStorage.setItem(currentUser.name + 'desktopPositions', JSON.stringify(positions));
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenuApp(item);
    setContextMenuPosition({ x: e.clientX, y: e.clientY });
    setContextMenuVisible(true);
  };

  const handleMenuItemClick = (action) => {
    switch (action) {
      case 'ChangeSize32':
        localStorage.setItem(currentUser.name + "iconSize", 32);
        setSelectedSize(32);
        setContextMenuVisible(false);
        break;
      case 'ChangeSize36':
        localStorage.setItem(currentUser.name + "iconSize", 36);
        setSelectedSize(36);
        setContextMenuVisible(false);
        break;
      case 'ChangeSize48':
        localStorage.setItem(currentUser.name + "iconSize", 48);
        setSelectedSize(48);
        setContextMenuVisible(false);
        break;
      case 'Personalize':
        openApp("Settings");
        setContextMenuVisible(false);
        break;
      case 'Terminal':
        openApp("Terminal");
        setContextMenuVisible(false);
        break;
      default:
        setContextMenuVisible(false);
        break;
    }
  };

  return (
    <div
      className="flex flex-col w-full h-screen p-5 absolute top-0 left-0"
      onContextMenu={(e) => handleContextMenu(e, contextMenuApp)}
      style={{background: "var(--background-image), none", backgroundRepeat: 'no-repeat', backgroundSize: "cover"}}
    >
      {desktopItems.map((item) => (
        <Draggable
          key={item.name}
          position={positions[item.name] || { x: 0, y: 0 }}
          onStop={handleStop}
          onDrag={(e, data) => handleDrag(item, data)}
        >
          <div
            className="flex flex-col justify-center items-center w-12 h-12 z-10"
            onDoubleClick={() => openApp(item.name)}
            onContextMenu={(e) => handleContextMenu(e, item)}
          >
            {item.svg.includes("svg") ? (
              <div dangerouslySetInnerHTML={{ __html: item.svg }} style={{width: selectedSize, height: selectedSize}} className="cursor-pointer invert" />
            ) : (
              <img src={item.svg} alt={item.name} style={{width: selectedSize, height: selectedSize}} className="cursor-pointer" />
            )}
            {editMode === item.name ? (
              <input
                type="text"
                value={item.name}
                onChange={(e) => handleNameChange(e, item)}
                onBlur={() => setEditMode(null)}
                autoFocus
                onClick={(e) => e.stopPropagation()}
              />
            ) : (
              <h3 className={`font-semibold text-sm ${isWhiteTheme && "invert"}`}>{item.name}</h3>
            )}
          </div>
        </Draggable>
      ))}
      <div ref={contextMenuRef}>
        <CustomContextMenu
          visible={contextMenuVisible}
          position={contextMenuPosition}
          onItemClick={handleMenuItemClick}
        />
      </div>
    </div>
  );
};

export default Desktop;