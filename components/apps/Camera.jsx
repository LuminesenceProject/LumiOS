import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";

const Camera = () => {
  const [stream, setStream] = useState(null);

  const capture = () => {
    var video = document.querySelector("video");
    var canvas = document.querySelector("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    var df = video.videoWidth - video.videoHeight;

    canvas
      .getContext("2d")
      .drawImage(video, -df / 2, 0, video.videoWidth + df, video.videoHeight);
  };

  useEffect(() => {
      var video = document.getElementById("camvideo");

      video.setAttribute("playsinline", "");
      video.setAttribute("autoplay", "");
      video.setAttribute("muted", "");

      var constraints = {
        audio: false,
        video: true,
      };

      navigator.mediaDevices.getUserMedia(constraints).then((dstream) => {
        setStream(dstream);
        console.log(dstream);
        video.srcObject = dstream;
      });
  }, []);

  return (
    <div className="windowScreen flex flex-col" data-dock="true">
        <div className="restWindow flex-grow flex flex-col">
            <div className="camcont">
            <div className="camctrl">
                <div
                className="cmicon"
                onClick={capture}
                >
                <FontAwesomeIcon icon={faCamera} />
                </div>
                <canvas id="camcanvas"></canvas>
            </div>
            <div className="vidcont">
                <div className="vidwrap">
                <video id="camvideo"></video>
                </div>
            </div>
            </div>
        </div>
    </div>
  );
};

export default Camera;