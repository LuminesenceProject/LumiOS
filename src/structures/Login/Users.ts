import virtualFS from "../../utils/VirtualFS";
import { currentUserIndex } from "../../utils/process";
import { User } from "../../utils/types";


export async function getCurrentUser(index: number) {
    await virtualFS.initialize();
    const users = await virtualFS.readdir("System/Users");        

    const currentUser = Object.values(users)[index];
    const parsed: User = currentUser.type === "file" && (typeof currentUser.content === "string" ? JSON.parse(currentUser.content) : currentUser.content);
    
    return parsed;
}

export async function modifyUserProp(property: keyof User, newValue: any) {
  const currentUser: User = await getCurrentUser(currentUserIndex);

  // Check if the property exists in the User object
  if (currentUser.hasOwnProperty(property)) {
    // Update the property value with the new value
    currentUser[property] = newValue;

    // Save the updated user object, assuming you have a function to save the user
    await virtualFS.deleteFile("System/Users", currentUser.name);
    await virtualFS.writeFile("System/Users", currentUser.name, currentUser);

    console.log(`Property '${property}' updated to:`, newValue);
  } else {
    console.error(`Property '${property}' does not exist.`);
  }
}

export async function createUser(params: User) {
    await virtualFS.writeFile("System/Users", params.name, params);  
    await virtualFS.writeFolder("", params.name);  
}