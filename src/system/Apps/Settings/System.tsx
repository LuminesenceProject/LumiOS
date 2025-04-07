import { useEffect, useState } from "react";
import logo from "../../../assets/logo.jpeg";
import Button from "../../../structures/Button";
import virtualFS from "../../../utils/VirtualFS";

interface versionInterface {
    name: string;
    image: string;
    version: string;
    secure: boolean;
}

const System = () => {
    const [version, setVersion] = useState<versionInterface>({
        name: "Lumi OS",
        image: logo || "https://avatars.githubusercontent.com/u/101959214?v=4",
        version: "7",
        secure: true,
    });

    const [indexedDBUsage, setIndexedDBUsage] = useState<number | null>(null);

    useEffect(() => {        
        const fetchLink = async () => {
            try {
                const response = await fetch("https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Info.json");

                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                const data = await response.json();

                // Assuming data[0] contains the relevant version information
                const fetchedVersion: versionInterface = {
                    name: "Lumi OS",
                    image: logo || "https://avatars.githubusercontent.com/u/101959214?v=4",
                    version: data[0].version,
                    secure: data[0].version === version.version,
                };

                const storedVersion = await virtualFS.readfile("System/", "Version");
                const storedContent: versionInterface = await JSON.parse(storedVersion.content);
                storedContent.secure = data[0].version === storedContent.version;

                setVersion(storedContent);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchLink();

        // Query IndexedDB storage usage for "fileSystem" store in "VirtualFileSystemDB"
        const getIndexedDBUsage = async () => {
            try {
                const db = await window.indexedDB.open("VirtualFileSystemDB");
                if (!db) {
                    console.error("VirtualFileSystemDB not found!");
                    return;
                }

                db.onsuccess = () => {
                    const transaction = db.result.transaction(["fileSystem"], "readonly");
                    const objectStore = transaction.objectStore("fileSystem");
                    let totalBytes = 0;

                    objectStore.openCursor().onsuccess = (event: any) => {
                        const cursor = event.target.result;
                        if (cursor) {
                            totalBytes += JSON.stringify(cursor.value).length;
                            cursor.continue();
                        } else {
                            setIndexedDBUsage(totalBytes);
                        }
                    };

                    transaction.oncomplete = () => {
                        const ndb = db.result;
                        ndb.close();
                    };
                };

                db.onerror = (event) => {
                    console.error("Error opening database:", event.target.error);
                    setIndexedDBUsage(null);
                };
            } catch (error) {
                console.error("Error getting IndexedDB usage:", error);
                setIndexedDBUsage(null);
            }
        };

        getIndexedDBUsage();
    }, [version.version]);

    const browserName = () => {
        const userAgent = navigator.userAgent;
        if (userAgent.indexOf("Firefox") !== -1) return "Firefox";
        if (userAgent.indexOf("Chrome") !== -1) return "Chrome";
        if (userAgent.indexOf("Safari") !== -1) return "Safari";
        if (userAgent.indexOf("MSIE") !== -1) return "Internet Explorer";
        return "Unknown";
    };

    const osInfo = () => {
        const userAgent = navigator.userAgent;
        let osType = "Unknown";
        let osVersion = "Unknown";
    
        if (userAgent.indexOf("Mac") !== -1) {
            osType = "Mac OS";
            const match = /Mac OS X (\d+[._]\d+[._]\d+)/.exec(userAgent);
            if (match) {
                osVersion = match[1].replace(/_/g, ".");
            }
        } else if (userAgent.indexOf("Windows") !== -1) {
            osType = "Windows";
            const match = /Windows NT (\d+[._]\d+)/.exec(userAgent);
            if (match) {
                osVersion = match[1].replace(/_/g, ".");
            }
        } else if (userAgent.indexOf("Linux") !== -1) {
            osType = "Linux";
            const match = /Linux/.exec(userAgent);
            if (match) {
                osVersion = "Unknown"; // It's difficult to determine the version of Linux from user agent
            }
        }
    
        return {
            type: osType,
            version: osVersion
        };
    };    

    const updateFileSystem = async () => {
        window.alert("Select the current file. Doing any other file will break it.");

        try {
            // Request file access (assuming user has selected the file previously)
            // You should get the file handle from a file picker or a file input in a real-world application.
            const [fileHandle] = await window.showOpenFilePicker({
                types: [{
                    description: 'HTML files',
                    accept: { 'text/html': ['.html'] }
                }]
            });
    
            // Fetch the new content from the server
            const response = await fetch(`https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/LumiOS.v${version.version}.html`);
            if (!response.ok) throw new Error('Network response was not ok');
            const newContent = await response.text();
    
            // Create a writable stream to the file
            const writable = await fileHandle.createWritable();
    
            // Write the new content to the file
            await writable.write(newContent);
    
            // Close the file and save changes
            await writable.close();
    
            console.log('File updated successfully!');
        } catch (error) {
            console.error('Error updating file:', error);
            window.alert("Failed to update file.");
        }
    };    

    return (
        <div className="flex flex-col gap-2 p-5">
            <h2 className="font-bold text-xl">System</h2>
            <div className="p-2 border rounded shadow">
                <div className="flex flex-row justify-between items-center">
                    <h4 className="font-bold text-md">LumiOS v{version.version}</h4>
                    <img src={version.image} alt="logo" className="w-10 h-10" />
                </div>
                <div className="flex flex-row justify-between items-center my-2">
                    Update (beta)
                    <Button className="!bg-secondary" onClick={updateFileSystem}>Update</Button>
                </div>
            </div>
            <h2 className="font-bold text-xl">Your Device</h2>
            <div className="p-2 border rounded shadow">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between items-center">
                        <strong>Operating System:</strong> <div className="flex flex-row gap-1">{Object.values(osInfo()).map((value, index) => <span key={index}>{value}</span>)}</div>
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <strong>Web Browser:</strong> {browserName()}
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <strong>Device Type:</strong> {navigator.platform}
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <strong>Web Protocol:</strong> {window.location.protocol}
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <strong>Web Host:</strong> {window.location.host}
                    </div>
                </div>
            </div>
            <h2 className="font-bold text-xl">LumiOS Information</h2>
            <div className="p-2 border rounded shadow">
                <div className="flex flex-col gap-4">
                    <div className="flex flex-row justify-between items-center">
                        <strong>Storage Used:</strong> {indexedDBUsage !== null ? `${indexedDBUsage} bytes` : "Loading..."}
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <strong>Current Version:</strong> {version.version}
                    </div>
                    <div className="flex flex-row justify-between items-center">
                        <strong>Supported Version:</strong> {version.secure ? "Yes" : "No"}
                    </div>
                </div>
            </div>
            <div className="p-2 border rounded shadow flex flex-row justify-between items-center">
                Reset <Button onClick={() => {
                    if (window.confirm("Reset all of lumi OS? This wipes ALL files.")) {
                        indexedDB.deleteDatabase("VirtualFileSystemDB");
                        localStorage.setItem("firstlogin", "true");
                        window.location.reload();
                    }
                }}>Confirm</Button>
            </div>
        </div>
    );
};

export default System;