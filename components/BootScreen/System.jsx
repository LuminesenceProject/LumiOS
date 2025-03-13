import React, { useEffect, useState } from "react";
import Button from "../../util/Button";
import { deleteFileOrFolder, getAllItemsInFolder } from "../Filesystem/indexedDB";

const System = () => {
    const [errors, setErrors] = useState([]);
    const [lumigames, setGames] = useState([]);
    const [errorSolution, setErrorSolution] = useState("");
    const [selectedError, setSelectedError] = useState(null);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false); // State for loading status
    const [loadingProgress, setLoadingProgress] = useState(0); // State for loading progress

    useEffect(() => {
        const storedErrors = JSON.parse(localStorage.getItem("errors")) || [];
        setErrors(storedErrors);

        const fetchGames = async () => {
            try {
                // Use the custom link if provided, otherwise use the default link
                const link = "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Data.json";
                const response = await fetch(link);
                const data = await response.json();
                setGames(data);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(error);
            }
        }

        fetchGames();
    }, []);

    const handleFix = () => {
        setIsLoading(true); // Start loading
        setLoadingProgress(0);
    
        for (let i = 0; i < 100; i++) {
            setTimeout(() => {
                setLoadingProgress((prevProgress) => prevProgress + 1);
            }, i * 20); // Increment every 20ms for a smoother animation
        }
    
        setTimeout(() => {
            fixError();
            setIsLoading(false); // End loading after fixing
        }, 2000);
    };    

    const fixError = () => {
        const currentError = errors[selectedError];

        const checkValues = (values) => {
            return values.some(val => currentError.error.includes(val));
        };

        switch (errorSolution) {
            case "html": {
                // Code to fix HTML error
                try {
                    const deleteFile = async () => {
                        const files = await getAllItemsInFolder("apps");
                        const file = files.find(file => currentError.errorInfo.includes(file.name) || currentError.error.includes(file.name));
    
                        try {
                            if (file) {
                                await deleteFileOrFolder(file.name);
                            } else {
                                await indexedDB.deleteDatabase("FileSystem");
                            }
                        } catch (error) {
                            setError(error.message || "An error occurred");
                        }
                    };
                    deleteFile();
                } catch (error) {
                    setError(error.message);
                }
                break;
            }
            case "app": {
                try {
                    const users = JSON.parse(localStorage.getItem("users")) || [];

                    if (!users.length) {
                        setError("No users detected.");
                        return;
                    }
    
                    let updated = false;
                    for (let i = 0; i < users.length; i++) {
                        const currentUser = users[i];
    
                        if (!currentUser) {
                            setError("No currentUser found. Please wait, using first user...");
                            continue;
                        }
    
                        let games = JSON.parse(localStorage.getItem(currentUser.name + "installedApps")) || [];
    
                        const oldLength = games.length;
                        games = Object.values(games).filter(game => !currentError?.error.includes(game.name) || !currentError?.errorInfo.includes(game.name));
                        games = games.filter(game => lumigames.some(lumigame => lumigame.name.includes(game.name)));
                        
                        const newLength = games.length;
                        
                        if (oldLength !== newLength) {
                            updated = true;
                            localStorage.setItem(currentUser.name + "installedApps", JSON.stringify(games));
                        } else {
                            localStorage.setItem(currentUser.name + "installedApps", JSON.stringify([]));
                        }
    
                    }
    
                    if (updated) {
                        // Perform any additional actions if games were updated
                    }
                } catch (error) {
                    console.log(error);
                    setError(error.message);
                }

                break;
            }
            case "user": {
                try {
                    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

                    if (currentUser) {
                        let { name, password, admin, firstLogin, autoLogin } = currentUser;
                    
                        if (typeof name !== "string") {
                            name = String(name); // Convert to string
                        }
                    
                        if (typeof password !== "string") {
                            password = String(password); // Convert to string
                        }
                    
                        if (typeof admin !== "boolean") {
                            admin = Boolean(admin); // Convert to boolean
                        }
                    
                        if (typeof firstLogin !== "boolean") {
                            firstLogin = Boolean(firstLogin); // Convert to boolean
                        }
                    
                        if (typeof autoLogin !== "boolean") {
                            autoLogin = Boolean(autoLogin); // Convert to boolean
                        }
                    
                        localStorage.setItem("currentUser", JSON.stringify({ name, password, admin, firstLogin, autoLogin }));
                    }
    
                    console.log(currentUser);
                    
                    const users = JSON.parse(localStorage.getItem("users")) || [];
                    
                    if (users) {
                        for (let i = 0; i < users.length; i++) {
                            let { name, password, admin, firstLogin, autoLogin } = users[i];
                    
                            if (typeof name !== "string") {
                                name = String(name); // Convert to string
                            }
                    
                            if (typeof password !== "string") {
                                password = String(password); // Convert to string
                            }
                    
                            if (typeof admin !== "boolean") {
                                admin = false; // Fallback to false if not boolean
                            }
                    
                            if (typeof firstLogin !== "boolean") {
                                firstLogin = false; // Fallback to false if not boolean
                            }
                    
                            if (typeof autoLogin !== "boolean") {
                                autoLogin = false; // Fallback to false if not boolean
                            }
                    
                            users[i] = { name, password, admin, firstLogin, autoLogin };
                        }
                    
                        console.log(users);
                        localStorage.setItem("users", JSON.stringify(users));
                    }    
                } catch (error) {
                    setError(error.message);
                }
                break;
            }
            case "automatic": {
                const options = ["html", "app", "user"];

                try {
                    const fixNextError = (index) => {
                        if (index >= options.length) {
                            return;
                        }
                
                        setErrorSolution(options[index]);
                
                        setTimeout(() => {
                            fixError();
                            fixNextError(index + 1);
                        }, 0);
                    };
                
                    fixNextError(0);
                } catch (error) {
                    setError(error.message);
                }

                // Put custom error fixes here.
                /*
                if ("special error type") {
                    fix it here
                }
                */

                break;
            }                      
            default: {
                // Default case
                break;
            }
        }
    };

    return (
        <div className="text-text-base p-2">
            {errors.length === 0 ? (
                <h3 className="font-bold text-lg">No Errors</h3>
            ) : (
                <div className="flex flex-col gap-2">
                    {error && <p style={{ color: "red" }}>{error}</p>}
                    <h3 className="font-bold text-lg">Current errors:</h3>
                    <div className="grid gap-2 grid-cols-3">
                        {errors.map((error, index) => (
                            <Button
                                key={index}
                                onClick={() => setSelectedError(index)}
                                className={`${error.name === errors[selectedError]?.name && "!bg-secondary"}`}
                            >
                                <div className="flex flex-col gap-2 h-32">
                                    {error.error && error.error.toString()}
                                    {error.errorInfo && error.errorInfo.toString()}
                                </div>
                            </Button>
                        ))}
                    </div>
                    <h3 className="font-bold text-lg">Fix errors:</h3>
                    <p>Attempt to automatically fix errors. This may not provide a solution. Select the error and click "Attempt Fix".</p>
                    <div className="relative my-1">
                        <select
                            onChange={(e) => setErrorSolution(e.target.value)}
                            className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-0 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 empty:!bg-gray-900 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                        >
                            <option value="html">HTML file issue</option>
                            <option value="app">Game/App</option>
                            <option value="user">User</option>
                            <option value="automatic">Automatic</option>
                        </select>
                        <label
                            style={{ color: "black" }}
                            className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500"
                        >
                            Select error solution
                        </label>
                    </div>
                    <Button onClick={handleFix}>Attempt Fix</Button>
                    {isLoading && (
                        <div className="mt-4 w-full h-2 rounded-md bg-primary-light">
                            <div
                                className="bg-secondary-light w-full h-2 rounded-md p-2"
                                style={{ width: `${loadingProgress}%` }}
                                
                            ></div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default System;
