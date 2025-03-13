import React, { useEffect, useState } from "react";
import { Users } from "../Login/Users";
import version from "../../util/util";

const Startup = ({ openApp }) => {
  const [currentPanel, setCurrentPanel] = useState(0);
  const [games, setGames] = useState([]);
  const user = localStorage.getItem("currentUser");

  useEffect(() => {
    if (user && user.firstLogin) {
      user.firstLogin = false;

      const index = Users.findIndex((u) => u.name === user.name);
      if (index !== -1) {
        Users[index] = user;
        localStorage.setItem("currentUser", JSON.stringify(user));
        saveUsersToLocalStorage();
      }
    }
  }, [user]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const link = "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Data.json";
      const response = await fetch(link);
      const data = await response.json();
  
      const firstThreeGames = data.slice(0, 3);
  
      setGames(firstThreeGames);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };  

  const saveUsersToLocalStorage = () => {
    localStorage.setItem("users", JSON.stringify(Users));
  };

  const handleForward = () => {
    setCurrentPanel((prevPanel) => Math.min(prevPanel + 1, 2));
  };

  const handleBack = () => {
    setCurrentPanel((prevPanel) => Math.max(prevPanel - 1, 0));
  };

  const renderPanelContent = () => {
    switch (currentPanel) {
      case 0:
        return (
          <div className="flex flex-col justify-between h-full">
            <div>
                <h3 className="font-bold text-2xl">Welcome!</h3>
                <p className="text-sm">Welcome to {version?.name}, a web-based OS, with many different features, including games, the internet, and more!</p>
            </div>
            <div>
                <p className="text-sm">You are currently running V{version?.version} of {version?.name}.</p>
                <p>Security Status: {version.secure ? 'Secure' : 'Not Secure'}</p>
                {!version.secure && (
                <div className="border p-2">
                    <h3 className="font-bold text-2xl">Critical Update Needed!</h3>
                    <p className="">Click this <a href="font-bold">link</a> in order to update.</p>
                </div>
                )}
            </div>
          </div>
        );
      case 1:
        return (
          <div>
            <h3 className="font-bold text-2xl flex-grow">Get Started by Installing Apps</h3>
            <div className="flex flex-row">
                {games.map((game, index) => (
                    <div key={index} className="card" onClick={() => openApp("AppStore")}>
                        <img src={game.image} alt={game.name} />
                        <div className="content">
                        <h3 className="text-xl font-semibold">{game.name}</h3>
                        </div>
                    </div>
                ))}
            </div>
          </div>
        );
      case 2:
        return (
            <div>
                <h3 className="text-bold text-2xl">Thank You for Using {version?.name}</h3>
            </div>
        );
    }
  };

  return (
    <div className="bg-primary w-full h-full flex flex-col justify-between items-center text-center p-2 text-text-base">
      {renderPanelContent()}
      <div className="flex gap-2">
        <button className="bg-secondary hover:bg-secondary-light transition-colors duration-200 px-4 py-2 rounded" onClick={handleBack} disabled={currentPanel === 0}>Back</button>
        <button className="bg-secondary hover:bg-secondary-light transition-colors duration-200 px-4 py-2 rounded" onClick={handleForward} disabled={currentPanel === 2}>Forward</button>
      </div>
    </div>
  );
};

export default Startup;