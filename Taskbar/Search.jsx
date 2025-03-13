import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import Button from "../../util/Button";
import apps from "../apps/Apps.json";
import version from "../../util/util";

const Search = ({ openApp, shown, setShown, setIsLoggedIn }) => {
  const [dropdown, setDropdown] = useState(false);

  // use refs
  const searchRef = useRef(null);
  const userRef = useRef(null);

  // other statements
  const calculatedHeight = Math.max(18 * apps.length, window.innerHeight / 2);
  const storedApps = JSON.parse(localStorage.getItem("appData")) || [];
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const position = localStorage.getItem(currentUser.name + "position") || "south";
  const allApps = [...apps, ...storedApps];

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShown(false);
      }
      if (userRef.current && !userRef.current.contains(e.target)) {
        setDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div
    ref={searchRef}
    className={`absolute text-white ${position === "north" ? "top-16 origin-top" : position === "south" ? "bottom-16 origin-bottom" : position === "west" ? "left-32 top-16 origin-left" : "right-32 top-16 origin-right"} transform transition-transform duration-200 p-4 w-2/5 rounded-lg shadow-lg backdrop-blur-lg backdrop-brightness-90 z-20
     scale-0 ease-in-out ${shown && "scale-100"}`}
    style={{
      height: calculatedHeight,
    }}
    >
      <div className="grid grid-cols-5 gap-4">
        {allApps.slice(0, 10).map((app) => (
          <div
            className="flex flex-col justify-center items-center gap-2 cursor-pointer hover:bg-opacity-80 rounded p-2 hover:scale-105 transition-transform duration-200"
            key={app.name}               
            onClick={() => {
              openApp(app.name);
              setShown(!shown);
            }}
          >
              {app.svg.includes('<svg') ? (
                  <div dangerouslySetInnerHTML={{ __html: app.svg }} className="w-10 h-10 cursor-pointer invert" />
                ) : (
                  <img src={app.svg} alt={app.name} className="w-10 h-10 cursor-pointer" />
              )}
              <h1 className="font-semibold text-sm invert">{app.name}</h1>
          </div>
        ))}
      </div>
      <div className="flex flex-row justify-between p-5">
          <img src={version.image} alt="default image" className="w-10 h-10" />
          <button className="hover:scale-105 transition-transform duration-200" onClick={() => setDropdown(!dropdown)}>
            <FontAwesomeIcon icon={faPowerOff} className="invert" />
          </button> 
          <div 
            ref={userRef} 
            className={`absolute bg-primary text-text-base right-0 -translate-y-20 flex flex-col gap-2 backdrop-blur-lg backdrop-brightness-50 rounded p-2 scale-0 transition-transform duration-200 origin-bottom ${dropdown && "scale-100"}`}
            style={{
              position: 'absolute',
              backdropFilter: "blur(20px)",
            }}
          >
            <Button className=".button-main" onClick={() => {
                setIsLoggedIn(false); 
                sessionStorage.setItem("loggedIn", "");
            }}>
              Logout
            </Button>
            <Button className=".button-main" onClick={() => window.location.reload()}>
              Restart
            </Button>
          </div>
      </div>
    </div>
  );
};

export default Search;