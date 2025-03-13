import { pushNotification } from "../components/Notifications/Notifications";
import logo from "../Images/logo.jpeg"

const version = {
  name: "Lumi OS",
  image: logo || "https://avatars.githubusercontent.com/u/101959214?v=4",
  version: "5.1",
  secure: true,
};

const fetchData = async () => {
  try {
    const response = await fetch("https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Info.json");

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    const versionsMatch = data[0].version === version.version;
    
    if (versionsMatch) {
      version.secure = true;
    } else {
      version.secure = false;
      pushNotification(version.name, version.name + " is unsecure, and requires an update immediately, either for bug fixes, or content updates.", () => {window.location.href = "https://github.com/LuminesenceProject/LumiOS"});
    }
  } catch (error) {
    console.error("Error fetching data:", error.message);
    throw error;
  }
};

fetchData();

// Export the version object as the default export
export default version;