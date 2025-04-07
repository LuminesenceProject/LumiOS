import { useState, useEffect } from "react";
import logo from "../../assets/logo.jpeg";
import { secure } from "../../utils/process";
import virtualFS from "../../utils/VirtualFS";
import { applyBackground, applyTheme } from "../../utils/Theme";

interface LoadingFunction {
  func: () => Promise<boolean>;
  successMessage: string;
  failureMessage: string;
}

const functions: LoadingFunction[] = [
  {
    func: async () => {
      try {
        const onlineVersion = await fetch("https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Info.json");
        const version = await onlineVersion.json();
        const storedVersion = await virtualFS.readfile("System/", "Version");
        const content = JSON.parse(storedVersion.content);
        const onlineContent = version[0];
  
        if (content.version !== onlineContent.version) return false;
        
        return true;
      } catch (error) {
        return false;
      }

    },
    successMessage: "Official supported version of Lumi OS.",
    failureMessage: "Old version of Lumi OS. Upgrade needed.",
  },
  {
    func: async () => {
      try {
        await virtualFS.initialize();
        return true;
      } catch (error) {
        return false;
      }
    },
    successMessage: "Virtual FS initialized successfully!",
    failureMessage: "Failed to initialize Virtual FS.",
  },
  {
    func: async () => {
      try {
        const backgroundImage = await virtualFS.readfile("System/", "BackgroundImage");
        await applyBackground(await backgroundImage.content);
        return true;
      } catch (error) {
        return false;
      }
    },
    successMessage: "Background image applied.",
    failureMessage: "Background image not found... (404)",
  },
  {
    func: async () => {
      try {
        const theme = await virtualFS.readfile("System/", "Theme");
        await applyTheme(await JSON.parse(theme.content));
        return true;
      } catch (error) {
        return false;
      }
    },
    successMessage: "Found theme file. (202)",
    failureMessage: "Theme could not be located.",
  },
  {
    func: async () => {
      return window.navigator.onLine ? true : false;
    },
    successMessage: "Wifi is enabled.",
    failureMessage: "Enable wifi to access the appstore.",
  },
  // Add more functions as needed
];

// Utility function to introduce delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const LoadingScreen: React.FC<{ setLoading: Function }> = ({ setLoading }) => {
  const [loading, setLoadingState] = useState(0);
  const [messages, setMessages] = useState<string[]>([]); // To hold all messages

  useEffect(() => {
    const totalFunctions = functions.length;
    const progressPerFunction = 100 / totalFunctions;
    const delayTime = 500; // Delay time in milliseconds between functions
    const finalDelayTime = 2000; // Final delay time in milliseconds after last function

    const executeFunctions = async () => {
      for (const { func, successMessage, failureMessage } of functions) {
        try {
          await delay(delayTime); // Introduce delay before executing the function
          const result = await func();
          if (result) {
            setMessages((prevMessages) => [...prevMessages, successMessage]);
          } else {
            setMessages((prevMessages) => [...prevMessages, failureMessage]);
          }
          setLoadingState((prevLoading) => {
            const newLoading = prevLoading + progressPerFunction;
            return newLoading >= 100 ? 100 : newLoading;
          });
        } catch (error) {
          setMessages((prevMessages) => [...prevMessages, failureMessage]);
          // Continue with the next function
        }
      }

      // Add a final delay after the last function completes
      setMessages((prevMessages) => [...prevMessages, "Loading complete!"]);
      await delay(finalDelayTime);
      setLoading(false);
    };

    executeFunctions();
  }, []);

  return (
    <div
      className="relative flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
      style={{
        color: "white",
        backgroundColor: "black",
        backgroundSize: "cover",
        overflow: "hidden",
      }}
    >
      {/* Background Text */}
      <div
        className="absolute inset-0 flex flex-col items-start justify-start text-white text-2xl font-semibold p-5"
        style={{ opacity: 0.6 }}
      >
        {messages.map((message, index) => (
          <p key={index} style={{ color: "gray" }}>
            {message}
          </p>
        ))}
      </div>

      {/* Main Content */}
      <div className="flex flex-col items-center justify-center z-10">
        <img className="w-24 h-24 mb-4" src={logo} alt="logo" />
        <div
          className="flex w-full h-5 overflow-hidden my-2 border p-1"
          role="progressbar"
          aria-valuenow={loading}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="flex flex-col justify-center overflow-hidden text-xs text-white text-center whitespace-nowrap transition-all ease-linear duration-500"
            style={{ width: `${loading}%`, backgroundColor: "white" }}
          ></div>
        </div>
        {!secure && (
          <div className="border p-2 mb-4">
            <h3 className="font-bold text-2xl">Critical Update Needed!</h3>
            <p className="font-sm">
              Click this <a href="https://github.com/LuminesenceProject/LumiOS">link</a> in order to update.
            </p>
          </div>
        )}
        <div>
            <a href="https://discord.com/invite/TyacaNY3GK">Join the Discord!</a>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;