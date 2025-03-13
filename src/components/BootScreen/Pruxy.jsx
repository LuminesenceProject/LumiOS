import { useEffect, useRef, useState } from "react";

const Pruxy = () => {
    const [proxy, setProxy] = useState("");
    const [cloak, setCloak] = useState(0);
    const [browserType, setBrowserType] = useState(localStorage.getItem("browserType") || "embed");

    const browserRef = useRef(null);

    useEffect(() => {
        localStorage.setItem("browserType", browserType);
    }, [browserType]);

    useEffect(() => {
        localStorage.setItem("proxy", proxy);
    }, [proxy]);

    useEffect(() => {
        localStorage.setItem("cloak", JSON.stringify(cloaks[cloak]));
    }, [cloak]);

    const handleBrowserChange = (e) => {
        setBrowserType(e.target.checked ? "iframe" : "embed")
    }

    const cloaks = [
        {
            name: "Google",
            link: "https://google.com/favicon.ico",
        },
        {
            name: "Canvas",
            link: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico",
        },
        {
            name: "Desmos | Graphing Calculator",
            link: "https://www.desmos.com/assets/img/apps/graphing/favicon.ico",
        },
        {
            name: "My Drive - Google Drive",
            link: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
        },
        {
            name: "Classroom",
            link: "https://ssl.gstatic.com/classroom/ic_product_classroom_144.png"
        },
        {
            name: "New Tab",
            link: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABRklEQVR42mKgOqjq75ds7510YNL0uV9nAGqniqwKYiCIHIIjcAK22BGQLRdgBWvc3fnWk/FJhrkPO1xPgGvqPfLfJMHhT1yqurvS48bPaJhjD2efgidnVwa2yv59xecvEvi0UWCXq9t0ItfP2MMZ7nwIpkA8F1n8uLxZHM6yrBH7FIl2gFXDHYsErkn2hyKLHtcKrFntk58uVQJ+kSdQnmjhID4cwLLa8+K0BXsfNWCqBOsFdo2Yldv43DBrkxd30cjnNyYBhK0SQGkI9pG4Mu40D5b374DRCAyhHqXVfTmOwivivMkJxBz5wnHCtBfGgNFC+ChWKWRf3hsQIlyEoIv4IYEo5wkgtBLRekY9DE4Uin4Keae6hydGnljPmE8kRcCine6827AMsJ1IuW9ibnlQpXLBCR/WC875m2BP+VSu3c/0m+8V08OBngc0pxcAAAAASUVORK5CYII="
        },
        {
            name: "Google Docs",
            link: "https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico",
        },
        {
            name: "Edpuzzle",
            link: "https://edpuzzle.imgix.net/favicons/favicon-32.png",
        },
        {
            name: "Dashboard | Khan Academy",
            link: "https://cdn.kastatic.org/images/favicon.ico?logo",
        },
        {
            name: "Latest | Quizlet",
            link: "https://assets.quizlet.com/a/j/dist/app/i/logo/2021/q-twilight.e27821d9baad165.png",
        }
    ];

    return ( 
        <div className="flex flex-col p-2">
            <h2 className="font-bold text-lg">Experimental Proxy Settings</h2>
            <div className="relative my-1">
                <select
                    onChange={(e) => setCloak(e.target.value)}
                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    >
                    {cloaks.map((cloak, index) => (
                        <option value={index} key={index}>{ cloak.name }</option>
                    ))}
                </select>
                <label
                style={{ color: "black" }}
                className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                Select a Cloak
                </label>
            </div>
            <div className="relative my-2"> 
                <input
                style={{ borderColor: "black" }}
                className="peer bg-primary-light w-full h-full font-sans font-normal outline outline-0 focus:outline-0 disabled:border-0 transition-all placeholder-shown:border border focus:border-2 border-t-0 focus:border-t-0 text-sm px-3 py-2.5 rounded-[7px] text-text-base"
                onChange={(e) => setProxy(e.target.value)}
                placeholder="" />
                <label
                style={{ color: "black" }}
                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate leading-tight peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-0 before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-0 after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-0 after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-0 peer-placeholder-shown:leading-[3.75]"><span className={`${"text-text-base" === "white" ? "invert" : ""} text-text-base`}>Set Global Proxy</span>
                </label>
            </div>
            <h3 className="font-bold text-lg">Enable iframe/embed</h3>
            <p>Iframes are often blocked on school devices. The browser uses embeds, but are often blocked as well.</p>
            <div className="inline-flex items-center">
                <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
                  <input 
                    type="checkbox"
                    required
                    onChange={handleBrowserChange}
                    ref={browserRef}
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"/>
                  <span
                    className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                      stroke="currentColor" strokeWidth="1">
                      <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"></path>
                    </svg>
                  </span>
                </label>
                <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="check">
                  Current type: {browserType}
                </label>
            </div> 
        </div>
    );
}
 
export default Pruxy;