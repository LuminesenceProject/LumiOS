import { FpsView } from "react-fps";

const PerformanceManager = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full h-full px-2 py-4 text-text-base">
      <FpsView />
    </div>
  );
};

export default PerformanceManager;