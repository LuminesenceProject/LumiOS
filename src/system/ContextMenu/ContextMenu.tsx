import { IconDefinition, faCaretRight, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useRef, useState } from "react";

type ContextMenuProps = {
  menuPosition: { x: number; y: number };
  menuDropdown?: { [key: string]: () => void };
  menuActions: { [key: string]: () => void };
  emojis?: Array<IconDefinition>;
  dropDownName?: string;
  hideMenu: () => void;
};

const ContextMenu: React.FC<ContextMenuProps> = ({ menuPosition, menuActions, emojis, hideMenu, menuDropdown, dropDownName }) => {
  const contextRef = useRef<HTMLDivElement | null>(null);
  const [showing, setShowing] = useState<boolean>(false);
  const [showDropDown, setShowDropDown] = useState<boolean>(false);

  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (contextRef.current && !contextRef.current.contains(e.target as Node)) {
        hideMenu();
      }
    };

    document.addEventListener("click", handleDocumentClick);

    return () => {
      document.removeEventListener("click", handleDocumentClick);
    };
  }, [hideMenu]);

  useEffect(() => {
    // Trigger the showing effect after a short delay
    const showTimeout = setTimeout(() => {
      setShowing(true);
    }, 100);

    return () => {
      clearTimeout(showTimeout);
    };
  }, []);

  return (
    <div
      ref={contextRef}
      className={`absolute top-0 left-0 w-full h-full flex justify-center items-center transition-opacity duration-100 text-sm ${
        showing ? "opacity-100" : "opacity-0"
      }`}
      onClick={hideMenu}
    >
      <div
        className="shadow-lg backdrop-blur-lg bg-opacity-90 z-[100000] rounded-sm py-1"
        style={{
          background: "#212121",
          color: "white",
          position: "absolute",
          backdropFilter: "blur(20px)",
          left: `${menuPosition.x}px`,
          top: `${menuPosition.y}px`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {Object.keys(menuActions).map((action, index) => (
          <div
            key={index}
            onClick={menuActions[action]}
            className={`cursor-pointer hover:bg-primary-light transition-colors ease-in-out duration-100 px-2 py-1`}
          >
            {emojis && emojis[index] && (
                <span className="mr-1">
                    <FontAwesomeIcon className="h-4 w-4" icon={emojis[index]} />
                </span>
            )}
            {action}
          </div>
        ))}
        <hr style={{ color: "gray" }} className="w-11/12 text-center mx-auto" />
        {menuDropdown && (
          <>
            <div className="relative">
                <div
                    className="cursor-pointer hover:bg-primary-light transition-colors ease-in-out duration-100 px-2 py-1"
                    onMouseEnter={() => setShowDropDown(true)}
                    onMouseLeave={() => setShowDropDown(false)}
                >
                    {dropDownName} <FontAwesomeIcon icon={faCaretRight} />
                </div>
                <div
                    className="absolute left-full top-0 mt-1 w-32 shadow-lg rounded-sm py-1 bg-opacity-90 backdrop-filter backdrop-blur-lg z-[100000]"
                    style={{
                        background: "#212121",
                        opacity: showDropDown ? 1 : 0,
                        transform: `translateX(${showDropDown ? '0' : '-20%'})`,
                        transition: 'opacity 0.2s ease, transform 0.2s ease',
                        pointerEvents: showDropDown ? 'auto' : 'none',
                    }}
                    onMouseEnter={() => setShowDropDown(true)}
                >
                    {Object.keys(menuDropdown).map((dropdownItem, index) => (
                        <div
                            key={index}
                            onClick={menuDropdown[dropdownItem]}
                            className="cursor-pointer hover:bg-primary-light transition-colors ease-in-out duration-100 px-2 py-1"
                        >
                            {emojis && emojis[index + Object.keys(menuActions).length] && (
                                <span className="mr-1">
                                    <FontAwesomeIcon className="h-4 w-4" icon={emojis[index + Object.keys(menuActions).length]} />
                                </span>
                            )}
                            {dropdownItem}
                        </div>
                    ))}
                </div>
            </div>
            <hr style={{ color: "gray" }} className="w-11/12 text-center mx-auto" />
          </>
        )}
        <div
          onClick={() => {
            window.open("https://github.com/LuminesenceProject/LumiOS");
            hideMenu();
          }}
          className="cursor-pointer hover:bg-primary-light transition-colors ease-in-out duration-100 px-2 py-1"
        >
          <FontAwesomeIcon icon={faInfoCircle} className="pr-1" />
          About
        </div>
      </div>
    </div>
  );
};

export default ContextMenu;