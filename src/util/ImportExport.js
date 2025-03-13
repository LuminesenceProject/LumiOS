import baseTheme from "./themes/baseTheme";
import image1 from "../Images/image1.jpeg";
import version from "./util";
import { pushNotification } from "../components/Notifications/Notifications";

const exportSettings = () => {
    try {
        const crntusr = JSON.parse(localStorage.getItem("currentUser"));

        const theme = JSON.parse(localStorage.getItem(crntusr.name + "theme")) || baseTheme;
        const background = JSON.parse(localStorage.getItem("background")) || image1;
        const taskbarPosition = localStorage.getItem(crntusr.name + "position") || "south";
        const desktopPositions = JSON.parse(localStorage.getItem(crntusr.name + 'desktopPositions')) || {};
        const iconSize = localStorage.getItem(crntusr.name + 'iconSize') || 32;
        const quickLoad = JSON.parse(localStorage.getItem(crntusr.name + "quickload")) || false;
        const proxyLinks = JSON.parse(localStorage.getItem(crntusr.name + "proxyLinks")) || [];
        const activeProxy = JSON.parse(localStorage.getItem(crntusr.name + "activeProxy")) || "";
        const bookmarks = JSON.parse(localStorage.getItem(crntusr.name + "bookmarks")) || [];
        const installedApps = JSON.parse(localStorage.getItem(crntusr.name + 'installedApps')) || [];
        const pinnedApps = JSON.parse(localStorage.getItem(crntusr.name + "-pinned-apps")) || [];
        const shortcuttedApps = JSON.parse(localStorage.getItem(crntusr.name + "-shortcutted-apps")) || [];
        const advancedSettings = JSON.parse(localStorage.getItem(crntusr.name + "advancedSettings")) || {
            terminal: false,
            quickLoad: false,
            fileSystem: false,
            questionPrompts: false,
        };
        const currentUser = btoa(localStorage.getItem("currentUser"));
        const users = btoa(localStorage.getItem("users"));
    
        const TEMPLATE = {
            version,
            theme,
            background,
            taskbarPosition,
            desktopPositions,
            iconSize,
            quickLoad,
            proxyLinks,
            activeProxy,
            bookmarks,
            installedApps,
            pinnedApps,
            shortcuttedApps,
            advancedSettings,
            currentUser,
            users,
        };

        handleDownload(TEMPLATE, `Exported v${ version.version }`);
        pushNotification("Exported Settings", `${version.name}s settings were exported successfully. You can now import them elsewhere.`);
    } catch (error) {
        console.log(error);
        pushNotification("Exported Settings", `${version.name}s settings were exported insuccessfully. Please restart ${version.name}, or report it as a bug here: https://github.com/LuminesenceProject/LumiOS/issues, error: ${error}`, () => {window.location.href = "https://github.com/LuminesenceProject/LumiOS/issues"});
    }
}

const importSettings = (json) => {
    try {
        const parsedJson = JSON.parse(json);
        const currentUser = atob(parsedJson.currentUser);

        localStorage.setItem(currentUser.name + "theme", JSON.stringify(parsedJson.theme));
        localStorage.setItem("background", JSON.stringify(parsedJson.background));
        localStorage.setItem(currentUser.name + "position", parsedJson.taskbarPosition);
        localStorage.setItem(currentUser.name + "storedPositions", JSON.stringify(parsedJson.storedPositions) || {});
        localStorage.setItem(currentUser.name + "iconSizes", JSON.stringify(parsedJson.iconSizes) || 32);
        localStorage.setItem(currentUser.name + "quickload", JSON.stringify(parsedJson.quickLoad));
        localStorage.setItem(currentUser.name + "proxyLinks", JSON.stringify(parsedJson.proxyLinks) || []);
        localStorage.setItem(currentUser.name + "activeProxy", JSON.stringify(parsedJson.activeProxy) || "");
        localStorage.setItem(currentUser.name + "bookmarks", JSON.stringify(parsedJson.bookmarks) || []);
        localStorage.setItem(currentUser.name + "installedApps", JSON.stringify(parsedJson.installedApps));
        localStorage.setItem(currentUser.name + "-pinned-apps", JSON.stringify(parsedJson.pinnedApps) || []);
        localStorage.setItem(currentUser.name + "-shortcutted-apps", JSON.stringify(parsedJson.shortcuttedApps) || []);
        localStorage.setItem(currentUser.name + "advancedSettings", JSON.stringify(parsedJson.advancedSettings || {
            terminal: false,
            quickLoad: false,
            fileSystem: false,
            questionPrompts: false,
        }));
        localStorage.setItem("currentUser", atob(parsedJson.currentUser));
        localStorage.setItem("users", atob(parsedJson.users));

        pushNotification("Imported Settings", `${version.name}s settings were imported successfully. Please restart ${version.name} in order to apply the changes.`, () => {window.location.reload()})
    } catch (error) {
        console.log(error);
        pushNotification("Imported Settings", `${version.name}s settings were imported unsuccessfully. Please restart ${version.name} and open an issue on GitHub. https://github.com/LuminesenceProject/LumiOS/issues. \nerror: ${error}`, () => {window.location.href ="https://github.com/LuminesenceProject/LumiOS/issues"})
    }
};

const handleDownload = (json, filename) => {
    const jsonString = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = filename || version.name + "-default-settings.json";

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

export { importSettings, exportSettings };