import React, { useEffect, useState } from "react";
import apps from "../apps/Apps.json";
import Button from "../../util/Button";
import version from "../../util/util";

const ConvertApps = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [thisVersion, setThisVersion] = useState(4);
    const [convertedValue, setConvertedValue] = useState("");
    const [originalValue, setOriginalValue] = useState("");
    const lumiVersion = version;

    useEffect(() => {
        handleConvertValue(originalValue);
    }, [activeTab, thisVersion]);

    const handleDownload = () => {
        const filename = `Converted v${thisVersion} settings.json`;
        const jsonString = JSON.stringify(convertedValue, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = filename || version.name + "default settings";

        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleConvertValue = (value) => {
        function isJsonString(str) {
            try {
                JSON.parse(str);
                return true;
            } catch (e) {
                return false;
            }
        }

        if (!isJsonString(value)) {
            return;
        }

        let convertedValue;

        switch (thisVersion) {
            case 4: {
                // Parse the value as JSON
                const jsonValue = JSON.parse(value);

                // Retrieve necessary settings from the parsed JSON
                const { theme, background, taskbarPosition, quickLoad, installedApps, currentUser, users } = jsonValue;

                // Construct the template
                const TEMPLATE = {
                    theme,
                    background,
                    taskbarPosition,
                    quickLoad,
                    installedApps,
                    currentUser,
                    users,
                };

                convertedValue = TEMPLATE;
                break;
            }
            case 4.3: {
                // Parse the value as JSON
                const jsonValue = JSON.parse(value);

                // Retrieve necessary settings from the parsed JSON
                let { theme, background, taskbarPosition, quickLoad, installedApps, currentUser, users, advancedSettings } = jsonValue;

                // advanced settings do not exist prior to this version
                if (advancedSettings === undefined) {
                    // use advanced.jsx template
                    advancedSettings = {
                        terminal: false,
                        quickLoad: false,
                        fileSystem: false,
                        questionPrompts: false,
                    }
                }

                // Construct the template
                const TEMPLATE = {
                    theme,
                    background,
                    taskbarPosition,
                    quickLoad,
                    installedApps,
                    advancedSettings, // Include advanced settings for v4.3
                    currentUser,
                    users,
                };

                convertedValue = TEMPLATE;
                break;
            }
            case 4.4: {
                // Parse the value as JSON
                const jsonValue = JSON.parse(value);

                // Retrieve necessary settings from the parsed JSON
                let { theme, background, taskbarPosition, desktopPositions, iconSize, quickLoad, proxyLinks, activeProxy, bookmarks, installedApps, currentUser, users, advancedSettings } = jsonValue;

                // advanced settings do not exist prior to this version
                if (advancedSettings === undefined) {
                    // use advanced.jsx template
                    advancedSettings = {
                        terminal: false,
                        quickLoad: false,
                        fileSystem: false,
                        questionPrompts: false,
                    }
                }

                // desktop positions, and icon size were also nonexistant, and could be undefined in new cases
                if (desktopPositions === undefined) {
                    desktopPositions = {}; // store as default value
                }

                if (iconSize === undefined) {
                    iconSize = 32;
                }

                // browser was updated at this point in time. add stuff
                if (proxyLinks === undefined) {
                    proxyLinks = [];
                }

                if (activeProxy === undefined) {
                    activeProxy = "";
                }

                if (bookmarks === undefined) {
                    bookmarks = [];
                }

                // Construct the template
                const TEMPLATE = {
                    theme,
                    background,
                    taskbarPosition,
                    desktopPositions, // added v4.4
                    iconSize, // added v4.4
                    quickLoad,
                    proxyLinks, // added v4.4
                    activeProxy, // added v4.4
                    bookmarks, // added v4.4
                    installedApps,
                    advancedSettings, // Include advanced settings for v4.2
                    currentUser,
                    users,
                };

                convertedValue = TEMPLATE;
            }
            case 5: {
                // Parse the value as JSON
                const jsonValue = JSON.parse(value);

                // Retrieve necessary settings from the parsed JSON
                let { version, theme, background, taskbarPosition, desktopPositions, iconSize, quickLoad, proxyLinks, activeProxy, bookmarks, installedApps, pinnedApps, shortcuttedApps, currentUser, users, advancedSettings } = jsonValue;

                // advanced settings do not exist prior to this version
                if (advancedSettings === undefined) {
                    // use advanced.jsx template
                    advancedSettings = {
                        terminal: false,
                        quickLoad: false,
                        fileSystem: false,
                        questionPrompts: false,
                    }
                }

                // desktop positions, and icon size were also nonexistant, and could be undefined in new cases
                if (desktopPositions === undefined) {
                    desktopPositions = {}; // store as default value
                }

                if (iconSize === undefined) {
                    iconSize = 32;
                }

                // browser was updated at this point in time. add stuff
                if (proxyLinks === undefined) {
                    proxyLinks = [];
                }

                if (activeProxy === undefined) {
                    activeProxy = "";
                }

                if (bookmarks === undefined) {
                    bookmarks = [];
                }

                if (pinnedApps === undefined) {
                    pinnedApps = apps.filter((app) => app.pinned);
                }

                if (shortcuttedApps === undefined) {
                    shortcuttedApps = apps.filter((app) => app.shortcut);
                }

                if (version === undefined) {
                    version = lumiVersion;
                }

                // Construct the template
                const TEMPLATE = {
                    version,
                    theme,
                    background,
                    taskbarPosition,
                    desktopPositions, // added v4.4
                    iconSize, // added v4.4
                    quickLoad,
                    proxyLinks, // added v4.4
                    activeProxy, // added v4.4
                    bookmarks, // added v4.4
                    installedApps,
                    pinnedApps, // added v5
                    shortcuttedApps, // added v5
                    advancedSettings, // Include advanced settings for v4.2
                    currentUser,
                    users,
                };

                convertedValue = TEMPLATE;
            }
            default:
                break;
        }

        // Set the converted value in the state
        setConvertedValue(convertedValue);
        setOriginalValue(value);
    }

    const handleFile = (e) => {
        const file = e.target.files[0];

        const reader = new FileReader();
        reader.onload = () => {
            setOriginalValue(reader.result);
        }

        reader.readAsText(file);
    }

    const fetchActiveTab = () => {
        switch (activeTab) {
            case 1:
                return (
                    <div className="w-full h-full p-2">
                        <textarea
                            value={originalValue}
                            onChange={(e) => setOriginalValue(e.target.value)}
                            style={{ width: "100%", height: "80%", resize: "none", color: "black" }}
                        />
                        <input onChange={handleFile} type="file" accept=".json" className="input-main" />
                    </div>
                );
            case 2:
                return (
                    <div className="w-full h-full p-2">
                        <textarea
                            value={JSON.stringify(convertedValue, null, 2)}
                            readOnly
                            style={{ width: "100%", height: "80%", resize: "none", color: "black" }}
                        />
                        <button className="button-main !bg-secondary font-bold w-full" onClick={handleDownload}>Download</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="bg-primary text-text-base flex flex-col h-full p-2">
            <h2 className="text-2xl font-bold">Convert to v{version.version} of {version.name}.</h2>
            <div className="flex flex-row gap-2 my-1">
                <Button className={`${activeTab === 1 && "!bg-secondary"} text-sm`} onClick={() => setActiveTab(1)}>Original JSON</Button>
                <Button className={`${activeTab === 2 && "!bg-secondary"} text-sm`} onClick={() => setActiveTab(2)}>Converted JSON</Button>
                <div className="relative flex flex-row justify-center items-center w-full">
                    <select style={{ color: "black" }} className="select-main" value={thisVersion} onChange={(e) => {
                        setThisVersion(parseFloat(e.target.value));
                        handleConvertValue(originalValue); // Call handleConvertValue when version changes
                    }}>
                        <option className="option-main" value={4}>v4</option>
                        <option className="option-main" value={4.3}>v4.3</option>
                        <option className="option-main" value={4.4}>v4.4</option>
                        <option className="option-main" value={5}>v5</option>
                    </select>
                    <label
                        style={{ color: "black" }}
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        App Version
                    </label>
                </div>
            </div>
            <div style={{ height: "calc(100% - 64px)" }}>
                {fetchActiveTab()}
            </div>
        </div>
    );
};

export default ConvertApps;