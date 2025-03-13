import React, { useState, useEffect } from "react";
import { pushNotification } from "../Notifications/Notifications";
import version from "../../util/util";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

const AppStore = ({ app }) => {
  const [games, setGames] = useState([]);
  const [currentUser, setCurrentUser] = useState({});
  const [customLink, setCustomLink] = useState("");
  const [input, setInput] = useState("");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedGame, setSelectedGame] = useState(app || null);

  const fetchData = async () => {
    try {
      // Use the custom link if provided, otherwise use the default link
      const link = customLink || "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Data.json";
      const response = await fetch(link);
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    // Get current user
    const crntusr = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(crntusr);
  }, []);

  useEffect(() => {
    fetchData();
  }, [customLink]);

  const handleDownload = (game) => {
    setSelectedGame(game);
    setIsModalVisible(true);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedGame(null);
  };

  const installGame = () => {
    closeModal();

    // Check if the app is already installed
    const installedApps = JSON.parse(localStorage.getItem(currentUser.name + "installedApps")) || [];
    const isAppInstalled = installedApps.some((app) => app.name === selectedGame.name);

    const template = {
      name: selectedGame.name,
      pinned: true,
      shortcut: false,
      open: false,
      link: selectedGame.path,
      svg: selectedGame.image,
      "user-installed": true,
      isUserHtml: false,
    }
    if (!isAppInstalled) {
      // If not installed, add it to the installedApps array
      installedApps.push(template);

      localStorage.setItem(currentUser.name + "installedApps", JSON.stringify(installedApps));

      const pinnedApps = JSON.parse(localStorage.getItem(currentUser.name + "-pinned-apps")) || [];
      pinnedApps.push(template);
      localStorage.setItem(currentUser.name + "-pinned-apps", JSON.stringify(pinnedApps));

      pushNotification(selectedGame.name + " has been installed!", "Please restart " + version.name + " to update and finalize the download.", () => {
        window.location.reload();
      });
    }
  }

  return (
    <div className="bg-primary-light text-text-base h-full" style={{ overflow: "overlay" }}>
      {/* Input for custom link and button to fetch data */}
      <div className="flex flex-row gap-2 items-center justify-between py-2 my-2 px-2">
        <div className="flex">
          <div className="relative"> 
            <input
            style={{ color: "black" }}
            className="peer bg-primary w-full h-full font-sans font-normal outline outline-0 focus:outline-0 disabled:border-0 transition-all placeholder-shown:border border focus:border-2 border-t-0 focus:border-t-0 text-sm px-3 py-2.5 rounded-[7px]"
            value={customLink}
            onChange={(e) => setCustomLink(e.target.value)}
            placeholder="" />
            <label
            style={{ color: "black" }}
            className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate leading-tight peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-0 before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-0 after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-0 after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-0 peer-placeholder-shown:leading-[3.75]"><span className={`text-text-base`}>Game Link</span>
            </label>
          </div>  
          <button className="bg-secondary hover:bg-secondary-light transition-colors duration-200 px-4 py-2 rounded ml-2" onClick={fetchData}>
            Fetch Data
          </button>
        </div>
        <label className="relative">
          <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute top-3 left-2" style={{ color: "black" }} />
          <div className="relative"> 
            <input
            style={{ borderColor: "black" }}
            className="peer bg-primary w-full h-full font-sans font-normal outline outline-0 focus:outline-0 disabled:border-0 transition-all placeholder-shown:border border focus:border-2 border-t-0 focus:border-t-0 text-sm px-3 py-2.5 rounded-[7px]"
            onChange={(e) => setInput(e.target.value)}
            placeholder="" />
            <label
            style={{ borderColor: "black" }}
            className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate leading-tight peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-0 before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-0 after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-0 after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-0 peer-placeholder-shown:leading-[3.75] !text-white"><span className={` text-text-base`}>Search Apps</span>
            </label>
          </div>        
      </label>
      </div>

      <div className="grid gap-5 p-4" style={{gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))"}}>
        {games && games.filter(game => game.name.toLowerCase().includes(input.toLowerCase())).map((game, index) => (
          <div key={index} className="card" onClick={() => handleDownload(game)}>
            <img src={game.image} alt={game.name} style={{ filter: game.type === "swf" ? "brightness(50%)" : null }} />
            <div className="content" style={{ opacity: game.type === "swf" ? 1 : null}}>
              <h3 className="text-xl font-semibold">{game.name}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      {isModalVisible && selectedGame && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-opacity-50 blur absolute inset-0 text-text-base" onClick={closeModal}></div>
          <div className="bg-secondary p-8 rounded shadow-lg z-10">
            <h2 className="text-2xl font-semibold mb-4">{selectedGame.name}</h2>
            <p>Do you want to download {selectedGame.name}?</p>
            <div className="mt-4 flex justify-end">
              <button
                className="bg-primary hover:bg-primary-light transition-colors duration-200 px-4 py-2 rounded mr-2"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="bg-primary hover:bg-primary-light transition-colors duration-200 px-4 py-2 rounded"
                onClick={installGame}
              >
                Download
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppStore;