import { saveStamp } from "../../structures/Timestamp";
import virtualFS from "../../utils/VirtualFS";
import defaultFS from "../../utils/defaultFS";
import { Game } from "../../utils/types";


export const getAiResponse = async (message: string, commands: any): Promise<string> => {
    // Split by each space
    let updatedMessage = message.split(" ").map(word => word.replace(/[^\w\s]/gi, '').trim().toLowerCase());
    const apps = await virtualFS.readdir("Apps/");
    const appNames = Object.keys(apps);

    // Get curse words
    const curseWordsResponse = await fetch("https://raw.githubusercontent.com/dsojevic/profanity-list/main/en.json");
    const curseWords = await curseWordsResponse.json();
    const containsCurseWords = curseWords.some((curseWord: string) => {
        // @ts-ignore
        const matches = curseWord.match.split("|");
        return matches.some((match: string) => message.replace(/[^\w\s]/gi, '').trim().toLowerCase().includes(match));
    });    

    function randomMinMax(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    saveStamp({
        app: "Assistant",
        content: message,
        openedApps: [],
    });

    const bugKeywords = ["bug", "bugs", "issues", "issue", "problems", "problem", "failed", "buggy", "failure", "failed"];

    if (["help", "please", "oma"].some(keyword => message.replace(/[^\w\s]/gi, '').trim().toLowerCase().includes(keyword))) {
        const helpResponses = [
            "I can attempt to respond to your messages with text and functions!",
            "You can ask me about various topics or request specific information.",
            "I'm here to chat and answer your questions to the best of my ability.",
            "If you're stuck with something, let me know, and I'll try to help.",
        ];

        return helpResponses[randomMinMax(0, helpResponses.length)];
    }
    if (["tell me about lumios", "how does lumios work", "lumios works"].some(keyword => message.replace(/[^\w\s]/gi, '').trim().toLowerCase().includes(keyword))) {
        const howItWorks = [
            "LumiOS is a webOS framework that is built using react.",
            "LumiOS works by downloading the games to your computer.",
            "Lumi OS can be run from a file, as well as run from a server.",
            "No proxy is built into LumiOS, its completely static.",
            "LumiOS is a tool in order to provide the user with an experience.",
            "Idk im not gonna tell u.",
        ];
        
        return howItWorks[randomMinMax(0, howItWorks.length)];
    }
    if (["popular", "coolest", "best", "most fun", "top"].some(keyword => updatedMessage.includes(keyword)) && !bugKeywords.some(keyword => updatedMessage.includes(keyword))) {
        if (["games", "game"].some(keyword => updatedMessage.includes(keyword))) {
            // Find name if it exists
            const keywordIndex = updatedMessage.findIndex(word => ["called", "named", "name"].includes(word));
            let name: string;
    
            if (keywordIndex !== -1 && keywordIndex > 0) {
                name = updatedMessage[keywordIndex+1];
            } else name = "Valorant";

            // Otherwise find the name from the text the user has inputed
            const link = "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Data.json";
            const fetched = await fetch(link);
            const json = await fetched.json();
    
            const game: Game = json.find((game: Game) => updatedMessage.includes(game.name.toLowerCase()));
            if (game) name = game.name;    
            
            // It does not matter if a game is popular.
            const gameResponses = [];

            if (game) {
                gameResponses.push(`You are correct! ${name} is one of the top games!`);
                gameResponses.push(`Great job! ${name} is the #1 game on LumiOS.`);
                gameResponses.push(`Impressive! ${name} is definitely a top pick.`);
                gameResponses.push(`Well done! ${name} is a fantastic choice.`);
            } else {
                gameResponses.push(`As of now, ${name} is the most popular game throughout LumiOS`);
                gameResponses.push(`${name} is one of the top games for LumiOS.`);
                gameResponses.push(`Did you know? ${name} is highly rated among players.`);
                gameResponses.push(`An interesting thought! ${name} is gaining popularity.`);
            }

            // @ts-ignore
            return gameResponses[randomMinMax(0, gameResponses.length)];
        };

        if (["apps", "app"].some(keyword => updatedMessage.includes(keyword))) {
            // Find name if it exists
            const keywordIndex = updatedMessage.findIndex(word => ["called", "named", "name"].includes(word));
            let name: string;
    
            if (keywordIndex !== -1 && keywordIndex > 0) {
                name = updatedMessage[keywordIndex+1];
            } else name = "Settings";

            if (updatedMessage.some(word => appNames.map(name => name.toLowerCase()).includes(word))) {
                name = updatedMessage.find(word => appNames.map(name => name.toLowerCase()).includes(word)) || "Settings";
            }

            // It does not matter if a app is popular.
            const appReponses = [
                `Yes, you are correct! One of the most popular apps is ${name}.`,
                `${name} is the most popular app throughout LumiOS`,
                `${name} is one of the top apps.`,
            ];

            return appReponses[randomMinMax(0, appReponses.length)];
        }
        
        const coolResponses = [
            "",
        ];

        return coolResponses[randomMinMax(0, coolResponses.length)];
    }
    if (["how do you install", "how to install", "how to add", "how to get", "can you add", "how do you add"].some(keyword => message.replace(/[^\w\s]/gi, '').toLowerCase().includes(keyword))) {
        const howtoResponses = [
            "You can install apps by going into the appstore and clicking on an app.",
            "Games can be added by clicking the install button after getting a game.",
            "Go to the appstore in order to install games.",
        ];

        return howtoResponses[randomMinMax(0, howtoResponses.length)];
    }
    if (["can you install", "install", "download"].some(keyword => message.replace(/[^\w\s]/gi, '').toLowerCase().includes(keyword)) && !bugKeywords.some(keyword => message.replace(/[^\w\s]/gi, '').toLowerCase().includes(keyword))) {
        const keywordIndex = updatedMessage.findIndex(word => ["called", "named", "name"].includes(word));
        let name: string = "";

        const link = "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Data.json";
        const fetched = await fetch(link);
        const json = await fetched.json();

        if (keywordIndex !== -1 && keywordIndex > 0) {
            name = updatedMessage[keywordIndex+1];
        } else {


            const game: Game = json.find((game: Game) => updatedMessage.includes(game.name.toLowerCase()));
            if (game) name = game.name;

            if (!game) return "Could not find the name of the game you wanted."
        };

        const game: Game = json.find((game: Game) => game.name.toLowerCase() === name.toLowerCase());        

        if (!game) return `The app ${name} could not be found.`;

        const fetchedContent = await fetch(game.path);
        let fileContent: string;
    
        if (game.path.endsWith("swf")) {
            fileContent = game.path;            
        } else {
            fileContent = await fetchedContent.text();
        }
    
        const content = {
            name: game.name,
            description: "blah blah blah",
            userInstalled: true,
            svg: game.image,
            fileContent: fileContent,
        }
        
        try {
            await virtualFS.writeFile("Apps/", game.name, JSON.stringify(content), game.type);
            return `${game.name} was successfully downloaded.`;
        } catch (error) {
            return `Could not download ${name}, due to ${error}`;
        }
    }
    if (["hello", "hi", "welcome", "hey", "hiya", "yo", "wassup", "whatsgoing"].some(keyword => updatedMessage.includes(keyword))) {
        const greetings = [
            "Hey there!",
            "Hello!",
            "Hi!",
            "What's up?",
            "Howdy!",
            "Hey!",
            "How's it going?",
            "Hiya!",
            "Greetings!",
            "Morning!",
            "Good morning!",
            "Good afternoon!",
            "Good evening!",
            "Good day!",
            "Good night!",
            "Good day to you!",
            "Good day to you too!",
        ];

        return greetings[randomMinMax(0, greetings.length)];
    }
    if (["bye", "goodbye", "cyah", "go", "shoo"].some(keyword => updatedMessage.includes(keyword))) {
        const goodByes = [
            "Goodbye!",
            "See you later!",
            "Bye!",
            "See you soon!",
            "See ya!",
            "Goodbye!",
            "See you later!",
            "Bye!",
            "See you soon!",
            "See ya!",
            "Goodbye! Have a great day!",
        ];

        return goodByes[randomMinMax(0, goodByes.length)];
    }
    if (updatedMessage.includes("new") && updatedMessage.includes("update")) {
        const updateResponses = [
            "The latest version includes the following changes: \n1. Updated context menu \n2. More games \n3. Extra plugins!",
            "LumiOS has been updated! New features: \n1. Improved user interface \n2. Enhanced performance \n3. New game additions!",
            "Check out what's new in LumiOS: \n1. Bug fixes and stability improvements \n2. New plugins for customization \n3. More games added!",
            "We've got exciting updates for you: \n1. Revamped settings menu \n2. Faster boot time \n3. New games and applications!",
            "Update highlights: \n1. Enhanced security features \n2. Additional plugins \n3. More interactive games!",
            "LumiOS now comes with: \n1. Optimized performance \n2. New context menu options \n3. Extra plugins and games!",
            "The latest LumiOS update brings: \n1. Sleeker design \n2. More games \n3. Additional plugins for better functionality!",
            "What's new in LumiOS: \n1. Updated graphics \n2. Increased app support \n3. More games and plugin options!",
            "New in this version: \n1. Improved navigation \n2. Extra games \n3. More plugins available!",
            "Check out the newest features: \n1. Advanced settings \n2. New games \n3. Additional plugins!",
            "The new LumiOS update includes: \n1. Better performance \n2. New games \n3. Extra plugins and enhancements!"
        ];
        
        return updateResponses[randomMinMax(0, updateResponses.length)];        
    } 
    if (["version", "update"].some(keyword => updatedMessage.includes(keyword))) {
        const version = await virtualFS.readfile("System/", "Version");
        const versionContent = JSON.parse(version.content).version;
        const response = await fetch("https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Info.json");
    
        if (!response.ok) {
            return `HTTP error. Status: ${response.status}`;
        }
    
        const data = await response.json();
        let secure = true;
        
        if (versionContent !== Number(data[0].version)) {
            secure = false;            
        }
    
        const updateResponses = [
            `It seems that LumiOS is ${secure ? "up to date. No updates are required." : "not on the latest version."}`,
            `LumiOS is currently on version ${versionContent}, which is ${secure ? "the latest update." : "not the current version."}`,
            `Your current LumiOS version is ${versionContent}. ${secure ? "Everything is up to date." : "An update is available."}`,
            `${secure ? "No updates are necessary at this time." : "An update is required to stay current."} Your current version is ${versionContent}.`,
            `Checking for updates... ${secure ? "You are on the latest version." : "A newer version is available."}`,
            `LumiOS version ${versionContent} is ${secure ? "current." : "outdated. Please update to the latest version."}`
        ];
    
        return `${updateResponses[randomMinMax(0, updateResponses.length)]} ${!secure ? "Visit https://github.com/LuminesenceProject/LumiOS to download the current version. or type 'autoupdate'" : ""}`;
    }    
    if (["autoupdate", "create update", "auto", "auto update", "auto-update", "latest"].some(keyword => updatedMessage.includes(keyword))) {
        const version = await virtualFS.readfile("System/", "Version");
        const versionContent = JSON.parse(version.content).version;
        const response = await fetch("https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Info.json");
    
        if (!response.ok) {
            return `HTTP error. Status: ${response.status}`;
        }
    
        const data = await response.json();
    
        if (versionContent == Number(data[0].version)) return "No update is available at this time.";
    
        const fetchedVersion = Number(data[0].version);
        const fileUrl = `https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/LumiOS.v${fetchedVersion}.html`;
    
        // Fetch the update file
        const fileResponse = await fetch(fileUrl);
        if (!fileResponse.ok) {
            return `Failed to download the update. Status: ${fileResponse.status}`;
        }
    
        const blob = await fileResponse.blob();
        const blobUrl = URL.createObjectURL(blob);
    
        // Create a link and trigger a download
        const anchor = document.createElement('a');
        anchor.href = blobUrl;
        anchor.download = `LumiOS.v${fetchedVersion}.html`;
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    
        // Revoke the blob URL after the download
        URL.revokeObjectURL(blobUrl);
    
        return `Downloading LumiOS version ${fetchedVersion}...`;
    }
    if (["autologin", "login"].some(keyword => message.replace(/[^\w\s]/gi, '').toLowerCase().includes(keyword))) {
        const autologin = await virtualFS.readfile("System/", "Autologin");
        let isLoggedIn: boolean = JSON.parse(autologin.content);

        if (["off", "on", "enable", "disable"].some(keyword => message.replace(/[^\w\s]/gi, '').toLowerCase().includes(keyword))) {
            if (["on", "enable"].some(keyword => message.replace(/[^\w\s]/gi, '').toLowerCase().includes(keyword))) {
                isLoggedIn = true;
            } else {
                isLoggedIn = false;
            }
        } else isLoggedIn = !isLoggedIn;

        await virtualFS.deleteFile("System/", "Autologin");
        await virtualFS.writeFile("System/", "Autologin", JSON.stringify(isLoggedIn), "sys");
        
        const loginResponses = [
            `Autologin is now ${isLoggedIn ? "enabled" : "disabled"}`,
            `You have ${isLoggedIn ? "enabled" : "disabled"} autologin.`,
            `Autologin has been ${isLoggedIn ? "turned on" : "turned off"}.`,
            `${isLoggedIn ? "Enjoy the convenience of autologin!" : "Autologin is now off, you'll need to log in manually."}`
        ];        

        return loginResponses[randomMinMax(0, loginResponses.length)];
    }
    if (["improve speeds", "speed", "improve", "faster", "optomize"].some(keyword => message.replace(/[^\w\s]/gi, '').toLowerCase().includes(keyword))) {
        if (!window.confirm("This will result in some files being deleted. Continue?")) return "Speed will not be improved.";

        const defaultAppLength = Object.keys(defaultFS.root.children.Apps.children).length;
        const newAppLength = appNames.length;

        if (defaultAppLength == newAppLength) return "Apps are already optomised.";

        virtualFS.root.children.Apps.children = defaultFS.root.children.Apps.children;

        virtualFS.save();

        const speedupResponses = [
            "Some apps have been deleted.",
            "Removed apps and games.",
            "Deleted extra apps."
        ];

        return speedupResponses[randomMinMax(0, speedupResponses.length)] + "Reload page to propogate changes.";
    }
    if (["kys", "lumiOS sucks", "ur bad", "delete yourself", "or else", "stfu", "skibidi", "sigma", "alpha"].some(keyword => message.replace(/[^\w\s]/gi, '').includes(keyword)) || containsCurseWords) {
        const meanResponses = [
            "I'm here to help! Let's keep the conversation positive.",
            "Sorry to hear that. How can I assist you better?",
            "I'm just a program, but I'm here to help if you need it.",
            "Let's focus on finding a solution together.",
            "Your feedback is noted. How can I improve?",
            "I'm here to assist you. Let's work through this together.",
            "I'm here to help you with LumiOS. What's the issue?",
            "Let's keep things friendly and constructive. How can I assist you?",
            "I understand you're frustrated. How can I make things better?",
            `Saying something like, "${message}"     really hurts my feelings.`
        ];
    
        return meanResponses[randomMinMax(0, meanResponses.length)];
    }
    if (["how do you work", "what do you do"].some(keyword => message.replace(/[^\w\s]/gi, '').trim().toLowerCase().includes(keyword))) {
        const howsIwork = [
            "Im the assistant for LumiOS, and I try my best!",
            "By looking at certain messages I can respond to them!",
            "Some messages are keywords I look at!",
        ];

        return howsIwork[randomMinMax(0, howsIwork.length)];
    }
    if (["write", "file", "write a file", "create a file"].some(keyword => updatedMessage.includes(keyword))) {
        if (!updatedMessage.map(value => !value.includes("/"))) return "I need a variable path to write a file!";

        const keywordIndex = updatedMessage.findIndex(word => ["called", "named"].includes(word));
        let name: string;

        if (keywordIndex !== -1 && keywordIndex > 0) {
            name = updatedMessage[keywordIndex+1];
        } else return "Could not find the name of the file you wanted.";
        
        // @ts-ignore
        const path: string = message.split(" ").find(value => value.includes("/"));

        try {
            await virtualFS.writeFile(path, name, "", "txt");
        } catch (error) {
            return `File could not be written: ${error}`;
        }

        return `Wrote a file called ${name} at ${path}.`
    }
    if (["folder", "write a folder", "create a folder"].some(keyword => updatedMessage.includes(keyword))) {
        if (!updatedMessage.map(value => !value.includes("/"))) return "I need a variable path to write a folder!";

        const keywordIndex = updatedMessage.findIndex(word => ["called", "named"].includes(word));
        let name: string;

        if (keywordIndex !== -1 && keywordIndex > 0) {
            name = updatedMessage[keywordIndex+1];
        } else return "Could not find the name of the folder you wanted.";
        
        // @ts-ignore
        const path: string = message.split(" ").find(value => value.includes("/"));

        try {
            await virtualFS.writeFolder(path, name);
        } catch (error) {
            return `Folder could not be written: ${error}`;
        }

        return `Wrote a folder called ${name} at ${path}.`
    }
    if (["suggest", "advice", "what do i do", "counsel", "guidence"].some(keyword => updatedMessage.includes(keyword))) {
        const adviceResponses = [
            "Go to the appstore to install some apps!",
            "The filesystem can help manage files - but its easy to delete something important.",
            "When using the Browser remember to use a proxy, there is not one built in!",
            "Settings often has the best solutions to customizing LumiOS",
            "Always remember to install the latest update, it has critical features.",
            "LumiOS will notify you when the update is released.",
        ];

        return adviceResponses[randomMinMax(0, adviceResponses.length)];
    }
    if (bugKeywords.some(keyword => updatedMessage.includes(keyword))) {
        const bugResponses = [
            "It seems there is an issue with {bug}. Let me look into it.",
            "I noticed a problem with {bug}. I'll get that fixed.",
            "There is a known bug related to {bug}. We're working on it.",
            "The {bug} seems to have failed. I'll investigate further."
        ];
        
        let bug: any = null;

        for (const keyword of bugKeywords) {
            const keywordIndex = message.indexOf(keyword);
            if (keywordIndex !== -1) {
                const beforeKeyword = message.slice(0, keywordIndex).trim();
                const afterKeyword = message.slice(keywordIndex + keyword.length).trim();
        
                // Determine which part has the greater amount of characters
                bug = beforeKeyword.length > afterKeyword.length ? beforeKeyword : afterKeyword;
                break;
            }
        }

        // Replace some words that would not make any sense
        const wordsToReplace = ["when", "then", "you", "are", "the", "with"];
        
        bug && wordsToReplace.forEach(word => {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            bug = bug.replace(regex, '').trim();
        });
        
        bug = bug.replace(/[^\w\s]/gi, '')
        
        if (bug) {
            const responseTemplate = bugResponses[randomMinMax(0, bugResponses.length)];
            const response = responseTemplate.replace("{bug}", bug);
            return response + " Visit https://github.com/LuminesenceProject/LumiOS/issues and open an issue."; // Output the response
        } else {
            return "No bug identified in the message.";
        }
    }
    if (["open", "start", "begin", "launch"].some(keyword => updatedMessage.includes(keyword))) {
        const apps = await virtualFS.readdir("Apps/");
        
        // Convert app names to lowercase
        const allApps: string[] = Object.keys(apps);
    
        const matching = allApps.filter(value => updatedMessage.includes(value.toLowerCase()));
        
        if (matching.length > 0) {
            matching.forEach((name) => {
                commands((prev: string[]) => [...prev, name]);
            });

            return `Launching ${matching}!`;
        } else {
            return `App could not be found!`;
        }
    }
    if (["close", "stop", "end", "kill", "remove"].some(keyword => updatedMessage.includes(keyword))) {
        if (updatedMessage.includes("all")) {
            commands([]);
            return "Closed all apps!";
        }

        const apps = await virtualFS.readdir("Apps/");
        
        // Convert app names to lowercase
        const allApps: string[] = Object.keys(apps);
    
        const matching = allApps.filter(value => updatedMessage.includes(value.toLowerCase()));
        
        if (matching.length > 0) {
            matching.forEach((name) => {
                commands((prev: string[]) => prev.filter(value => value !== name));
            });

            return `Closing ${matching}!`;
        } else {
            return `App could not be found!`;
        }
    }
    // This is last as to avoid overlap with opening/closing apps
    if (appNames.some(name => updatedMessage.includes(name.toLowerCase())) || ["describe", "what is", "description"].some(keyword => updatedMessage.includes(keyword))) {                
        const matchingNames = appNames.filter(name => updatedMessage.includes(name.toLowerCase()));
        const descriptions = [];
            
        for (const name of matchingNames) {
            const app = apps[name];
            
            if (app) {
                // @ts-ignore
                const description = JSON.parse(app.content).description;
                descriptions.push(description);                
            }
        }
    
        return descriptions.join(", ");
    }    
    if (["restart", "shut", "shutdown", "redo", "exit", "reboot"].some(keyword => updatedMessage.includes(keyword))) window.location.reload();
    // Default response if no specific case matches
    return "I'm sorry, I didn't understand your message.";
}