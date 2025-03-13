import React, { useState, useEffect, useLayoutEffect } from 'react';
import Button from "../../util/Button";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faGear, faGears, faPalette, faUser } from '@fortawesome/free-solid-svg-icons';
import useBrightness from '../../util/useBrightness';
import { importSettings, exportSettings } from "../../util/ImportExport";
import version from "../../util/util";
import Advanced from '../Settings/Advanced';
import Themes from '../Settings/Themes';
import Prompt from "../../util/Prompt";
import apps from "../apps/Apps.json";
import { faAppStore } from '@fortawesome/free-brands-svg-icons';

const Settings = ({ bootScreen }) => {
  const [appData, setAppData] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isApp, setIsApp] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [enableQuickLoad, setEnableQuickLoad] = useState(false);
  const [selectedJSONFile, setSelectedJSONFile] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const { currentBrightness, changeBrightness } = useBrightness();
  const [displayBrightness, setDisplayBrightness] = useState(1);
  const [displaySound, setDisplaySound] = useState(100);

  useLayoutEffect(() => {
    // Get current user
    const crntusr = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(crntusr);
  
    // Load data from local storage or fetch it from an API
    const storedData = JSON.parse(localStorage.getItem(crntusr.name + 'installedApps')) || [];
    setAppData([...storedData, ...apps]);
  
    // Convert the string representation to a boolean
    const storedQuickLoad = localStorage.getItem("quickLoad");
    setEnableQuickLoad(storedQuickLoad === "true" ? true : false);
  }, []);  

  useEffect(() => {
      document.body.style.filter = `brightness(${currentBrightness})`;
  }, [currentBrightness]);

  const updatePinnedStatus = (appName) => {
    const pinnedApps = JSON.parse(localStorage.getItem(currentUser.name + "-pinned-apps")) || [];

    const appIndex = pinnedApps.findIndex(app => app.name === appName);

    if (appIndex !== -1) {
      pinnedApps.splice(appIndex, 1);
    } else {
      const app = appData.find(app => app.name === appName);
      if (app) {
        app.pinned = true;
        pinnedApps.push(app);
      } else {
        console.log("App not found in appData.");
        return;
      }
    }

    localStorage.setItem(currentUser.name + "-pinned-apps", JSON.stringify(pinnedApps));
  };

  const updateShortcutStatus = (appName) => {
    const shortcuttedApps = JSON.parse(localStorage.getItem(currentUser.name + "-shortcutted-apps")) || [];

    const appIndex = shortcuttedApps.findIndex(app => app.name === appName);

    if (appIndex !== -1) {
      shortcuttedApps.splice(appIndex, 1);
    } else {
      const app = appData.find(app => app.name === appName);
      if (app) {
        app.pinned = true;
        shortcuttedApps.push(app);
      } else {
        console.log("App not found in appData.");
        return;
      }
    }

    localStorage.setItem(currentUser.name + "-shortcutted-apps", JSON.stringify(shortcuttedApps));
  };

  const deleteApp = (appName) => {
    let installedApps = JSON.parse(localStorage.getItem(currentUser.name + "installedApps")) || [];

    installedApps = installedApps.filter(app => app.name !== appName);
    localStorage.setItem(currentUser.name + "installedApps", JSON.stringify(installedApps));
  };
  
  const handleTaskbarPosition = (position) => {
    localStorage.setItem(currentUser.name + "position", position);
  }

  const handleSetting = (setting) => {
    setSelectedApp(setting);
    setIsApp(false);
  }

  const handleExport = () => {
    exportSettings();
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleBrightnessChange = (event) => {
    const newBrightness = parseFloat(event.target.value);
    setDisplayBrightness(Math.round((newBrightness / 1.5) * 100));
    changeBrightness(newBrightness);
  };

  const handleSoundChange = (event) => {
    // Create an AudioContext
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    // Create a GainNode to control the global volume
    const globalGainNode = audioContext.createGain();
  
    // Get the value from the sound input range (between 0 and 100)
    const soundValue = parseFloat(event.target.value) / 100;
    setDisplaySound(Math.round(soundValue * 100));
  
    // Set the gain value based on the sound input value
    globalGainNode.gain.value = soundValue;
  
    // Connect the global gain node to the audio context's destination (output)
    globalGainNode.connect(audioContext.destination);
  
    // Iterate through all audio elements on the page and connect them to the global gain node
    const audioElements = document.querySelectorAll('audio');
    audioElements.forEach((audioElement) => {
      const sourceNode = audioContext.createMediaElementSource(audioElement);
      sourceNode.connect(globalGainNode);
    });
  };

  const handleJSONFileChange = (event) => {
    setSelectedJSONFile(event.target.files[0]);
  };

  const handleImport = () => {
    if (selectedJSONFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const importedJson = e.target.result;
        importSettings(importedJson);
      };

      reader.readAsText(selectedJSONFile);
    } else {
      alert('Please select a JSON file.');
    }
  };

  const verifyReset = () => {
      if (window.confirm("Do you want to reset" + version.name + "?")) {
          setShowReset(false);
          localStorage.clear();
          sessionStorage.clear();
          indexedDB.deleteDatabase("FileSystem");
          window.location.reload();
      } else {
        setShowReset(false);
      }
  };

  return (
    <div className="flex text-text-base w-full h-full">
      {/* Sidebar */}
      <div className={`flex flex-col h-full w-1/4 min-w-16 gap-2 p-2 bg-primary-light text-white rounded-t-md transition-all duration-500 ease-in-out overflow-y-auto overflow-x-hidden ${sidebarOpen ? '' : 'w-16'}`}>
        {sidebarOpen && <h2 className="text-4xl font-bold mb-4">Settings</h2>}
        {/* Back Button */}
        <button
          disabled={!selectedApp}
          className={`button-main ${selectedApp === null && '!bg-secondary'}`}
          onClick={() => handleSetting(null)}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
          Back
        </button>
        {/* Settings Options */}
        <button className={`button-main ${selectedApp === "System" && "!bg-secondary"}`} onClick={() => handleSetting('System')}>
          {sidebarOpen ? <h3>System</h3> : <FontAwesomeIcon icon={faGear} className="w-full h-full" />}
        </button>
        <button className={`button-main ${selectedApp === "Themes" && "!bg-secondary"}`} onClick={() => handleSetting('Themes')}>
          {sidebarOpen ? <h3>Theme</h3> : <FontAwesomeIcon icon={faPalette} className="w-full h-full" />}
        </button>
        <button className={`button-main ${selectedApp === "Apps" && "!bg-secondary"}`} onClick={() => handleSetting('Apps')}>
          {sidebarOpen ? <h3>Apps</h3> : <FontAwesomeIcon icon={faAppStore} className="w-full h-full" />}
        </button>
        <button className={`button-main ${selectedApp === "User" && "!bg-secondary"}`} onClick={() => handleSetting('User')}>
          {sidebarOpen ? <h3>User</h3> : <FontAwesomeIcon icon={faUser} className="w-full h-full" />}
        </button>
        {currentUser && currentUser.admin && (
          <button className={`button-main ${selectedApp === "Advanced" && "!bg-secondary"}`} onClick={() => handleSetting('Advanced')}>
            {sidebarOpen ? <h3>Advanced</h3> : <FontAwesomeIcon icon={faGears} className="w-full h-full" />}
          </button>
        )}
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
      {/* Content */}
      <div className="flex-grow w-3/4 p-4 bg-primary-light overflow-y-auto overflow-x-hidden">
        {selectedApp ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">{selectedApp}</h2>
            {selectedApp === 'System' && (
              <div className="flex flex-col gap-5">
                <div className="relative flex flex-row justify-center items-center">
                      <select 
                        className="select-main"
                        style={{ color: "black" }}
                        onChange={(e) => handleTaskbarPosition(e.target.value)}
                      >
                        <option value="north" className="option-main">Top</option>
                        <option value="south" className="option-main">Bottom</option>
                        <option value="east" className="option-main">Right</option>
                        <option value="west" className="option-main">left</option>
                      </select>
                      <label
                        style={{ color: "black" }}
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        Taskbar Position
                      </label>
                </div>
                <p>Modify the current position of the taskbar, whether it be the top or bottom of the page.</p>
                <div className="flex flex-row justify-between">
                  <h3 className="font-bold text-lg">Brightness</h3>
                  {displayBrightness}%
                </div>
                <input onChange={handleBrightnessChange} type="range" id="brightness"  className="w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none
                  [&::-webkit-slider-thumb]:w-2.5
                  [&::-webkit-slider-thumb]:h-2.5
                  [&::-webkit-slider-thumb]:-mt-0.5
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)]
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:duration-150
                  [&::-webkit-slider-thumb]:ease-in-out

                  [&::-moz-range-thumb]:w-2.5
                  [&::-moz-range-thumb]:h-2.5
                  [&::-moz-range-thumb]:appearance-none
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-4
                  [&::-moz-range-thumb]:border-blue-600
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:transition-all
                  [&::-moz-range-thumb]:duration-150
                  [&::-moz-range-thumb]:ease-in-out

                  [&::-webkit-slider-runnable-track]:w-full
                  [&::-webkit-slider-runnable-track]:h-2
                  [&::-webkit-slider-runnable-track]:bg-gray-100
                  [&::-webkit-slider-runnable-track]:rounded-full

                  [&::-moz-range-track]:w-full
                  [&::-moz-range-track]:h-2
                  [&::-moz-range-track]:bg-gray-100
                  [&::-moz-range-track]:rounded-full" min="0" max="1.5" step="0.1" />
                <p>Change the current brightness of the page.</p>
                <div className="flex flex-row justify-between">
                  <h3 className="font-bold text-lg">Sound</h3>
                  {displaySound}%
                </div>
                <input onChange={handleSoundChange} type="range"  className="w-full bg-transparent cursor-pointer appearance-none disabled:opacity-50 disabled:pointer-events-none focus:outline-none
                  [&::-webkit-slider-thumb]:w-2.5
                  [&::-webkit-slider-thumb]:h-2.5
                  [&::-webkit-slider-thumb]:-mt-0.5
                  [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:bg-white
                  [&::-webkit-slider-thumb]:shadow-[0_0_0_4px_rgba(37,99,235,1)]
                  [&::-webkit-slider-thumb]:rounded-full
                  [&::-webkit-slider-thumb]:transition-all
                  [&::-webkit-slider-thumb]:duration-150
                  [&::-webkit-slider-thumb]:ease-in-out

                  [&::-moz-range-thumb]:w-2.5
                  [&::-moz-range-thumb]:h-2.5
                  [&::-moz-range-thumb]:appearance-none
                  [&::-moz-range-thumb]:bg-white
                  [&::-moz-range-thumb]:border-4
                  [&::-moz-range-thumb]:border-blue-600
                  [&::-moz-range-thumb]:rounded-full
                  [&::-moz-range-thumb]:transition-all
                  [&::-moz-range-thumb]:duration-150
                  [&::-moz-range-thumb]:ease-in-out

                  [&::-webkit-slider-runnable-track]:w-full
                  [&::-webkit-slider-runnable-track]:h-2
                  [&::-webkit-slider-runnable-track]:bg-gray-100
                  [&::-webkit-slider-runnable-track]:rounded-full

                  [&::-moz-range-track]:w-full
                  [&::-moz-range-track]:h-2
                  [&::-moz-range-track]:bg-gray-100
                  [&::-moz-range-track]:rounded-full" min="0" max="100" step="1" />    
                <p>Change the amount of sound being played on the page.</p>
                {/*<input
                  className="mr-2 mt-[0.3rem] h-3.5 w-8 appearance-none rounded-[0.4375rem] bg-secondary before:pointer-events-none before:absolute before:h-3.5 before:w-3.5 before:rounded-full before:bg-transparent before:content-[''] after:absolute after:z-[2] after:-mt-[0.1875rem] after:h-5 after:w-5 after:rounded-full after:border-none after:bg-neutral-100 after:shadow-[0_0px_3px_0_rgb(0_0_0_/_7%),_0_2px_2px_0_rgb(0_0_0_/_4%)] after:transition-[background-color_0.2s,transform_0.2s] after:content-[''] checked:bg-primary checked:after:absolute checked:after:z-[2] checked:after:-mt-[3px] checked:after:ml-[1.0625rem] checked:after:h-5 checked:after:w-5 checked:after:rounded-full checked:after:border-none checked:after:bg-primary checked:after:shadow-[0_3px_1px_-2px_rgba(0,0,0,0.2),_0_2px_2px_0_rgba(0,0,0,0.14),_0_1px_5px_0_rgba(0,0,0,0.12)] checked:after:transition-[background-color_0.2s,transform_0.2s] checked:after:content-[''] hover:cursor-pointer focus:outline-none focus:ring-0 focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[3px_-1px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-5 focus:after:w-5 focus:after:rounded-full focus:after:content-[''] checked:focus:border-primary checked:focus:bg-primary checked:focus:before:ml-[1.0625rem] checked:focus:before:scale-100 checked:focus:before:shadow-[3px_-1px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] "
                  type="checkbox"
                  role="switch"
                  id="quickLoadSwitch"
                  checked={enableQuickLoad}
                  onChange={handleQuickLoad}
                />
                <label
                  className="inline-block pl-[0.15rem] hover:cursor-pointer"
                  htmlFor="quickLoadSwitch"
                >
                  {!enableQuickLoad ? <>Enable</> : <>Disable</>} Quick Startup
                </label>*/}
                <div className="flex flex-row gap-2 items-center border p-2">
                    <label className="font-bold">Reset { version.name }</label>
                    <Button onClick={() => setShowReset(true)}>Reset</Button>
                    {showReset && 
                    <Prompt setShown={setShowReset}>
                      <div className="flex flex-col bg-primary p-2 rounded">
                        <h2 className="text-2xl font-bold">Reset { version.name }?</h2>
                        <p>This will wipe all stored data, images, and settings.</p>
                        <div className="flex flex-row p-2">
                          <Button onClick={() => setShowReset(false)}>Cancel</Button>
                          <Button onClick={verifyReset}>Confirm</Button>
                        </div>
                      </div>
                    </Prompt>}
                </div>
              </div>
            )}
            {selectedApp === 'Apps' && (
              <div className="flex flex-col gap-2 ml-4">
                <h3 className="font-bold">Installed Apps</h3>
                {appData ? appData.map((app) => (
                  <Button
                  key={app.name}
                  className={`block w-full text-left cursor-pointer ${
                    selectedApp === app.name ? 'text-primary' : 'text-white'
                  } mb-2`}
                  onClick={() => {
                    handleSetting(app.name);
                    setIsApp(true);
                  }}
                >
                  {app.name}
                </Button>
                )) : (
                  <h3 onClick={() => {}} className="font-bold">Install Apps in the appstore.</h3>
                )}

              </div>
            )}
            {selectedApp === 'Themes' && (
              <Themes />
            )}
            {selectedApp === 'User' && (
              <div className="flex flex-col">
                {currentUser && currentUser.name}
                
                <div className="flex flex-row justify-center items-center gap-2">
                  <input type="file" accept=".json" onChange={handleJSONFileChange} />
                  <button className="button-main" onClick={handleImport}>Import Settings</button>
                  <button className="button-main" onClick={handleExport}>Export Settings</button>
                </div>
              </div>
            )}
            {selectedApp === 'Advanced' && currentUser.admin && (
              <Advanced bootScreen={bootScreen} />
            )}
            {isApp && (
              <div className="flex flex-col gap-2">
                <div className="flex flex-row justify-between items-center">
                  <Button onClick={() => {
                    setIsApp(false);
                    handleSetting("Apps")
                  }}>
                    Back
                  </Button>
                  <Button
                    className={`${apps.find(app => app.name === appData.find((app) => app.name === selectedApp)?.name) && "pointer-events-none !bg-secondary absolute w-full h-32"}`}
                    onClick={() => deleteApp(selectedApp)}
                  >
                    Delete App
                  </Button>
                </div>
                {appData.find((app) => app.name === selectedApp)?.description}
                <Button
                  onClick={() =>
                    updatePinnedStatus(
                      selectedApp,
                      !appData.find((app) => app.name === selectedApp)?.pinned
                    )
                  }
                >
                  {appData.find((app) => app.name === selectedApp)?.pinned ? 'Unpin' : 'Pin'}
                </Button>
                <Button
                  onClick={() =>
                    updateShortcutStatus(
                      selectedApp,
                      !appData.find((app) => app.name === selectedApp)?.shortcut
                    )
                  }
                >
                  {appData.find((app) => app.name === selectedApp)?.shortcut ? 'Remove Shortcut' : 'Shortcut'}
                </Button>
              </div>

            )}
          </div>
        ) : (
          <div className="flex flex-col justify-center items-center">
            <img className="w-10 h-10" src={`${version && version.image}`} alt="logo" />
            <h3 className="font-bold text-2xl">{version && version.name}</h3>
            <p className="">A product of the Luminesence Project</p>
            <p className="flex-grow">Version: {version && version.version}</p>

            <p>Security Status: {version && version.secure ? 'Secure' : 'Not Secure'}</p>

            {!version.secure && (
              <div className="border p-2">
                <h3 className="font-bold text-2xl">Critical Update Needed!</h3>
                <p className="font-sm">
                  Click this <a href="https://github.com/LuminesenceProject/LumiOS">link</a> in order to update.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;