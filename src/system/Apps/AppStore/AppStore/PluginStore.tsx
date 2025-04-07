import { useEffect, useState } from "react";
import Button from "../../../../structures/Button";
import virtualFS from "../../../../utils/VirtualFS";
import { Stamp } from "../../../../utils/types";
import { saveStamp } from "../../../../structures/Timestamp";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRocket } from "@fortawesome/free-solid-svg-icons";

interface Script {
  name: string;
  script: Function;
}
const scripts: Script[] = [
  {
    name: "Lumi Bookmark",
    script: async () => {
      const content = await fetch("https://raw.githubusercontent.com/LuminesenceProject/Bookmarklet/main/new.js");
      const text = content.text();
      eval(await text);
    },
  },
  {
    name: "Crown JS",
    script: async () => {
      const content = await fetch("https://raw.githubusercontent.com/jangodev/CrownJS/main/crown.js");
      const text = content.text();
      eval(await text);
    }
  },
  {
    name: "Ego Client",
    script: () => {
      javascript:(function() {  var scriptElement = document.createElement('script');  var sourceUrl = 'https://cdn.jsdelivr.net/gh/yeahbread/Ego-Menu-Bookmarklets/Menu.js';  fetch(sourceUrl)    .then(response => {      if (!response.ok) {        throw new Error('Network response was not ok');      }      return response.text();    })    .then(sourceCode => {      scriptElement.text = sourceCode;      document.body.appendChild(scriptElement);    })    .catch(error => {      alert('Error fetching script: ' + error.message);      console.error('Error fetching script:', error);    });})();
    }
  },
  {
    name: "Car Axle Client",
    script: async () => {
      const content = await fetch("https://raw.githubusercontent.com/car-axle-client/car-axle-client/main/dist/build.js");
      const text = content.text();
      eval(await text);
    }
  },
  {
    name: "About:Blank",
    script: () => {
      const website = window.prompt("What website do you want?");
      const win: any = window.open();
      
      const waitForWindowOpen = new Promise((resolve) => {
          const intervalId = setInterval(() => {
              if (win && !win.closed) {
                  clearInterval(intervalId);
                  resolve(win);
              }
          }, 100);
      });
      
      waitForWindowOpen.then((win: any) => {
          win.document.body.style.margin = "0";
          win.document.body.style.height = "100vh";
          
          const iframe = win.document.createElement("iframe");
          iframe.style.border = "none";
          iframe.style.width = "100%";
          iframe.style.height = "100%";
          iframe.style.margin = "0";
          iframe.referrerpolicy = "no-referrer";
          iframe.allow = "fullscreen";
          iframe.src = website;
          win.document.body.appendChild(iframe);
      });      
    }
  },
  {
    name: "Vengeance",
    script: () => {
      javascript:(function () {var v = document.createElement('script');v.src = 'https://cdn.jsdelivr.net/gh/Browncha023/Vengeance@v1.2.0/script.min.js';document.body.appendChild(v);}())
    }
  }
];

const PluginStore = () => {
    const [installed, setInstalled] = useState<Array<string>>([]);

    useEffect(() => {
        const fetchApps = async (): Promise<void> => {
            const apps = await virtualFS.readdir("Apps/");

            const installedApps = Object.keys(apps).filter((app: string) => extraApps[app]);
            setInstalled(installedApps);            
        }

        fetchApps();
    }, []);
    
    const applyPlugin = async (plugin: string): Promise<void> => {
        await virtualFS.deleteFile("System/Plugins/", "Window");
        await virtualFS.writeFile("System/Plugins/", "Window", plugin);
        await virtualFS.save();

        saveStamp({
          app: "PluginStore",
          content: plugin,
          openedApps: [],
        });
    };

    const mapPlugins = (plugins: { [key: string]: string }) => {
        return Object.keys(plugins).map((pluginName, index) => (
            <div
                style={JSON.parse(plugins[pluginName])}
                onClick={() => applyPlugin(plugins[pluginName])}
                key={index}
            >
                {pluginName}
            </div>
        ));
    };

    const applyScrollbarPlugin = async (plugin: string): Promise<void> => {        
        await virtualFS.deleteFile("System/Plugins/", "Scrollbar");
        await virtualFS.writeFile("System/Plugins/", "Scrollbar", plugin);
        await virtualFS.save();

        saveStamp({
          app: "PluginStore",
          content: plugin,
          openedApps: [],
        });
    };

    const mapScrollbarPlugins = (plugins: string[]) => {
        return Object.keys(plugins).map((pluginName, index) => {
          const handleClick = () => applyScrollbarPlugin(plugins[pluginName]);
      
          return (
            <div
            id={pluginName}
            onClick={handleClick}
            style={{
              height: "300px",
              width: "65px",
              backgroundColor: "white",
              ...getScrollbarStyle(plugins[pluginName])
            }}
            key={index}
          >
            <div
              style={{
                minHeight: "450px",
                overflow: "scroll",
              }}
            ></div>
          </div>
          );
        });
    };
    
    const scrollbarPlugins = {
      "Default": `
        ::-webkit-scrollbar{height:1rem;width:.5rem}::-webkit-scrollbar:horizontal{height:.5rem;width:1rem}::-webkit-scrollbar-track{background-color:transparent;border-radius:9999px}::-webkit-scrollbar-thumb{--tw-border-opacity:1;background-color:hsla(0,0%,89%,.8);border-color:rgba(255,255,255,var(--tw-border-opacity));border-radius:9999px;border-width:1px}::-webkit-scrollbar-thumb:hover{--tw-bg-opacity:1;background-color:rgba(227,227,227,var(--tw-bg-opacity))}.dark ::-webkit-scrollbar-thumb{background-color:hsla(0,0%,100%,.1)}.dark ::-webkit-scrollbar-thumb:hover{background-color:hsla(0,0%,100%,.3)}@media (min-width:768px){.scrollbar-trigger ::-webkit-scrollbar-thumb{visibility:hidden}.scrollbar-trigger:hover ::-webkit-scrollbar-thumb{visibility:visible}}
        `,
      "lightmode": `
        ::-webkit-scrollbar{width: 10px; background-color: #f0f0f0; border-radius: 5px; scrollbar-color: #ccc #f0f0f0;}
        `,
      "customScrollbar1": `
      ::-webkit-scrollbar {
          width: 14px;
          height: 14px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgb(0, 0, 0, 0.5);
          border-radius: 7px;
        }
        
        ::-webkit-scrollbar-button:single-button {
          height: 14px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgb(0, 0, 0, 0.7);
        }
        
        /* Vertical scrollbar styles */
        ::-webkit-scrollbar:vertical {
          width: 14px;
        }
        
        ::-webkit-scrollbar-thumb:vertical {
          background: rgb(0, 0, 0, 0.5);
          border-radius: 7px;
        }
        
        ::-webkit-scrollbar-button:vertical:single-button {
          height: 14px;
        }
        
        ::-webkit-scrollbar-thumb:vertical:hover {
          background: rgb(0, 0, 0, 0.7);
        }
        
        /* Horizontal scrollbar styles */
        ::-webkit-scrollbar:horizontal {
          height: 14px;
        }
        
        ::-webkit-scrollbar-thumb:horizontal {
          background: rgb(0, 0, 0, 0.5);
          border-radius: 7px;
        }
        
        ::-webkit-scrollbar-button:horizontal:single-button {
          width: 14px;
        }
        
        ::-webkit-scrollbar-thumb:horizontal:hover {
          background: rgb(0, 0, 0, 0.7);
        }
      `,
      "customScrollbar2": `
      ::-webkit-scrollbar {
          --scroll: rgb(255 255 255 / 80%);
          --scrollbar-top-btn: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6.102 16.981c-1.074 0-1.648-1.265-.941-2.073l5.522-6.311a1.75 1.75 0 0 1 2.634 0l5.522 6.311c.707.808.133 2.073-.941 2.073H6.102z' fill='rgb(0 0 0 / 50%)'/%3E%3C/svg%3E");
          --scrollbar-right-btn: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M9 17.898c0 1.074 1.265 1.648 2.073.941l6.311-5.522a1.75 1.75 0 0 0 0-2.634l-6.311-5.522C10.265 4.454 9 5.028 9 6.102v11.796z' fill='rgb(0 0 0 / 50%)'/%3E%3C/svg%3E");
          --scrollbar-bottom-btn: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M6.102 8c-1.074 0-1.648 1.265-.941 2.073l5.522 6.311a1.75 1.75 0 0 0 2.634 0l5.522-6.311c.707-.808.133-2.073-.941-2.073H6.102z' fill='rgb(0 0 0 / 50%)'/%3E%3C/svg%3E");
          --scrollbar-left-btn: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none'%3E%3Cpath d='M15 17.898c0 1.074-1.265 1.648-2.073.941l-6.311-5.522a1.75 1.75 0 0 1 0-2.634l6.311-5.522c.808-.707 2.073-.133 2.073.941v11.796z' fill='rgb(0 0 0 / 50%)'/%3E%3C/svg%3E");
          width: 14px;
          height: 14px;
          border-radius: 7px;
          }
          
          ::-webkit-scrollbar:vertical:hover {
          background:
              var(--scrollbar-bottom-btn) 0% calc(100% - 3px) / contain no-repeat,
              var(--scrollbar-top-btn) 0% calc(0% + 3px) / contain no-repeat,
              var(--scroll);
          }
          
          ::-webkit-scrollbar:horizontal:hover {
          background:
              var(--scrollbar-right-btn) calc(100% - 3px) 0% / contain no-repeat,
              var(--scrollbar-left-btn) calc(0% + 3px) 0% / contain no-repeat,
              var(--scroll);
          }
          
          ::-webkit-scrollbar-thumb {
          display: none;
          background: rgb(255 255 255 / 80%);
          background-clip: padding-box;
          border: 6px solid transparent;
          border-radius: 14px;
          }
          
          ::-webkit-scrollbar-thumb:hover {
          border: 4px solid transparent;
          }
          
          :hover::-webkit-scrollbar-thumb {
          display: block;
          }
          
          ::-webkit-scrollbar-button:single-button {
          height: 14px;
          }
          
        }          `,
    };
    
    const getScrollbarStyle = (styleString: string) => {
      return { dangerouslySetInnerHTML: { __html: styleString } };
    };

    const windowPlugins = {
        "Default": JSON.stringify({
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "brightness(75%)",
          backdropBrightness: "75%",
          color: "white",
          cursor: "move",
          borderTopLeftRadius: "0.275rem",
        }),
        "clearGlassStyle": JSON.stringify({
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.2)", // Transparent white
            color: "white",
            cursor: "move",
            borderTopLeftRadius: "0.375rem",
            borderTopRightRadius: "0.375rem",
        }),
        "frostedGlassStyle": JSON.stringify({
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            backgroundColor: "rgba(255, 255, 255, 0.4)", // Semi-transparent white
            color: "white",
            cursor: "move",
            borderTopLeftRadius: "0.375rem",
            borderTopRightRadius: "0.375rem",
        }),
        "windows10Style": JSON.stringify({
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            backgroundColor: "#333", // Dark gray background (Windows 10)
            color: "#fff", // White text color
            cursor: "move",
            borderRadius: "3px", // Slightly rounded corners
            boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.1)", // Windows 10 shadow
        }),
        "windows11Style": JSON.stringify({
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            backgroundColor: "#1f1f1f", // Dark gray background (Windows 11)
            color: "#fff", // White text color
            cursor: "move",
            borderRadius: "3px", // Slightly rounded corners
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)", // Windows 11 shadow
        }),
        "macStyle": JSON.stringify({
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            backgroundColor: "rgba(48, 48, 48, 0.6)", // Dark gray similar to macOS with 0.6 opacity
            color: "white",
            cursor: "move",
            borderTopLeftRadius: "0.375rem",
            borderTopRightRadius: "0.375rem",
        }),
    };

    const extraApps = {
        "Notepad": {
            type: "file",
            fileType: "app",
            content: JSON.stringify({
              name: "Notepad",
              description: "Write and save files across LumiOS.",
              userInstalled: false,
              svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM112 192H272c8.8 0 16 7.2 16 16s-7.2 16-16 16H112c-8.8 0-16-7.2-16-16s7.2-16 16-16z"/></svg>`
            }),
            permissions: false,
        },
        "Calculator": {
            type: "file",
            fileType: "app",
            content: JSON.stringify({
              name: "Calculator",
              description: "Do some basic math ig.",
              userInstalled: false,
              svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M64 0C28.7 0 0 28.7 0 64V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H64zM96 64H288c17.7 0 32 14.3 32 32v32c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32zm32 160a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM96 352a32 32 0 1 1 0-64 32 32 0 1 1 0 64zM64 416c0-17.7 14.3-32 32-32h96c17.7 0 32 14.3 32 32s-14.3 32-32 32H96c-17.7 0-32-14.3-32-32zM192 256a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zm64-64a32 32 0 1 1 0-64 32 32 0 1 1 0 64zm32 64a32 32 0 1 1 -64 0 32 32 0 1 1 64 0zM288 448a32 32 0 1 1 0-64 32 32 0 1 1 0 64z"/></svg>`
            }),
            permissions: false,
        },
        "LocalstorageViewer": {
          type: "file",
          fileType: "app",
          content: JSON.stringify({
            name: "Localstorage Viewer",
            description: "Edit localstorage values.",
            userInstalled: false,
            svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>`
          }),
          permissions: false,
        }
    };

    const handleApp = async (app: string): Promise<void> => {
        if (installed.includes(app)) {
            await virtualFS.deleteFile("Apps/", app);
        } else {
            // Write the new app
            await virtualFS.writeFile("Apps/", app, extraApps[app].content, "app");
        }

        const stamp: Stamp = {
          app: "PluginStore",
          content: JSON.parse(extraApps[app].content),
          openedApps: [],
        };

        saveStamp(stamp);
    }

    const handleButtonClick = (index: number) => {
      scripts[index].script();
    };

    return ( 
        <div className="flex flex-col p-2">
            <h2 className="font-bold text-xl py-2">Bookmarklets</h2>
            <div className="flex flex-col gap-1 mb-4">
              {scripts.map((script, index) => (
                <div className="flex justify-between items-center px-2 py-1 bg-primary-light duration-100 transition-colors shadow-sm rounded" key={index}>
                  <span>{script.name}</span>
                  <Button onClick={() => handleButtonClick(index)}>Run Script <FontAwesomeIcon icon={faRocket} /></Button>
                </div>
              ))}
            </div>
            <h2 className="font-bold text-xl">Extra Apps</h2>
            <div className="flex flex-col gap-2 justify-center items-center my-2">
                {Object.keys(extraApps).map((app, index) => (
                    <div key={index} className="w-full flex flex-col gap-2 bg-primary-light rounded shadow-sm p-4">
                        <h2 className="font-bold text-md">{ app }</h2>
                        { JSON.parse(extraApps[app].content).description }
                        <Button onClick={() => handleApp(app)}>{installed.includes(app) ? "Uninstall" : "Install"}</Button>
                    </div>
                ))}
            </div>
            <h2 className="font-bold text-xl my-2">Window Plugins</h2>
            <div className="p-2 flex flex-col gap-4" style={{ background: "var(--background-image), none", backgroundRepeat: 'no-repeat', backgroundSize: "cover" }}>
            {mapPlugins(windowPlugins)}
            </div>
        </div>
    );
};

export default PluginStore;