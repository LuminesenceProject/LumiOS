import { pushNotification } from "../Notifications/Notifications";

const DB_NAME = 'FileSystem';
const OBJECT_STORE_NAME = 'FileSystem';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create the FileSystem object store
      if (!db.objectStoreNames.contains(OBJECT_STORE_NAME)) {
        const fileSystemStore = db.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id', autoIncrement: true });

        // Optionally, create an index for parentId
        fileSystemStore.createIndex('parentId', 'parentId');
      }
    };

    request.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      reject(event.target.error);
      pushNotification("Filesystem", "File system could not be accessed. It either does not exist or is blocked.");
    };
  });
};

const addFileOrFolder = (item) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], 'readwrite');
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

      // Ensure the item does not have a key (let IDB generate it)
      const { id, ...itemWithoutKey } = item;

      // Convert the item to a plain object with string keys
      const itemObject = JSON.parse(JSON.stringify(itemWithoutKey));

      console.log('Adding item to store:', itemObject);

      const request = objectStore.add(itemObject);

      request.onsuccess = () => {
        resolve();
      };

      request.onerror = (event) => {
        console.error('Error adding file or folder:', event.target.error);
        reject(event.target.error);
      };
    } catch (error) {
      console.error('Error adding file or folder:', error);
      reject(error);
    }
  });
};

const getFilesAndFolders = () => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction([OBJECT_STORE_NAME], 'readonly');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.getAll();

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const getAllItemsInFolder = async (folderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

      const request = objectStore.getAll();

      request.onsuccess = (event) => {
        const allItems = event.target.result;
        const itemsInFolder = allItems.filter(item => item.parentId === folderId);
        resolve(itemsInFolder);
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

const deleteFileOrFolder = (itemId) => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const request = objectStore.delete(itemId);

    request.onsuccess = () => {
      resolve();
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const moveFile = (fileId, newParentId) => {
  return new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction(OBJECT_STORE_NAME, 'readwrite');
    const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

    const getRequest = objectStore.get(fileId);

    getRequest.onsuccess = () => {
      const file = getRequest.result;

      if (file) {
        file.parentId = newParentId;

        const putRequest = objectStore.put(file);

        putRequest.onsuccess = () => {
          resolve();
        };

        putRequest.onerror = (event) => {
          reject(event.target.error);
        };
      } else {
        reject(new Error('File not found'));
      }
    };

    getRequest.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

const fetchFileContent = (fileId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

      if (fileId === undefined) {
        reject(new Error('File ID is undefined.'));
        return;
      }

      const request = objectStore.get(fileId);

      request.onsuccess = (event) => {
        const file = event.target.result;

        if (file && file.type === 'file') {
          resolve(file.content);
        } else {
          console.error('File not found or not of type file:', file);
          reject(new Error('File not found or not of type file.'));
        }
      };

      request.onerror = (event) => {
        console.error('Error fetching file content:', event.target.error);
        reject(event.target.error);
      };
    } catch (error) {
      console.error('Error opening database:', error);
      reject(error);
    }
  });
};

const handleFileUpload = async (event) => {
  const files = event.target.files || event.dataTransfer.files;

  for (const file of files) {
    const reader = new FileReader();

    reader.onload = async () => {
      const newFile = {
        name: file.name,
        content: reader.result,
        type: 'file',
        parentId: currentFolder,
      };

      await addFileOrFolder(newFile);
      fetchItems(); // Refresh the file list
    };

    reader.readAsText(file);
  }
};

const fetchFileContentByName = (fileName) => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const transaction = db.transaction([OBJECT_STORE_NAME], 'readonly');
      const objectStore = transaction.objectStore(OBJECT_STORE_NAME);

      // Get all records and find the one with the matching name
      const request = objectStore.openCursor();

      request.onsuccess = (event) => {
        const cursor = event.target.result;

        if (cursor) {
          const file = cursor.value;

          if (file.name === fileName && file.type === 'file') {
            resolve(file.content);
            return;
          }

          cursor.continue();
        } else {
          // File not found
          reject(new Error('File not found or not of type file.'));
        }
      };

      request.onerror = (event) => {
        reject(event.target.error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

export { addFileOrFolder, getFilesAndFolders, getAllItemsInFolder, deleteFileOrFolder, moveFile, fetchFileContent, fetchFileContentByName, handleFileUpload };