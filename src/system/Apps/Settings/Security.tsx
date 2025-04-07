import { useEffect, useState } from "react";
import Button from "../../../structures/Button";
import virtualFS from "../../../utils/VirtualFS";
import defaultFS from "../../../utils/defaultFS";
import { User } from "../../../utils/types";
import image1 from "../../../assets/image1.jpeg";
import { useTopbar } from "../../Topbar/useTopbar";
import { faCheckCircle, faFileExport, faShield, faUser } from "@fortawesome/free-solid-svg-icons";

const Security = ({ setShowBootScreen }) => {
    const [error, setError] = useState<number>(0);
    const [errorInfo, setErrorInfo] = useState<string>("");
    const [autologin, setAutologin] = useState<boolean>(true);
    const { addMenu, removeMenu } = useTopbar();

    useEffect(() => {
        addMenu({
            title: "Security",
            icon: faShield,
            dropdown: [
                { label: "Check", onClick: check, icon: faCheckCircle },
                { label: "Fix", onClick: handleFix },
                { label: "Export", onClick: handleExport, icon: faFileExport },
                { label: "Autologin", onClick: handleAutologin, icon: faUser }
            ],
        });
        
        return () => removeMenu("Security");
    }, []);

    const check = async () => {
        let fetchedApps, fetchedUsers, fetchedThemes, userApps, missingUserProps;
    
        try {
            fetchedApps = await virtualFS.readdir("Apps/");
            
            // Check for user installed apps
            const findUser = Object.keys(fetchedApps).some(app => {
                const parsed = JSON.parse(fetchedApps[app].content);
                
                return parsed.userInstalled;
            });

            userApps = findUser;
        } catch (error) {
            fetchedApps = null;
        }
    
        try {
            fetchedUsers = await virtualFS.readdir("System/Users/");
        } catch (error) {
            fetchedUsers = null;
        }
    
        try {
            fetchedThemes = await virtualFS.readdir("System/Themes");
        } catch (error) {
            fetchedThemes = null;
        }

        try {
            const fetchedUsers = await virtualFS.readdir("System/Users/");
            
            const expectedProperties = [
                "name",
                "password",
                "admin",
                "pinnedApps",
                "shortcutApps",
                "theme",
                "backgroundImage",
            ];
        
            // Function to check if userProfile has expected properties and types
            const checkUserProfile = (userProfile: any) => {
                return expectedProperties.every(prop => {
                    switch (prop) {
                        case "name":
                        case "password":
                        case "backgroundImage":
                            return userProfile.hasOwnProperty(prop) && typeof userProfile[prop] === "string";
                        case "admin":
                            return userProfile.hasOwnProperty(prop) && (userProfile[prop] === "false" || typeof userProfile[prop] === "boolean");
                        case "pinnedApps":
                        case "shortcutApps":
                            return (
                                userProfile.hasOwnProperty(prop) &&
                                Array.isArray(userProfile[prop]) &&
                                userProfile[prop].every(item => typeof item === "number")
                            );
                        case "theme":
                            const themeProps = ["primary", "primaryLight", "secondary", "secondaryLight"];
                            return (
                                userProfile.hasOwnProperty(prop) &&
                                typeof userProfile[prop] === "object" &&
                                themeProps.every(themeProp => userProfile[prop].hasOwnProperty(themeProp) && typeof userProfile[prop][themeProp] === "string")
                            );
                        default:
                            return false;
                    }
                });
            };
        
            // Iterate through fetched users
            for (const username in fetchedUsers) {
                if (fetchedUsers.hasOwnProperty(username)) {
                    const userData = fetchedUsers[username];
                    if (userData.content) {
                        const userProfile = userData.content;
                        if (!checkUserProfile(userProfile)) {
                            missingUserProps = true;
                        }                        
                    }
                }
            }
        } catch (error) {
            console.error(error);
        }

        setError(0);
        setErrorInfo("");
    
        if (!fetchedApps || Object.keys(fetchedApps).length < Object.keys(defaultFS.root.children.Apps.children).length || userApps) {
            setError(1);
            setErrorInfo((prev: string) => prev + "Unknown installed apps/missing apps. \n");
        } 
        if (!fetchedUsers || Object.keys(fetchedUsers).length < 1) {
            setError(2);
            setErrorInfo((prev: string) => prev + "No users were found. \n");
        } 
        if (!fetchedThemes || Object.keys(fetchedThemes).length < 1) {
            setError(3);
            setErrorInfo((prev: string) => prev + "No themes were found. \n");
        } 
        if (missingUserProps) {
            setError(4);
            setErrorInfo((prev: string) => prev + "Some users are missing properties. \n");
        }

        if (error != 0) {
            setErrorInfo((prev: string) => prev + "Click 'fix' to fix the error.");
        }

        if (errorInfo === "") {
            setErrorInfo("No issues were found.\n");
        }
    };    

    const handleFix = async () => {
        switch (error) {
            case 0:
                break;
            case 1:
                // Fix for unknown installed apps/missing apps
                virtualFS.root.children.Apps.children = defaultFS.root.children.Apps.children;
                virtualFS.save();
                setErrorInfo("Apps written successfully.");
                break;
            case 2:
                // Fix for no users found
                const defaultUser: User = {
                    name: "Default",
                    password: "User",
                    admin: true,
                    pinnedApps: [0, 1],
                    shortcutApps: [0, 1],
                    theme: {
                        primary: "#212529",
                        primaryLight: "#464f58",
                        secondary: "#343A40",
                        secondaryLight: "#737f8c",
                        textBase: "white",
                    },
                    backgroundImage: image1,
                };
    
                const system = await virtualFS.readdir("System/");
                if (
                    system == null ||
                    system == undefined ||
                    !Object.keys(system).includes("children") ||
                    !Object.keys(system.children).includes("Users")
                ) {
                    await virtualFS.writeFolder("System/", "Users");
                }
    
                virtualFS.writeFile("System/Users/", defaultUser.name, defaultUser);
                virtualFS.save();
                setErrorInfo("Default user created. Password is 'User'.");
                break;
            case 3:
                // Fix for no themes found
                const theme = await virtualFS.readdir("System/");
                if (
                    theme == null ||
                    theme == undefined ||
                    !Object.keys(theme).includes("children") ||
                    !Object.keys(theme.children).includes("Users")
                ) {
                    await virtualFS.writeFolder("System/", "Themes");
                }
    
                virtualFS.root.children.System.children.Themes.children =
                    defaultFS.root.children.System.children.Themes.children;
                virtualFS.save();
                setErrorInfo("Themes added successfully.");
                break;
            case 4:
                // Fix for errors in user profiles
                const fetchedUsers = await virtualFS.readdir("System/Users/");

                const checkUserProfile = (userProfile: any) => {
                    const expectedProperties = [
                        "name",
                        "password",
                        "admin",
                        "pinnedApps",
                        "shortcutApps",
                        "theme",
                        "backgroundImage",
                    ];
                
                    return expectedProperties.every(prop => {
                        switch (prop) {
                            case "name":
                            case "password":
                            case "backgroundImage":
                                return userProfile.hasOwnProperty(prop) && typeof userProfile[prop] === "string";
                            case "admin":
                                return userProfile.hasOwnProperty(prop) && (userProfile[prop] === false || userProfile[prop] === true);
                            case "pinnedApps":
                            case "shortcutApps":
                                return (
                                    userProfile.hasOwnProperty(prop) &&
                                    Array.isArray(userProfile[prop]) &&
                                    userProfile[prop].every(item => typeof item === "number")
                                );
                            case "theme":
                                const themeProps = ["primary", "primaryLight", "secondary", "secondaryLight", "textBase"];
                                return (
                                    userProfile.hasOwnProperty(prop) &&
                                    typeof userProfile[prop] === "object" &&
                                    themeProps.every(themeProp => userProfile[prop].hasOwnProperty(themeProp) && typeof userProfile[prop][themeProp] === "string")
                                );
                            default:
                                return false;
                        }
                    });
                };
    
                // Iterate through fetched users
                for (const username in fetchedUsers) {
                    if (fetchedUsers.hasOwnProperty(username)) {
                        const userData = fetchedUsers[username];
                        if (userData.content) {
                            const userProfile = userData.content;
                            let changesMade = false;
    
                            // Check each property of userProfile and fix if needed
                            if (!checkUserProfile(userProfile)) {
                                console.log(`${username} has issues. Fixing...`);
    
                                // Fix missing or incorrect properties
                                if (!userProfile.hasOwnProperty("name") || typeof userProfile.name !== "string") {
                                    userProfile.name = "Default";
                                    changesMade = true;
                                }
                                if (!userProfile.hasOwnProperty("password") || typeof userProfile.password !== "string") {
                                    userProfile.password = "User";
                                    changesMade = true;
                                }
                                if (!userProfile.hasOwnProperty("admin") || typeof userProfile.admin !== "boolean") {
                                    userProfile.admin = true;
                                    changesMade = true;
                                }
                                if (!userProfile.hasOwnProperty("pinnedApps") || !Array.isArray(userProfile.pinnedApps)) {
                                    userProfile.pinnedApps = [0, 1];
                                    changesMade = true;
                                }
                                if (!userProfile.hasOwnProperty("shortcutApps") || !Array.isArray(userProfile.shortcutApps)) {
                                    userProfile.shortcutApps = [0, 1];
                                    changesMade = true;
                                }
                                if (!userProfile.hasOwnProperty("theme") || typeof userProfile.theme !== "object") {
                                    userProfile.theme = {
                                        primary: "#212529",
                                        primaryLight: "#464f58",
                                        secondary: "#343A40",
                                        secondaryLight: "#737f8c",
                                        textBase: "white",
                                    };
                                    changesMade = true;
                                }
                                if (!userProfile.hasOwnProperty("backgroundImage") || typeof userProfile.backgroundImage !== "string") {
                                    userProfile.backgroundImage = image1;
                                    changesMade = true;
                                }
    
                                // If changes were made, update the user profile
                                if (changesMade) {
                                    await virtualFS.deleteFile("System/Users/", username);
                                    await virtualFS.writeFile(`System/Users/`, username, userProfile);
                                    console.log(await virtualFS.readdir("System/Users/"));
                                    console.log("FSDDFSDFSDFSDSF");
                                    
                                }
                                console.log("FSDDFSDFSDFSDSF");

                            }
                        }
                    }
                }
    
                // Save changes
                await virtualFS.save();
                setErrorInfo("User profiles fixed successfully.");
                break;
            default:
                break;
        }
    };
    
    const handleExport = () => {
        const cipher = (salt: string) => {
            return salt
        }

        function randomizedSubstitutionEncrypt(data: string) {
            const salt = "50mI0s"; // You can set your custom salt here
            const encrypt = cipher(salt);
          
            return encrypt(data);
        }
        const stamps = localStorage.getItem("stamps");
  
        const encrypted = randomizedSubstitutionEncrypt(stamps as string);
      
        // Convert encrypted data to Blob
        const blob = new Blob([encrypted], { type: 'application/octet-stream' });
      
        // Create a temporary anchor element
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'encrypted_file.dat'; // Set the filename to .dat
        downloadLink.style.display = 'none';
      
        downloadLink.click();
    }

    const handleAutologin = async () => {
        console.log(autologin);
        
        await virtualFS.deleteFile("System/", "Autologin");
        await virtualFS.writeFile("System/", "Autologin", JSON.stringify(autologin), "sys");
    }

    return ( 
        <div className="p-4 flex flex-col gap-1">
            <h3 className="font-bold text-2xl">Security</h3>
            <div className="flex flex-row gap-2 my-2">
                <Button className="border" onClick={check}>Run security check.</Button>
                {error !== 0 && <Button className="border" onClick={handleFix}>Fix</Button>}
            </div>
            <p className="text-sm font-semibold">{ errorInfo }</p>
            <Button onClick={handleExport} className="border">Export Logs</Button>
            <h4 className="font-bold text-md pt-4">Autologin</h4>
            <div className="flex gap-2">
                <select onChange={(e) => setAutologin(e.target.value === "true")} className="bg-secondary cursor-pointer px-2 py-1 shadow-sm hover:bg-primary-light duration-100 ease-in-out transition-colors rounded text-text-base">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>
                <Button onClick={handleAutologin}>Change</Button>
            </div>
            <Button onClick={() => setShowBootScreen(true)}>BIOS</Button>
        </div>
    );
}
 
export default Security;