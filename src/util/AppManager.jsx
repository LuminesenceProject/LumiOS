import React, { useState, useEffect } from 'react';
import { fetchFileContentByName } from '../components/Filesystem/indexedDB';
import Apps from '../components/apps/Apps.json';
import Taskbar from '../components/Taskbar/Taskbar';
import Window from './Window';
import AppComponents from '../components/apps/AppComponents';
import Desktop from '../components/Desktop/Desktop';
import UserComponent from "../components/apps/UserComponent";
import useBrightness from './useBrightness';
import Search from '../components/Taskbar/Search';
import InfoMenu from '../components/Taskbar/InfoMenu';
import Sidebar from '../components/Notifications/Sidebar';
import BigSearch from '../components/Desktop/BigSearch';
import Prompt from './Prompt';
import version from './util';

const AppManager = ({ setIsLoggedIn, bootScreen }) => {
  const [openedApps, setOpenedApps] = useState([]);
  const [minimizedApps, setMinimizedApps] = useState([]);
  const [installedApps, setInstalledApps] = useState([]);
  const [openedUserApps, setOpenedUserApps] = useState([]);
  const [userApps, setUserApps] = useState([]);
  const [performanceArray, setPerformance] = useState([]);
  const [customWindowContent, setCustomWindowContent] = useState(null);
  const [search, setSearch] = useState(false);
  const [info, setInfo] = useState(false);
  const [sidebar, setSidebar] = useState(false);
  const [bigSearch, setBigSearch] = useState(false);
  const [battery, setBattery] = useState(0);
  const [firstLogin, setFirstLogin] = useState(false);

  const { currentBrightness, changeBrightness } = useBrightness();

  useEffect(() => {
    document.body.style.filter = `brightness(${currentBrightness})`;
  }, [currentBrightness]);

  useEffect(() => {
    // user first login stuffs
  
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  
    currentUser.firstLogin = false; // Update firstLogin to false
    localStorage.setItem("currentUser", JSON.stringify(currentUser)); // Store updated currentUser object
  
    // fetch current user installed apps, const user = ... wont work top level
    const fetchInstalledApps = async () => {
      try {
        const existingApps = JSON.parse(localStorage.getItem("Apps")) || [];
        const newApps = JSON.parse(localStorage.getItem(currentUser.name + "installedApps")) || [];
  
        // Merge newApps into existingApps without overwriting existing data
        newApps.forEach(newApp => {
          const index = existingApps.findIndex(app => app.name === newApp.name);
          if (index === -1) {
            existingApps.push(newApp);
          }
        });
  
        localStorage.setItem("Apps", JSON.stringify(existingApps));
        setInstalledApps(existingApps);
      } catch (error) {
        console.error("Error fetching installed apps:", error);
      }
    };
  
    fetchInstalledApps();
  }, []);  

  useEffect(() => {
    // Function to track CPU usage for an app, but really interval time
    const trackCPUUsage = (appName) => {
      const start = performance.now();
      const interval = setInterval(() => {
        const end = performance.now();
        const duration = end - start;
  
        // Round the duration to the nearest 10th
        const roundedDuration = Math.round(duration * 10) / 10;
  
        setPerformance((prev) => {
          // Filter out the previous data for the same appName
          const filteredData = prev.filter((item) => item.appName !== appName);
          return [...filteredData, { appName, duration: roundedDuration }];
        });
      }, 1000);
  
      return interval;
    };
  
    // Keep track of interval IDs
    const intervalIds = [];
  
    // Call trackCPUUsage for each opened app
    openedApps.forEach((appName) => {
      const isUserApp = installedApps.some(app => app.name === appName && app['user-installed']);
      if (isUserApp) {
        // For user-installed apps
        const intervalId = trackCPUUsage(appName);
        intervalIds.push(intervalId);
      } else {
        // For other apps
        const intervalId = trackCPUUsage(appName);
        intervalIds.push(intervalId);
      }
    });
  
    // Cleanup function to clear intervals when the component unmounts
    return () => {
      intervalIds.forEach((intervalId) => clearInterval(intervalId));
    };
  }, [openedApps, installedApps, setPerformance]);  

  useEffect(() => {
    let lastKeyPressTime = 0;
    const doublePressThreshold = 300; // Adjust as needed, this is in milliseconds

    const handleKeyDown = (event) => {
        if (event.code === "Space") {
            const currentTime = new Date().getTime();
            if (currentTime - lastKeyPressTime < doublePressThreshold) {
                // Spacebar is clicked twice
                setBigSearch(true);
            }
            lastKeyPressTime = currentTime;
        }
    };

    document.addEventListener("keydown", handleKeyDown);

    // Cleanup function to remove the event listener when the component unmounts
    return () => {
        document.removeEventListener("keydown", handleKeyDown);
    };
}, []);


  const openApp = async (appName) => {
    const isUserApp = installedApps.some((app) => app.name === appName && app['user-installed']);
  
    if (isUserApp) {

      // hide app
      if (openedUserApps.includes(appName)) {
        if (minimizedApps.includes(appName)) {
          minimizeApp(appName);
        } else {
          minimizeApp(appName);
        }
      } else {
        // check for user installed, or just user linked app
        const isUserHtml = installedApps.some((app) => app.name === appName && app.isUserHtml);
        if (!openedUserApps.includes(appName)) {
          if (isUserHtml) {
            try {
              const app = installedApps.find((app) => app.name === appName);
              if (app) {
                const fileContent = await fetchFileContentByName(appName);
                openWindowWithContent(appName, fileContent);
                setOpenedUserApps((prevApps) => [...prevApps, appName]);
              } else {
                console.error('App not found:', appName);
              }
            } catch (error) {
              console.error('Error opening user app:', error);
            }
          } else {
            setOpenedUserApps((prevApps) => [...prevApps, appName]);
            setUserApps((prevUserApps) => [...prevUserApps, appName]);
            closeCustomWindow();
          }
        }
      }
    } else {
      if (openedApps.includes(appName)) {
        // If the app is already opened, minimize it
        minimizeApp(appName);
      } else if (minimizedApps.includes(appName)) {
        // If the app is minimized, remove it from the minimizedApps array
        setMinimizedApps((prevMinimizedApps) => prevMinimizedApps.filter((app) => app !== appName));
      } else {
        // If the app is not opened or minimized, open it
        setOpenedApps((prevApps) => [...prevApps, appName]);
      }
    }
  };

  const minimizeApp = (appName) => {
    // Check if the app is already in the minimizedApps array
    const isAppMinimized = minimizedApps.includes(appName);
  
    if (isAppMinimized) {
      // If it's already minimized, remove it
      setMinimizedApps((prevMinimizedApps) => prevMinimizedApps.filter((app) => app !== appName));
    } else {
      // If it's not in the array, add it
      setMinimizedApps((prevMinimizedApps) => [...prevMinimizedApps, appName]);
    }
  };   

  // clears the minimized apps and opened apps arrays
  const closeApp = (appName) => {
    const isUserApp = installedApps.some((app) => app.name === appName && app['user-installed']);

    if (isUserApp) {
      setOpenedUserApps((prevApps) => prevApps.filter((app) => app !== appName));
      setUserApps((prevApps) => prevApps.filter((app) => app !== appName));
    
      // Check if the app is a user-installed app
      const isUserApp = installedApps.some((app) => app.name === appName && app['user-installed']);
      
      setMinimizedApps((prevMinimizedApps) => prevMinimizedApps.filter((app) => app !== appName));
    } else {
      setMinimizedApps((prevMinimizedApps) => prevMinimizedApps.filter((app) => app !== appName));
      setOpenedApps((prevOpenedApps) => prevOpenedApps.filter((app) => app !== appName));
    }
  };

  const handleSearch = () => {
    setSearch(!search);
  }

  const handleInfo = () => {
    setInfo(!info);
  }

  const openWindowWithContent = (title, content) => {
    // Ensure content is wrapped in a <div> tag to avoid rendering issues
    const formattedContent = `<div style="height: 100%;">${content}</div>`;
    
    // Set the custom window content
    setCustomWindowContent({ title, content: formattedContent });
  };  

  // Function to close the custom window
  const closeCustomWindow = () => {
    setCustomWindowContent(false);
  };

  return (
    <>
      <Desktop openApp={openApp} />

      {/* Render opened, minimized, and installed apps */}
      {customWindowContent && (
        <Window title={customWindowContent.title} onClick={closeCustomWindow} minimizedApps={minimizedApps}>
          <div className="resize h-full">
            {customWindowContent.content && (
              <iframe
                title="User App"
                srcDoc={customWindowContent.content || `<p style="text-align: center; font-weight: bold; font-size: 16px; animation: loading 1s infinite;">Loading HTML content...</p><style>@keyframes loading { 0% { content: '.'; } 25% { content: '..'; } 50% { content: '...'; } 75% { content: ''; } }</style>`}
                className="w-full h-full resize"
              />
              )
            }
          </div>
        </Window>
      )}
      {openedApps.map((appName) => {
        const AppComponent = AppComponents[appName];
        return (
          <Window key={appName} title={appName} appName={appName} onClick={() => closeApp(appName)} minimizedApps={minimizedApps} onMinimized={minimizeApp}>
            {AppComponent && <AppComponent openedApps={openedApps} closeApp={closeApp} openApp={openApp} openWindowWithContent={openWindowWithContent} performanceArray={performanceArray} bootScreen={bootScreen} />}
          </Window>
        );
      })}
      {userApps.map((appName, index) => {
        const userApp = installedApps.find((app) => app.name === appName && app.link);

        return (
          <Window key={index} title={appName} onClick={() => closeApp(appName)} minimizedApps={minimizedApps} onMinimized={minimizeApp}>
            {userApp && (
              <UserComponent link={userApp.link} />
            )}
          </Window>
        );
      })}
      {firstLogin && (
        <Prompt setShown={setFirstLogin}>
          <div className="bg-primary flex flex-col gap-2 items-center justify-center p-2 rounded">
            <h2 className="font-bold text-2xl">{ version.name }</h2>
            <p className="text-lg">Welcome to { version.name }! Here is a list of new features.</p>
            <ol>
              <li>Double click the spacebar for a search menu.</li>
              <li>Exporting and importing data has more information.</li>
              <li>Fixed missed version number for convert apps app.</li>
            </ol>
            <p className="text-sm font-bold">{ version.name } has constant updates, and not updating causes you to miss out on content. 
            <br/>For any bugs please report it at this <a style={{ color: 'blue' }} href="https://github.com/LuminesenceProject/LumiOS/issues">link</a>.</p>
          </div>
        </Prompt>
      )}
      {bigSearch && <BigSearch setShown={setBigSearch} openApp={openApp} />}
      <Search shown={search} setShown={setSearch} openApp={openApp} setIsLoggedIn={setIsLoggedIn} />
      <InfoMenu shown={info} setShown={setInfo} batteryLevel={battery} />
      <Sidebar shown={sidebar} setShown={setSidebar} />
      <Taskbar
        openApp={openApp}
        openedApps={openedApps}
        minimizedApps={openedUserApps}
        apps={Apps}
        setInfo={handleInfo}
        setSearch={handleSearch}
        setBattery={setBattery}
        setSidebar={setSidebar}
      />    
    </>
  );
};

export default AppManager;