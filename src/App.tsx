import { useEffect, useState } from "react";
import ErrorBoundary from "./ErrorBoundary";
import Desktop from "./system/Desktop";
import Login from "./structures/Login/Login";
import LoadingScreen from "./structures/Login/LoadingScreen";
import virtualFS from "./utils/VirtualFS";
import BootScreen from "./structures/Bootscreen/BootScreen";
import { changeSecure } from "./utils/process";
import Startup from "./structures/FirstStart/Startup";
import { Panic } from "./utils/types";

const App = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [signedIn, setSignedIn] = useState<boolean>(true);
  const [bootscreen, setShowBootScreen] = useState<boolean>(false);
  const [fetched, setFetched] = useState<boolean>(false);
  const [firstFetched, setFirstFetched] = useState<boolean>(false);
  const [firstLogin, setFirstLogin] = useState<boolean>(false);
  const [panicKey, setPanicKey] = useState<string>("\\");
  const [panicSite, setPanicSite] = useState<string>("https://google.com");

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === panicKey) {
        window.location.href = panicSite;
      }
    };

    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [panicKey, panicSite]);

  const fetchData = async () => {
    if (fetched) return;
    try {
      await virtualFS.initialize();
      const systemFiles = await virtualFS.readdir("System");
      const autologin = systemFiles["Autologin"];

      const panic = await virtualFS.readfile("System/", "Panic");
      const panicContent: Panic = JSON.parse(panic.content);
      setPanicKey(panicContent.key);
      setPanicSite(panicContent.website);

      window.document.title = panicContent.title;
      var link = document.querySelector("link[rel~='icon']");
      if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
      }
      link.href = panicContent.favicon;

      setSignedIn(JSON.parse(await autologin.content));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
    
    checkVersion();
  };

  const checkVersion = async () => {
    try {
      const version = await virtualFS.readfile("System/", "Version");

      const onlineVersion = await fetch("https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Info.json");
      const content = await onlineVersion.json();

      if (!version || content[0].version < JSON.parse(version.content).version) {
        changeSecure(false);

        if (window.confirm("Lumi OS is out of date. Reset to fix bugs?")) {
          indexedDB.deleteDatabase("VirtualFileSystemDB");
          setTimeout(() => {
            window.location.reload();
          }, 200);
        }
      }
    } catch (error) {
      console.error("Error checking version:", error);
    }

    setFetched(true);
  };

  const fetchFirstLoad = async () => {
    if (firstFetched) return;

    await virtualFS.initialize();

    const firstStart = await virtualFS.readfile("System/", "FirstStart");
    const localValue = JSON.parse(localStorage.getItem("firstlogin")) === "false";    
    
    if (localValue) return;

    let isFirstStart;

    try {
      isFirstStart = JSON.parse(firstStart.content);
    } catch (error) {
      console.error("Error parsing JSON:", error);
      return;
    }

    // Check if isFirstStart is a boolean
    if (typeof isFirstStart === 'boolean') {
      if (!isFirstStart) {
        return;
      }
    } else if (typeof isFirstStart === 'string') {
      if (isFirstStart.toLowerCase() === "false") {
        return;
      }
    } else {
      console.error("Unexpected value type:", typeof isFirstStart);
      return;
    }

    fetchData();
    setFirstLogin(true);
    setFirstFetched(true);
  }
  

  return (
    <div onLoad={fetchFirstLoad}>
    {bootscreen ? <BootScreen setShowBootScreen={setShowBootScreen} /> :
    <ErrorBoundary showBootScreen={setShowBootScreen}>
      {firstLogin ? <Startup setFirstLogin={setFirstLogin} setSignedIn={setSignedIn} setShowBootScreen={setShowBootScreen} /> : loading ? <LoadingScreen setLoading={setLoading} /> :       
        <div style={{ background: "var(--background-image), none", backgroundRepeat: 'no-repeat', backgroundSize: "cover" }} onLoad={fetchData}>
          {signedIn ? <Desktop setSignedIn={setSignedIn} setShowBootScreen={setShowBootScreen} /> : <Login setIsLoggedIn={setSignedIn} openBootScreen={setShowBootScreen} />}
        </div>
      }
    </ErrorBoundary>
    }
  </div>
  );
};

export default App;