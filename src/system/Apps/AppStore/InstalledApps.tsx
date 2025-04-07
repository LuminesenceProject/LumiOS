import { useEffect, useState } from "react";
import { App, File } from "../../../utils/types";
import { useContextMenu } from "../../ContextMenu/useContextMenu";
import virtualFS from "../../../utils/VirtualFS";
import ContextMenu from "../../ContextMenu/ContextMenu";
import { faArrowUpFromBracket, faFilePen, faMagnifyingGlassPlus } from "@fortawesome/free-solid-svg-icons";

interface InstalledAppsProps {
    setOpenedApps: (prev: string[]) => void;
    setCustomWindowContent: (prev: null[]) => void;
    setHtmlCustomWindowContent: (prev: null[]) => void;
}

const InstalledApps: React.FC<InstalledAppsProps> = ({ setOpenedApps, setCustomWindowContent, setHtmlCustomWindowContent }) => {
    const [apps, setApps] = useState<Array<App>>([]);
    const [input, setInput] = useState<string>("");
    const { menuVisible, menuActions, dropDownActions, showMenu, hideMenu } = useContextMenu();
    
    // New state variable for the updated menu position
    const [updatedMenuPosition, setUpdatedMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

    useEffect(() => {
        const fetchApps = async () => {
            const apps = await virtualFS.readdir("Apps");
  
            const result = Object.keys(apps).map((name) => {
              const app = apps[name] as File;
              
              let parsed;
              if (typeof app.content === "string") {
                  parsed = tryParseJSON(app.content);
                  if (parsed === null) {
                      // Handle the case where parsing failed, e.g., fallback to original content
                      parsed = { content: app.content };
                  }
              } else {
                  parsed = app.content;
              }
                      
              const newContent = {
                ...parsed,
                folder: app.type !== "file",
                type: app.fileType,
                altName: name,
              }
        
              return newContent;
            });
  
            setApps(result);            
        }
        
        fetchApps();
    }, []);

    const handleAppContextMenu = (event: React.MouseEvent<HTMLDivElement>, app: unknown | App) => {
        event.preventDefault();
    
        // Get the position relative to the window
        const x = event.clientX;
        const y = event.clientY;
    
        // Get the bounding client rect of the parent component
        const rect = document.getElementById("install");
        const bounds = rect?.getBoundingClientRect();
    
        if (bounds) {
            // Calculate the relative position within the bounding rectangle
            const relativeX = x - bounds.left;
            const relativeY = y - bounds.top;
    
            // Update the state variable with the adjusted menu position
            setUpdatedMenuPosition({ x: relativeX, y: relativeY });
        }
        
        showMenu(event, app as string, {
            "Open": async () => {
                const allApps = await virtualFS.readdir("Apps");
      
                const normalName: string = Object.keys(allApps).find((value: any) => {
                  const item = allApps[value];
                  if (item.type === "file") {
                    const content = tryParseJSON(item.content);
                    return content && content.name === app;
                  }
                  return false;
                }) || app;
                
                setOpenedApps((prev: string[]) => [...prev, normalName]);
                hideMenu();
            },
        }, {
            "Viewer": async () => {
                const apps = await virtualFS.readdir("Apps");
                
                const parsedApps = Object.keys(apps).map((name, key) => {
                  const app = apps[name];
                  
                  return JSON.parse(app.content);
                });
        
                const parsed = parsedApps.find(parsedApp => parsedApp.name === app.name);        
                      
                setHtmlCustomWindowContent((prev) => [...prev, { title: parsed.name, content: JSON.stringify(parsed), path: "Apps/" }]);
                hideMenu();
              },
              "Editor": async () => {
                const apps = await virtualFS.readdir("Apps");
                
                const parsedApps = Object.keys(apps).map((name, key) => {
                  const app = apps[name];
                  
                  return JSON.parse(app.content);
                });
        
                const parsed = parsedApps.find(parsedApp => parsedApp.name === app.name);
                setCustomWindowContent((prev) => [...prev, { title: parsed.name, content: JSON.stringify(parsed), path: "Apps/" }]);
                hideMenu();
              },
        });
    
        event.stopPropagation();
    };

    // @ts-ignore
    function tryParseJSON(jsonString) {
        try {
            return JSON.parse(jsonString);
        } catch (error) {
            //console.error("Failed to parse JSON:", error);
            return null;
        }
    }
    
    const handleAppClick = async (app: string, type: string | boolean) => {
        const allApps = await virtualFS.readdir("Apps/");
  
        const normalName = Object.keys(allApps).find((value: any) => {
          const content = tryParseJSON(allApps[value].content);
          return content.name === app;
        }) || app;        
     
        if (["app", "html"].includes(type)) {
          setOpenedApps((prev: any) => [...prev, normalName]);
        } else if (type && typeof type !== "string") {
          setOpenedApps((prev: any) => [...prev, "FileExplorer"]);
        } else {  
          const desktopValues = await virtualFS.readdir("Desktop/");
          const value = desktopValues[normalName] as File;             
  
          setCustomWindowContent((prev) => [...prev, {
            title: app,
            content: value.content,
            path: "Apps/",
          }]);
        }
    }

    return (
        <div className="flex flex-col flex-wrap gap-2 relative p-2" id="install">
            <input className="input-main" onChange={(e) => setInput(e.target.value)} placeholder="Search apps..." />
            {apps.filter(value => value.name.toLowerCase().includes(input.toLowerCase())).map((app, index) => (
                <div key={index} className="flex flex-row items-center justify-between gap-1 bg-primary-light hover:bg-secondary duration-200 transition-colors cursor-pointer py-1 px-2 rounded shadow-sm" onClick={() => handleAppClick(app.altName, app.type || app.folder)} onContextMenu={(e) => handleAppContextMenu(e, app)}>
                    {!app?.svg?.startsWith("data:image") && !app?.svg?.startsWith("https://") ? (
                        <div dangerouslySetInnerHTML={{ __html: app.svg }} style={{ background: "transparent" }} className="cursor-pointer invert w-12 h-12 bg-secondary p-2 rounded" />
                    ) : (
                        <img src={app.svg} alt={app.name} className="cursor-pointer w-12 h-12 p-2 rounded" />
                    )}
                    {app.name}
                </div>
            ))}
            {menuVisible && (
                <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} dropDownName="Open With" menuDropdown={dropDownActions} emojis={[faArrowUpFromBracket, faMagnifyingGlassPlus, faFilePen]} />
            )}
        </div>
    );
};

export default InstalledApps;