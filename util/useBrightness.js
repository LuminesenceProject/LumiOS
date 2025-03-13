import { useState } from "react";

const useBrightness = () => {
  const [brightness, setBrightness] = useState(1);

  const changeBrightness = (newBrightness) => {
    const clampedBrightness = Math.max(0, Math.min(1.5, newBrightness));
    setBrightness(clampedBrightness);
  };

  return { currentBrightness: brightness, changeBrightness };
};

export default useBrightness;