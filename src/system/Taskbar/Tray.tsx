import { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faWifi } from "@fortawesome/free-solid-svg-icons";

interface TrayProps {
    shown: boolean;
    openedApps: string[];
    taskbar: string;
    setShown: (prev: boolean) => void;
}

const Tray: React.FC<TrayProps> = ({ shown, openedApps, setShown, taskbar }) => {
    const [wifi, setWifi] = useState<boolean>(true);
    const [airplane, setAirplane] = useState<boolean>(false);
    const [batteryLevel, setBatteryLevel] = useState(0);

    useEffect(() => {
      const updateBatteryLevel = async () => {
        try {
          const battery = await navigator.getBattery();
          setBatteryLevel(Math.round(battery.level * 100));
        } catch (error) {
          // navigator.getBattery() is not supported
          console.error("Battery API not supported:", error);
          // Set battery level to 50% when not supported
          setBatteryLevel(50);
        }
      };
  
      // Initial update
      updateBatteryLevel();
  
      // Add an event listener for future updates
      if (navigator.getBattery) {
        navigator.getBattery().then((battery) => {
          battery.addEventListener("levelchange", updateBatteryLevel);
        });
      }
  
      // Clean up the event listener on component unmount
      return () => {
        if (navigator.getBattery) {
          navigator.getBattery().then((battery) => {
            battery.removeEventListener("levelchange", updateBatteryLevel);
          });
        }
      };
    }, []);

    const trayRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (trayRef.current && !trayRef.current.contains(e.target as Node)) {
              setShown(false);
            }
        };
    
        document.addEventListener("mousedown", handleOutsideClick);
    
        return () => {
          document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleBrightnessChange = (level: number) => {
      if (wifi) {
        document.body.style.filter += `brightness(${level})`;
      } else {
        document.body.style.filter = `brightness(${level})`;

      }
    };

    const handleAirplaneMode = () => {
        setAirplane(!airplane);
        
    };

    const handleDarklight = () => {
      setWifi(!wifi);

      document.body.style.filter = `sepia(${wifi ? '40%' : '0%'})`;
    }

    return ( 
        <div
            ref={trayRef}
            className={`${
                shown ? "scale-100 pointer-events-auto z-50" : "scale-0 pointer-events-none"
            } transition-transform duration-200 absolute -translate-y-20 backdrop-blur-lg w-1/4 mx-20 ${taskbar === "full" ? "right-0" : "mx-auto"} origin-bottom p-2 rounded`}
            style={{ bottom: 0, backdropFilter: "blur(20px)", color: "white" }}
        >
            <div className="grid grid-cols-2 gap-4">
                <div className={`w-full h-16 flex flex-col justify-center items-center bg-primary rounded text-text-base transition-all duration-200 hover:shadow cursor-pointer ${wifi && "!bg-secondary"}`} onClick={handleDarklight}>
                <FontAwesomeIcon icon={faWifi} />
                <h3 className="text-sm font-semibold">Nightlight</h3>
                </div>
                <div className={`w-full h-16 flex flex-col justify-center items-center bg-primary rounded text-text-base transition-all duration-200 hover:shadow cursor-pointer ${airplane && "!bg-secondary"}`} onClick={handleAirplaneMode}>
                <FontAwesomeIcon icon={faPlane} />
                <h3 className="text-sm font-semibold">Airplane</h3>
                </div>
                <div className="flex flex-col items-center relative group col-span-2 group">
                <h3 className="font-bold mb-2">Brightness</h3>
                <input
                    type="range"
                    defaultValue={50}
                    min={0.2}
                    max={1.8}
                    step={0.02}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                    onChange={(e) => handleBrightnessChange(Number(e.target.value))}
                />
                </div>
                <div className="flex flex-col items-center col-span-2">
                <h3 className="font-bold mb-2">Sound</h3>
                <input
                    type="range"
                    defaultValue={50}
                    min={0.2}
                    max={2}
                    step={0.1}
                    className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                />
                </div>
                <div className="mb-2 font-bold col-span-2 text-right">Battery { batteryLevel }%</div>
            </div>
        </div>
    );
}
 
export default Tray;