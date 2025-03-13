import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { notifications } from '../Notifications/Notifications';
import version from '../../util/util';
import Battery from './Battery';
import Time from './Time';
import Wifi from './Wifi';
import { useLayoutEffect, useState } from 'react';

const Taskbar = ({ openApp, minimizedApps, openedApps, apps, setSearch, setInfo, setBattery, setSidebar }) => {
  const [pinnedApps, setPinnedApps] = useState([]);
  // Parse the data from local storage, or use the props as a fallback
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const position = localStorage.getItem(currentUser.name + "position") || "south";

  useLayoutEffect(() => {
    const pinnedApps = JSON.parse(localStorage.getItem(currentUser.name + "-pinned-apps")) || [];

    setPinnedApps(pinnedApps);
  }, []);
  
  const HoverAnimation = (props) => {
    const isAppOpened = openedApps.includes(props.appName);
  
    return (
        <div
          className={`group flex justify-center items-center hover:scale-105 hover:backdrop-brightness-200 active:scale-95 w-12 h-12 cursor-pointer transition-transform duration-200 ${minimizedApps.includes(props.appName) || isAppOpened ? 'border-b-2 border-primary-light' : ''}`}
          onClick={() => openApp(props.appName)}
        >
          <div className={`text-text-base pointer-events-none absolute z-50 bg-primary-light rounded px-2 ${position === "north" ? "origin-top translate-y-10" : "origin-bottom -translate-y-10"} origin-bottom scale-0 ease-linear duration-100 group-hover:scale-100`}>
            <h2>{ props.appName }</h2>
          </div>
        {props.children}
      </div>
    );
  };  

  const OpenedAppsComponents = openedApps.map((appName) => {
    const app = apps.find((app) => app.name === appName);
  
    // Use a default SVG if app or app.svg is undefined
    const defaultSvg = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15h-2v-6h2v6zm4 0h-2v-2h2v2z"/></svg>';
  
    return (
      <HoverAnimation key={appName} appName={appName} className="group relative">
        <div className="group relative flex justify-center items-center h-5/6 w-5/6">
          {app && app.svg && app.svg.includes('<svg') ? (
            // Render SVG content directly if it's an SVG
            <div dangerouslySetInnerHTML={{ __html: app.svg }} className={`h-5/6 w-5/6 invert`} />
          ) : (
            // Render default SVG if app or app.svg is undefined
            <div dangerouslySetInnerHTML={{ __html: defaultSvg }} className={`h-5/6 w-5/6 invert`} />
          )}
        </div>
      </HoverAnimation>
    );
  });

  return (
    <div className={`flex  ${position === "north" ? "top-0 flex-row w-full" : position === "south" ? "bottom-0 flex-row w-full" : position === "west" ? "left-0 flex-col h-full" : "right-0 flex-col h-full"} justify-between items-center gap-2 absolute z-20 text-white backdrop-blur-lg bg-opacity-80 backdrop-brightness-75 p-1 shadow`}>
      <div className={`flex ${position === "north" ? "flex-row" : position === "south" ? "flex-row" : "flex-col"} gap-4`}>
        <div className="group">
          <div
            className={`flex justify-center items-center hover:scale-105 w-12 h-12 cursor-pointer transition-transform duration-200`}
            onClick={setSearch}
          >
            <img src={version.image} alt="Taskbar" className="group-hover:opacity-100"/>
          </div>
        </div>
        {pinnedApps.filter((app, index, array) => (
          app.pinned && array.findIndex(a => a.name === app.name) === index
        )).map((app) => (
          <HoverAnimation key={app.name} appName={app.name} className="group relative">
            <div className="relative flex justify-center items-center h-5/6 w-5/6">
              {app.svg.includes('<svg') ? (
                // Render SVG content directly if it's an SVG
                <div dangerouslySetInnerHTML={{ __html: app.svg }} className={`h-5/6 w-5/6 invert`} />
              ) : (
                // Render image if it's a link
                <img src={app.svg} alt={app.name} className="h-5/6 w-5/6 object-cover" />
              )}
            </div>
          </HoverAnimation>
        ))}
        {OpenedAppsComponents}
      </div>
      <div className={`flex ${position === "north" ? "flex-row" : position === "south" ? "flex-row" : "flex-col"} hover:backdrop-brightness-200 hover:scale-105 transition-transform duration-200 h-12 gap-2 justify-center items-center ml-auto hover:cursor-pointer rounded p-1 invert`} onClick={setInfo}>
        <Battery setBattery={setBattery} />
        <div className="invert">
          <Wifi />
        </div>
        <Time />
      </div>
      <div className="flex justify-center items-center hover:cursor-pointer hover:scale-105 transition-transform duration-200 invert w-12 h-12" onClick={() => setSidebar(true)}>
        <FontAwesomeIcon className={`w-1/2 h-1/2 ${notifications.length > 0 && "shake"}`} icon={faBell} />
        {notifications.length > 0 && (
          <p className="absolute invert-0 right-0 top-0 font-extrabold scale-150" style={{color: "red", filter: "invert(1)"}}>!</p>
        )}
      </div>
    </div>
  );
};

export default Taskbar;