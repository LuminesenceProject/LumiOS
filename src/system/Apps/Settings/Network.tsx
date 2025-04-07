import { useState } from "react";
import Button from "../../../structures/Button";

const Network = () => {
    const [responseTime, setResponseTime] = useState<number>(null);

    const fetchResponseTime = async () => {
      const startTime = performance.now(); // Record start time
      try {
          const response = await fetch('https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Info.json');
          if (response.ok) {
              const endTime = performance.now(); // Record end time
              const timeDiff = endTime - startTime; // Calculate time difference
              setResponseTime(Math.round(timeDiff)); // Update state with response time
          } else {
              throw new Error('Network response was not ok.');
          }
      } catch (error) {
          console.error('Error fetching:', error);
      }
    };  

    const getStat = () => {
        setTimeout(() => {}, 200);

        if (responseTime < 100) {
            return "Fast"
          } else if (responseTime > 100) {
            return "Good"
          } else if (responseTime > 150) {
            return "Ok"
          } else if (responseTime > 200) {
            return "Slow"
          } else {
            return "Toilet"
          }
    }

    return (
        <div>
            <h3 className="font-bold text-2xl">Network</h3>
            {responseTime && <h4 className="text-xl font-semibold">Your internet is: {getStat()}</h4>}
            {responseTime && <p className="text-sm" style={{ color: "gray" }}>Response Time: {responseTime}ms</p>}
            <Button className="!bg-secondary-light" onClick={fetchResponseTime}>Test Network</Button>
        </div>
    );
};

export default Network;