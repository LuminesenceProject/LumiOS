import { Stamp } from "../utils/types";

export const saveStamp = (stamp: Stamp) => {
    // Generate a unique identifier for the stamp
    const id = Date.now().toString();

    // Convert the timestamp to a string
    const timestamp = new Date().toISOString();

    // Save the updated stamp including the id and timestamp
    const updatedStamp: Stamp = { ...stamp, id, timestamp };

    // Retrieve existing stamps from local storage
    const storedStampsJSON = localStorage.getItem("stamps");
    const storedStamps: Stamp[] = storedStampsJSON ? JSON.parse(storedStampsJSON) : [];

    // Add the new stamp to the existing stamps array
    storedStamps.push(updatedStamp);

    // Save the updated stamps array back to local storage
    localStorage.setItem("stamps", JSON.stringify(storedStamps));    
};