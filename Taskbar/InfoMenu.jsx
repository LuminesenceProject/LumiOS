import { useEffect, useRef, useState } from "react";
import useBrightness from "../../util/useBrightness";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlane, faWifi } from "@fortawesome/free-solid-svg-icons";

const InfoMenu = ({ shown, setShown, batteryLevel }) => {
  const [wifi, setWifi] = useState(true);
  const [airplane, setAirplane] = useState(false);
  
  const { currentBrightness, changeBrightness } = useBrightness();
  const infoRef = useRef(null);
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const position = localStorage.getItem(currentUser.name + "position") || "south";
  
  useEffect(() => {
    document.body.style.filter = `brightness(${currentBrightness})`;
  }, [currentBrightness]);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (infoRef.current && !infoRef.current.contains(e.target)) {
        setShown(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleWifi = () => {
    setWifi(!wifi);
  }

  const handleAirplane = () => {
    setAirplane(!airplane);
  }

  return ( 
    <div ref={infoRef} className={`absolute text-white transform transition-transform duration-200 p-4 w-1/5 rounded-t shadow-lg backdrop-blur-lg backdrop-brightness-90 z-20
      ${position === "north" ? "right-0 top-16 origin-top" : position === "south" ? "right-0 bottom-16 origin-bottom" : position === "west" ? "left-32 bottom-16 origin-bottom-left" : "right-32 bottom-16 origin-bottom-right"} 
      ${shown ? "scale-100" : "scale-0 pointer-events-none"}`}
      style={{ 
        color: "white",       
        backdropFilter: "blur(20px)",
    }}>
      <div className="grid grid-cols-2 gap-4">
        <div className={`w-full h-16 flex flex-col justify-center items-center bg-primary rounded text-text-base transition-all duration-200 hover:shadow cursor-pointer ${wifi && "!bg-secondary"}`} onClick={handleWifi}>
          <FontAwesomeIcon icon={faWifi} />
          <h3 className="text-sm font-semibold">Wifi</h3>
        </div>
        <div className={`w-full h-16 flex flex-col justify-center items-center bg-primary rounded text-text-base transition-all duration-200 hover:shadow cursor-pointer ${airplane && "!bg-secondary"}`} onClick={handleAirplane}>
          <FontAwesomeIcon icon={faPlane} />
          <h3 className="text-sm font-semibold">Airplane</h3>
        </div>
        <div className="flex flex-col items-center relative group col-span-2 group">
          <h3 className="font-bold mb-2">Brightness</h3>
          <input
            type="range"
            defaultValue={currentBrightness}
            min={0.2}
            max={2}
            step={0.1}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
            onChange={(event) => changeBrightness(event.target.value)}
          />
          <div className="absolute flex justify-center items-center left-1/2 transform -translate-x-1/2 w-10 h-10 bg-secondary px-2 py-1 rounded text-xs -mt-4 transition-transform duration-200 scale-0 group-hover:scale-100">
            {currentBrightness}
          </div>
        </div>
        <div className="flex flex-col items-center col-span-2">
          <h3 className="font-bold mb-2">Sound</h3>
          <input
            type="range"
            defaultValue={currentBrightness}
            min={0.2}
            max={2}
            step={0.1}
            className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        <div className="mb-2 font-bold col-span-2 text-right">Battery {batteryLevel}%</div>
      </div>
    </div>
  );
}
 
export default InfoMenu;