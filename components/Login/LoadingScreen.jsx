import React, { useState, useEffect } from "react";
import image1 from "../../Images/image1.jpeg";
import version from "../../util/util";
import logo from "../../Images/logo.jpeg";

const LoadingScreen = ({ onLoadingComplete }) => {
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(0);

  useEffect(() => {
    const crntusr = JSON.parse(localStorage.getItem("currentUser"));

    const quickLoad = localStorage.getItem(crntusr && crntusr.name + "quickLoad") === "true";

    const bgImage = getComputedStyle(document.documentElement).getPropertyValue('--background');
    if (typeof bgImage !== 'undefined') {
      document.documentElement.style.setProperty("--background-image", image1);
      setImage(image1);
    } else {
      setImage(getComputedStyle(document.documentElement).getPropertyValue('--background-image'));
    }

    const timer = setInterval(() => {
      setLoading((prevLoading) => {
        const newLoading = prevLoading + (quickLoad ? 10 : !version.secure ? 1 : 5);
        return newLoading >= 100 ? 100 : newLoading;
      });
    }, 100);

    return () => clearInterval(timer);
  }, []);  

  useEffect(() => {
    // Notify the parent component when loading is complete
    if (loading === 100) {
      setTimeout(() => {
        onLoadingComplete();
      }, 500); // Adjust the duration as needed
    }
  }, [loading, onLoadingComplete]);

  return (
    <div
      className={`flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0`}
      style={{
        color: "white",
        backgroundColor: loading < 100 ? "black" : "",
        backgroundSize: "cover",
        backgroundImage: loading > 99 ? "var(--background-image, none)" : ""
      }}
    >
      <div className={`transition-opacity ${loading === 100 ? 'opacity-0' : 'opacity-100'}`}>
        <img className="w-24 h-24" src={logo} alt="logo" />
        <div
          className="flex w-full h-5 overflow-hidden my-2 border p-1"
          role="progressbar"
          aria-valuenow={loading}
          aria-valuemin="0"
          aria-valuemax="100"
        >
          <div
            className="flex flex-col justify-center overflow-hidden text-xs text-white text-center whitespace-nowrap transition-all ease-linear duration-500"
            style={{ width: `${loading}%`, backgroundColor: "white" }}
          ></div>
        </div>
        {/* Put appearing/loading text here */}
      </div>
      {!version.secure && (
        <div className="border p-2">
          <h3 className="font-bold text-2xl">Critical Update Needed!</h3>
          <p className="font-sm">
            Click this <a href="https://github.com/LuminesenceProject/LumiOS">link</a> in order to update.
          </p>
        </div>
      )}
    </div>
  );
};

export default LoadingScreen;