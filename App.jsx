import React, { useEffect, useState } from "react";
import { applyBackground, applyTheme } from "./util/themes/themeUtil";
import { Users } from "./components/Login/Users";
import ErrorBoundary from "./ErrorBoundary";
import baseTheme from "./util/themes/baseTheme";
import AppManager from "./util/AppManager";
import Login from "./components/Login/Login";
import LoadingScreen from "./components/Login/LoadingScreen";
import image1 from "./Images/image1.jpeg";
import Boot from "./components/BootScreen/Boot";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loadingComplete, setLoadingComplete] = useState(false);
  const [bootScreen, showBootScreen] = useState(false);

  useEffect(() => {
    const autoLoginUser = Users.find((user) => user.autoLogin);

    if (autoLoginUser) {
      localStorage.setItem("currentUser", Users.find((user) => user.autoLogin));
      setIsLoggedIn(true);
    }

    if (sessionStorage.getItem("loggedIn")) {
      const sessionUser = sessionStorage.getItem("loggedIn");

      localStorage.setItem("currentUser", sessionUser);
      if (localStorage.getItem(sessionUser.name + "-onload-script")) {
        try {
          eval(localStorage.getItem(sessionUser.name + "-onload-script"))
        } catch (error) {
          window.alert(`Could not eval user script! Following error occured: ${error.message}`);
        }
      }

      setIsLoggedIn(true);
    }
    
    const crntusr = JSON.parse(localStorage.getItem("currentUser"));
    const currentTheme = JSON.parse(localStorage.getItem(crntusr?.name + "theme"));
    const currentBackground = JSON.parse(localStorage.getItem("background")) || image1;

    applyTheme(currentTheme || baseTheme);
    applyBackground(currentBackground);

    const cloak = JSON.parse(localStorage.getItem("cloak"));

    if (cloak) {
      document.title = cloak.name;

      // Remove existing favicon
      const existingFavicon = document.querySelector(`link[rel='icon']`);
      if (existingFavicon) {
          existingFavicon.remove();
      }

      // Create a new link element for the favicon
      const newFavicon = document.createElement('link');
      newFavicon.rel = 'icon';
      newFavicon.type = 'image/x-icon';
      newFavicon.href = cloak.link;

      // Append the new link element to the head of the document
      document.head.appendChild(newFavicon);
    }
  }, []);

  const handleLoadingComplete = () => {
    setLoadingComplete(true);
  };

  return (
    <>
      {bootScreen && <Boot setBootScreen={showBootScreen} />}
      <ErrorBoundary showBootScreen={showBootScreen}>
        <div className="h-screen overflow-x-hidden overflow-y-hidden">
          {!loadingComplete ? (
            <LoadingScreen onLoadingComplete={handleLoadingComplete} />
          ) : isLoggedIn ? (
            <AppManager setIsLoggedIn={setIsLoggedIn} bootScreen={showBootScreen} />
          ) : (
            <Login openBootScreen={() => showBootScreen(true)} setIsLoggedIn={setIsLoggedIn} />
          )}
        </div>
      </ErrorBoundary>
    </>

  );
}

export default App;