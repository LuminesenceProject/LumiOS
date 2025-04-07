// I removed virtualFS data
// cause there were so many issues
// I'll add it back later when its fixed

import { App, File, Folder } from "./types";
import defaultFS from "./defaultFS";
  
interface DefaultFS {
  root: Folder;
}

class VirtualFS {
  private fileSystem: DefaultFS;
  private db: IDBDatabase | null;
  private dbName: string;
  private storeName: string;
  public root: Folder;

  constructor () {
    throw new Error("TODO: Create virtualFS")
    this.fileSystem = { ...defaultFS };
    this.db = null;
    this.dbName = 'VirtualFileSystemDB';
    this.storeName = 'fileSystem';
    this.root = this.fileSystem.root;
    this.initialize();
  }

  private async openDB(): Promise<IDBDatabase> {

  }  

  public async initialize(): Promise<void> {

  }  

  public async readdir(path: string): Promise<Record<string, File | Folder>> {

  }

  public async readfile(path: string, name: string): Promise<File> {

  }

  public async mv(path: string, newPath: string, fileName: string, newFileName = fileName): Promise<void> {

  }

  public async deleteFile(path: string, fileName: string): Promise<void> {

  }

  public async writeFile(path: string, name: string, content: string | any, type?: string): Promise<void> {

  }

  public async writeFolder(path: string, name: string): Promise<void> {

  }

  public async save(): Promise<void> {

  }
  
  private serializeFileSystem(fileSystem: any): any {
    // Recursive function to handle serialization of nested objects
    const serialize = (obj: any) => {
      if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
        const serializedObj: any = {};
        for (const key in obj) {
          if (obj.hasOwnProperty(key)) {
            serializedObj[key] = serialize(obj[key]);
          }
        }
        return serializedObj;
      } else {
        return obj;
      }
    };
  
    return serialize(fileSystem);
  }  
}

/*
              "Default User": {
                type: "file",
                fileType: "user",
                content: JSON.stringify(<User>{
                  name: "Default",
                  password: "",
                  admin: true,
                  shortcutApps: [0, 1, 2],
                  pinnedApps: [0, 1],
                  theme: {
                    primary: "#222222",
                    primaryLight: "#444444",
                    secondary: "#ffffff",
                    secondaryLight: "#dddddd",
                  },
                  backgroundImage: image1,
                }),
                permissions: false,
              }
*/

const virtualFS = new VirtualFS();

export default virtualFS;  