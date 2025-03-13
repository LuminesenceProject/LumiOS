import { useEffect, useState } from "react";
import Apps from "../apps/Apps.json";

const AppList = ({ openApp }) => {
  const [apps, setApps] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const storedData = JSON.parse(localStorage.getItem(currentUser.name + "installedApps")) || [];

    setApps([...Apps, ...storedData]);
    setFilteredApps([...Apps, ...storedData]);
  }, []);

  const handleAppClick = (app) => {
    openApp(app);
  }

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = apps.filter(app => app.name.toLowerCase().includes(searchTerm));
    setFilteredApps(filtered);
  }

  return (
    <div className="grid gap-4 text-text-base bg-primary p-2">
      <div className="relative"> 
        <input
        style={{ borderColor: "black" }}
        className="peer bg-primary-light w-full h-full font-sans font-normal outline outline-0 focus:outline-0 disabled:border-0 transition-all placeholder-shown:border border focus:border-2 border-t-0 focus:border-t-0 text-sm px-3 py-2.5 rounded-[7px] text-text-base"
        onChange={handleSearch}
        placeholder="" />
        <label
        style={{ color: "black" }}
        className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate leading-tight peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-0 before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-0 after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-0 after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-0 peer-placeholder-shown:leading-[3.75]"><span className={`${"text-text-base" === "white" ? "invert" : ""} text-text-base`}>Search Apps</span>
        </label>
      </div>
      {filteredApps && filteredApps.map(app => (
        <div key={app.name} className="flex flex-row items-center mt-1 p-2 cursor-pointer bg-primary-light hover:shadow-md transition-shadow duration-200 shadow-sm rounded" onClick={() => handleAppClick(app.name)}>
          {app.svg.includes('<svg') ? (
            // Render SVG content directly if it's an SVG
            <div dangerouslySetInnerHTML={{ __html: app.svg }} className={`p-1 w-16 h-16 ${'text-text-base' === 'white' ? "invert" : ""}`} />
          ) : (
            // Render image if it's a link
            <img src={app.svg} alt={app.name} className="p-1 h-12 aspect-square" />
          )}
          <div className="flex flex-col justify-center px-2 mt-2">
            <h3 className="font-bold text-2xl">{app.name}</h3>
            <p className="text-center">{app.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AppList;