import { useEffect, useRef, useState } from "react";
import Button from "../../util/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faSave } from "@fortawesome/free-solid-svg-icons";
import baseTheme from "../../util/themes/baseTheme";
import image1 from "../../Images/image1.jpeg";

const Users = () => {
    const [selectedUser, setSelectedUser] = useState(null);
    const [currentName, setCurrentName] = useState("");
    const [users, setUsers] = useState([]);

    // User custom settings
    const [theme, setTheme] = useState({});
    const [background, setBackground] = useState(image1);
    const [taskbarPosition, setTaskbarPosition] = useState("south");
    const [desktopPositions, setDesktopPositions] = useState({});
    const [iconSize, setIconSize] = useState(32);
    const [quickLoad, setQuickLoad] = useState(false);
    const [proxyLinks, setProxyLinks] = useState([]);
    const [activeProxy, setActiveProxy] = useState("");
    const [bookmarks, setBookmarks] = useState([]);
    const [installedApps, setInstalledApps] = useState([]);
    const [pinnedApps, setPinnedApps] = useState([]);
    const [shortcuttedApps, setShortcuttedApps] = useState([]);
    const [advancedSettings, setAdvancedSettings] = useState({
        terminal: false,
        quickLoad: false,
        fileSystem: false,
        questionPrompts: false,
    });

    const userRef = useRef(null);
    const inputRef = useRef(null);
    const themeInputRef = useRef(null);
    const backgroundInputRef = useRef(null);
    const taskbarPositionInputRef = useRef(null);
    const iconSizeInputRef = useRef(null);
    const quickLoadInputRef = useRef(null);
    const proxyLinksInputRef = useRef(null);
    const activeProxyInputRef = useRef(null);
    const bookmarksInputRef = useRef(null);
    const installedAppsInputRef = useRef(null);
    const pinnedAppsInputRef = useRef(null);
    const shortcuttedAppsInputRef = useRef(null);
    const advancedSettingsInputRef = useRef(null);

    useEffect(() => {
        const storedUsers = JSON.parse(localStorage.getItem("users")) || [];
        setUsers(storedUsers);
    }, []);

    useEffect(() => {
        if (selectedUser) {
            setTheme(selectedUser.name + "theme" || baseTheme);
            setBackground(JSON.parse(localStorage.getItem(selectedUser.name + "background")) || image1);
            setTaskbarPosition(localStorage.getItem(selectedUser.name + "taskbarPosition") || "south");
            setDesktopPositions(JSON.parse(localStorage.getItem(selectedUser.name + 'desktopPositions')) || {});
            setIconSize(localStorage.getItem(selectedUser.name + 'iconSize') || 32);
            setQuickLoad(JSON.parse(localStorage.getItem(selectedUser.name + "quickLoad")) || false);
            setProxyLinks(JSON.parse(localStorage.getItem(selectedUser.name + "proxyLinks")) || []);
            setActiveProxy(JSON.parse(localStorage.getItem(selectedUser.name + "activeProxy")) || "");
            setBookmarks(JSON.parse(localStorage.getItem(selectedUser.name + "bookmarks")) || []);
            setInstalledApps(JSON.parse(localStorage.getItem(selectedUser.name + 'installedApps')) || []);
            setPinnedApps(JSON.parse(localStorage.getItem(selectedUser.name + "-pinnedApps")) || []);
            setShortcuttedApps(JSON.parse(localStorage.getItem(selectedUser.name + "-shortcuttedApps")) || []);
            setAdvancedSettings(JSON.parse(localStorage.getItem(selectedUser.name + "advancedSettings")) || {
                terminal: false,
                quickLoad: false,
                fileSystem: false,
                questionPrompts: false,
            });
        }
    }, [selectedUser]);

    const handleClick = (user) => {
        setSelectedUser(user);
        setCurrentName(user.name);
    };

    const handleInputChange = (event, key) => {
        const newValue = event.target.value;
        setSelectedUser(prevUser => ({
            ...prevUser,
            [key]: newValue
        }));
    };

    const handleSaveChanges = () => {
        const updatedUsers = users.map(user => {
            if (user.name === currentName) {
                return selectedUser;
            }
            return user;
        });

        setUsers(updatedUsers);
        setSelectedUser(null);

        // Update localStorage with the new users
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    };

    const handleInputSave = () => {
        const updatedUsers = users.map(user => {
            if (user.name === currentName) {
                return JSON.parse(userRef.current.value);
            }
            return user;
        });

        setUsers(updatedUsers);
        setSelectedUser(null);

        // Update localStorage with the new users
        localStorage.setItem("users", JSON.stringify(updatedUsers));
    };

    const handleUserInputSave = () => {
        const newUsers = JSON.parse(inputRef.current.value);
        setUsers(newUsers);

        localStorage.setItem("users", JSON.stringify(newUsers));
    };

    const handleThemeInputChange = (event) => {
        setTheme(event.target.value);
    };

    const handleBackgroundInputChange = (event) => {
        setBackground(event.target.value);
    };

    const handleTaskbarPositionInputChange = (event) => {
        setTaskbarPosition(event.target.value);
    };

    const handleIconSizeInputChange = (event) => {
        setIconSize(event.target.value);
    };

    const handleQuickLoadInputChange = (event) => {
        setQuickLoad(event.target.checked);
    };

    const handleProxyLinksInputChange = (event) => {
        setProxyLinks(event.target.value.split(","));
    };

    const handleActiveProxyInputChange = (event) => {
        setActiveProxy(event.target.value);
    };

    const handleBookmarksInputChange = (event) => {
        setBookmarks(event.target.value.split(","));
    };

    const handleInstalledAppsInputChange = (event) => {
        setInstalledApps(event.target.value.split(","));
    };

    const handlePinnedAppsInputChange = (event) => {
        setPinnedApps(event.target.value.split(","));
    };

    const handleShortcuttedAppsInputChange = (event) => {
        setShortcuttedApps(event.target.value.split(","));
    };

    const handleAdvancedSettingsInputChange = (event) => {
        setAdvancedSettings({
            ...advancedSettings,
            [event.target.name]: event.target.checked,
        });
    };

    const handleThemeSave = () => {
        localStorage.setItem(selectedUser.name + "theme", JSON.stringify(theme));
    };

    const handleBackgroundSave = () => {
        localStorage.setItem(selectedUser.name + "background", JSON.stringify(background));
    };

    const handleTaskbarPositionSave = () => {
        localStorage.setItem(selectedUser.name + "taskbarPosition", taskbarPosition);
    };

    const handleIconSizeSave = () => {
        localStorage.setItem(selectedUser.name + "iconSize", iconSize);
    };

    const handleQuickLoadSave = () => {
        localStorage.setItem(selectedUser.name + "quickLoad", JSON.stringify(quickLoad));
    };

    const handleProxyLinksSave = () => {
        localStorage.setItem(selectedUser.name + "proxyLinks", JSON.stringify(proxyLinks));
    };

    const handleActiveProxySave = () => {
        localStorage.setItem(selectedUser.name + "activeProxy", JSON.stringify(activeProxy));
    };

    const handleBookmarksSave = () => {
        localStorage.setItem(selectedUser.name + "bookmarks", JSON.stringify(bookmarks));
    };

    const handleInstalledAppsSave = () => {
        localStorage.setItem(selectedUser.name + "installedApps", JSON.stringify(installedApps));
    };

    const handlePinnedAppsSave = () => {
        localStorage.setItem(selectedUser.name + "-pinnedApps", JSON.stringify(pinnedApps));
    };

    const handleShortcuttedAppsSave = () => {
        localStorage.setItem(selectedUser.name + "-shortcuttedApps", JSON.stringify(shortcuttedApps));
    };

    const handleAdvancedSettingsSave = () => {
        localStorage.setItem(selectedUser.name + "advancedSettings", JSON.stringify(advancedSettings));
    };

    const renderUserButton = (user, index) => {
        const fadedProperties = Object.keys(user).map((key) => {
            return (
                <span key={key} className="text-sm mr-1" style={{ color: "lightgray" }}>
                    {key}: {user[key]}
                </span>
            );
        });

        return (
            <Button key={index} onClick={() => handleClick(user)} className="group relative">
                Username: {user.name}
                <div className="flex flex-row gap-2 mt-1 absolute inset-0 -z-10 justify-center items-center">{fadedProperties}</div>
            </Button>
        );
    };

    return (
        <div className="w-full h-full">
            {selectedUser == null ?
                <div className="flex flex-col gap-2 w-full h-full px-2 py-2">
                    {users.map((user, index) => renderUserButton(user, index))}
                    <textarea ref={inputRef} defaultValue={users.length ? JSON.stringify(users, null, 2) : ''} style={{ whiteSpace: "pre-wrap" }} className="h-full" />
                    <Button onClick={handleUserInputSave}>Save Users</Button>
                </div>
                :
                <div className="flex flex-col w-full h-full p-4 overflow-x-hidden overflow-y-auto">
                    <div className="flex my-2 justify-between">
                        <Button onClick={() => setSelectedUser(null)}>
                            <FontAwesomeIcon className="pr-2" icon={faChevronLeft} />
                            Back
                        </Button>
                        <Button onClick={handleSaveChanges}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Changes
                        </Button>
                    </div>
                    <ul className="flex flex-col gap-2">
                        {Object.keys(selectedUser).map((keyName, index) => (
                            <li className="travelcompany-input" key={index}>
                                {keyName}: <input
                                    className="input-main"
                                    defaultValue={selectedUser[keyName]}
                                    onChange={(e) => handleInputChange(e, keyName)}
                                />
                            </li>
                        ))}
                        <hr className="my-5" />
                        <h2>Theme</h2>
                        <input
                            ref={themeInputRef}
                            defaultValue={JSON.stringify(theme)}
                            onChange={handleThemeInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleThemeSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Theme
                        </Button>

                        <h2>Background</h2>
                        <input
                            ref={backgroundInputRef}
                            defaultValue={background}
                            onChange={handleBackgroundInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleBackgroundSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Background
                        </Button>

                        <h2>Taskbar Position</h2>
                        <input
                            ref={taskbarPositionInputRef}
                            defaultValue={taskbarPosition}
                            onChange={handleTaskbarPositionInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleTaskbarPositionSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Taskbar Position
                        </Button>
                        <h2>Icon Size</h2>
                        <input
                            ref={iconSizeInputRef}
                            type="number"
                            defaultValue={iconSize}
                            onChange={handleIconSizeInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleIconSizeSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Icon Size
                        </Button>

                        <h2>Quick Load</h2>
                        <input
                            ref={quickLoadInputRef}
                            type="checkbox"
                            checked={quickLoad}
                            onChange={handleQuickLoadInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleQuickLoadSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Quick Load
                        </Button>

                        <h2>Proxy Links</h2>
                        <input
                            ref={proxyLinksInputRef}
                            defaultValue={proxyLinks.join(",")}
                            onChange={handleProxyLinksInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleProxyLinksSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Proxy Links
                        </Button>

                        <h2>Active Proxy</h2>
                        <input
                            ref={activeProxyInputRef}
                            defaultValue={activeProxy}
                            onChange={handleActiveProxyInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleActiveProxySave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Active Proxy
                        </Button>

                        <h2>Bookmarks</h2>
                        <input
                            ref={bookmarksInputRef}
                            defaultValue={bookmarks.join(",")}
                            onChange={handleBookmarksInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleBookmarksSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Bookmarks
                        </Button>

                        <h2>Installed Apps</h2>
                        <input
                            ref={installedAppsInputRef}
                            defaultValue={installedApps.join(",")}
                            onChange={handleInstalledAppsInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleInstalledAppsSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Installed Apps
                        </Button>

                        <h2>Pinned Apps</h2>
                        <input
                            ref={pinnedAppsInputRef}
                            defaultValue={pinnedApps.join(",")}
                            onChange={handlePinnedAppsInputChange}
                            className="input-main"
                        />
                        <Button onClick={handlePinnedAppsSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Pinned Apps
                        </Button>

                        <h2>Shortcutted Apps</h2>
                        <input
                            ref={shortcuttedAppsInputRef}
                            defaultValue={shortcuttedApps.join(",")}
                            onChange={handleShortcuttedAppsInputChange}
                            className="input-main"
                        />
                        <Button onClick={handleShortcuttedAppsSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Shortcutted Apps
                        </Button>

                        <h2>Advanced Settings</h2>
                        <label>
                            <div className="inline-flex items-center">
                                <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="terminal">
                                    <input
                                        ref={advancedSettingsInputRef}
                                        type="checkbox"
                                        checked={advancedSettings.terminal}
                                        onChange={handleAdvancedSettingsInputChange}
                                        name="terminal"
                                        id="terminal"
                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                                    />
                                    <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                </label>
                                <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="terminal"> Terminal </label>
                            </div>
                        </label>
                        <label>
                            <div className="inline-flex items-center">
                                <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="quickLoad">
                                    <input
                                        ref={advancedSettingsInputRef}
                                        type="checkbox"
                                        checked={advancedSettings.quickLoad}
                                        onChange={handleAdvancedSettingsInputChange}
                                        name="quickLoad"
                                        id="quickLoad"
                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                                    />
                                    <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                </label>
                                <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="quickLoad"> Quick Load </label>
                            </div>
                        </label>
                        <label>
                            <div className="inline-flex items-center">
                                <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="fileSystem">
                                    <input
                                        ref={advancedSettingsInputRef}
                                        type="checkbox"
                                        checked={advancedSettings.fileSystem}
                                        onChange={handleAdvancedSettingsInputChange}
                                        name="fileSystem"
                                        id="fileSystem"
                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                                    />
                                    <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                </label>
                                <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="fileSystem"> File System </label>
                            </div>
                        </label>
                        <label>
                            <div className="inline-flex items-center">
                                <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="questionPrompts">
                                    <input
                                        ref={advancedSettingsInputRef}
                                        type="checkbox"
                                        checked={advancedSettings.questionPrompts}
                                        onChange={handleAdvancedSettingsInputChange}
                                        name="questionPrompts"
                                        id="questionPrompts"
                                        className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"
                                    />
                                    <span className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor" stroke="currentColor" strokeWidth="1">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                                        </svg>
                                    </span>
                                </label>
                                <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="questionPrompts"> Question Prompts </label>
                            </div>
                        </label>
                        <Button onClick={handleAdvancedSettingsSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Advanced Settings
                        </Button>
                    </ul>
                    <div className="py-2">
                        <textarea ref={userRef} defaultValue={JSON.stringify(selectedUser, null, 2)} style={{ whiteSpace: "pre-wrap", height: "175px" }} className="w-full my-2" />
                        <Button onClick={handleInputSave}>
                            <FontAwesomeIcon className="pr-2" icon={faSave} />
                            Save Input Changes
                        </Button>
                    </div>
                </div>
            }
        </div>
    );
};

export default Users;