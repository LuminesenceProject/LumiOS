import React, { useEffect, useState } from 'react';
import "@ruffle-rs/ruffle";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExpand, faMaximize, faVolumeHigh, faVolumeMute } from '@fortawesome/free-solid-svg-icons';

const UserComponent = ({ link }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [sound, setSound] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(link);
        const data = await response.text();
        setHtmlContent(data);
      } catch (error) {
        console.error("Error fetching content:", error);
      }
    };

    if (link.endsWith(".html")) {
      fetchData();
    } else if (link.endsWith(".swf")) {
      readyForLoad(link);
    }

  }, [link]);

  const grab = (url, type, success, fail) => {
    var req = new XMLHttpRequest();
    req.open("GET", url, true);
    req.overrideMimeType("text/plain; charset=x-user-defined");
    req.responseType = type;
    req.onload = function() {
      if (req.status >= "400") {
        fail(req.status);
      } else {
        success(this.response);
      }
    }
    req.send();
  }

  const startPlayer = (data) => {
      if (data) {
          console.log("Initializing with " + data.byteLength + " bytes of data");
          var flashObject = document.createElement("object");
          flashObject.classList.add("gembed");
          flashObject.type = "application/x-shockwave-flash";
          flashObject.data = URL.createObjectURL(new Blob([data]));
          var flashObjectWmode = document.createElement("param");
          flashObjectWmode.name = "wmode";
          flashObjectWmode.value = "direct";
          flashObject.appendChild(flashObjectWmode);
          flashObject.id = `player${link}`;
          document.getElementById("swfplayer" + link).append(flashObject);
          flashObject.style.width = "100%";
          flashObject.style.height = "100%";
      }
  }

  const readyForLoad = (swfPath) => {
    const player = document.getElementById("swfplayer" + link);
    if (player.children.length > 0) {
      while (player.firstChild) {
        player.removeChild(player.firstChild);
      }
      console.log(player.firstChild);
    }    

    console.log("Fetching SWF from " + swfPath + "...");
    grab(swfPath, "arraybuffer", function(data) {
      // start
      console.log("Successfully fetched SWF from " + swfPath);
      startPlayer(data);
    }, (error) => {
      // xhr error
      error("Recieved the following error: " + errorMessage + ". Error code: " + errorCode)
    });
  }

  const handleFullscreen = () => {
    const player = document.getElementById("player" + link);
    if (player) {
        if (player.requestFullscreen) {
            player.requestFullscreen();
        } else if (player.mozRequestFullScreen) { /* Firefox */
            player.mozRequestFullScreen();
        } else if (player.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
            player.webkitRequestFullscreen();
        } else if (player.msRequestFullscreen) { /* IE/Edge */
            player.msRequestFullscreen();
        }
    }
  }

  const handleMaximize = () => {
      const player = document.getElementById(`player${link}`);
      const gamebar = document.getElementById(`gamebar${link}`);
      if (player.style.width !== "100%") {
          player.style.width = "100%";
          player.style.height = "100%";
          // Optionally, you might also want to center the player on the screen
          player.style.position = "absolute";
          player.style.top = "0";
          player.style.left = "0";
          player.style.zIndex = 10000;
          gamebar.style.zIndex = 10001;
      } else {
        player.style.width = "";
        player.style.height = "";
        player.style.position = "";
        player.style.top = "";
        player.style.left = "";
        player.style.zIndex = "";
        gamebar.style.zIndex = "";
      }
  }
  
  const handleSound = () => {
    const iframe = document.getElementById(`player${link}`);
  
    // Check if the iframe exists and its contentWindow is accessible
    if (iframe && iframe.contentWindow) {
      const iframeDocument = iframe.contentWindow.document;
  
      // Check if the document inside the iframe exists
      if (iframeDocument) {
        const audioContext = new (iframe.contentWindow.AudioContext || iframe.contentWindow.webkitAudioContext)();
  
        // Create a ScriptProcessorNode to process audio data
        const scriptNode = audioContext.createScriptProcessor(4096, 1, 1);
  
        // Function to process audio data
        scriptNode.onaudioprocess = function(audioProcessingEvent) {
          const outputBuffer = audioProcessingEvent.outputBuffer;
          for (let channel = 0; channel < outputBuffer.numberOfChannels; channel++) {
            const outputData = outputBuffer.getChannelData(channel);
            for (let i = 0; i < outputData.length; i++) {
              outputData[i] = sound ? outputData[i] : 0; // Set volume to 0 for mute
            }
          }
        };
  
        // Connect the ScriptProcessorNode to the destination (speakers)
        scriptNode.connect(audioContext.destination);
  
        // Toggle sound state
        setSound(!sound);
      }
    }
  };
  
  return (
    <>
      <div id={`gamebar${link}`} className="absolute backdrop-blur-lg backdrop-brightness-75 left-0 flex flex-row gap-2 p-2 transition-opacity duration-200 opacity-0 hover:opacity-100 rounded-b z-30">
          <div className="group relative">
            <div className="absolute bg-primary-light rounded px-2 p-1 -translate-y-10 origin-bottom scale-0 ease-linear duration-100 group-hover:scale-100">
              <h2>Fullscreen</h2>
            </div>
            <FontAwesomeIcon className={`cursor-pointer active:scale-95 hover:bg-primary-light transition-all duration-200 p-2 rounded ${"text-text-base" === "white" ? "invert" : "invert"}`} icon={faExpand} onClick={handleFullscreen} />
          </div>

          <div className="group relative">
            <div className="absolute bg-primary-light rounded px-2 p-1 -translate-y-10 origin-bottom scale-0 ease-linear duration-100 group-hover:scale-100">
              <h2>Maximize</h2>
            </div>
            <FontAwesomeIcon className={`cursor-pointer active:scale-95 hover:bg-primary-light transition-all duration-200 p-2 rounded ${"text-text-base" === "white" ? "invert" : "invert"}`} icon={faMaximize} onClick={handleMaximize} />
          </div>

          {sound ?
            <div className="group relative">
              <div className="absolute bg-primary-light rounded px-2 p-1 -translate-y-10 origin-bottom scale-0 ease-linear duration-100 group-hover:scale-100">
                <h2>Mute</h2>
              </div>
              <FontAwesomeIcon className={`cursor-pointer active:scale-95 hover:bg-primary-light transition-all duration-200 p-2 rounded ${"text-text-base" === "white" ? "invert" : "invert"}`} icon={faVolumeHigh} onClick={handleSound} /> 
            </div>
            : 
            <div className="group relative">
              <div className="absolute bg-primary-light rounded px-2 p-1 -translate-y-10 origin-bottom scale-0 ease-linear duration-100 group-hover:scale-100">
                <h2>Unmute</h2>
              </div>
              <FontAwesomeIcon className={`cursor-pointer active:scale-95 hover:bg-primary-light transition-all duration-200 p-2 rounded ${"text-text-base" === "white" ? "invert" : "invert"}`} icon={faVolumeMute} onClick={handleSound} /> 
            </div>            
          }
      </div>
      {link.endsWith(".html") ? (
        <iframe
          id={"player" + link}
          title="User App"
          srcDoc={htmlContent || '<p>Loading HTML content...</p>'}
          className="w-full h-full resize z-20"
        />
      ) : link.endsWith(".swf") ? (
        <div className="flex flex-col text-text-base h-full w-full z-20" style={{height: "100%", width: "100%",}} id={"swfplayer" + link}>
        </div>
      ) : (
        <p>Loading content...</p>
      )}
    </>
  );
};

export default UserComponent;