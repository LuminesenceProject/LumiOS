export interface File {
    type: "file";
    fileType: "sys" | "theme" | "txt" | "html" | "shrt" | "pinn" | "app" | "js";
    content: string;
    permissions: boolean;
    date: string;
}

export interface Folder {
    type: "folder";
    permissions: boolean;
    children: Record<string, File | Folder>;
    date: string;
}

export interface Theme {
    primary: string;
    primaryLight: string;
    secondary: string;
    secondaryLight: string;
    textBase: string;
}

export interface User {
    name: string;
    password: string | null;
    admin: "false" | boolean;
    pinnedApps: Array<number>;
    shortcutApps: Array<number>;
    theme: Theme;
    backgroundImage: string;
}

export interface App {
    name: string;
    description: string;
    userInstalled: boolean;
    svg: string;
}

export interface Game {
    name: string;
    description: string;
    image: string;
    path: string;
    types: [string, string, string] | undefined;
    type: "html" | "swf";
}

export interface Stamp {
    id?: string; // Unique identifier for the stamp
    timestamp?: string; // String representation of the timestamp
    app: string;
    content: any;
    openedApps: Array<string>;
    error?: Error;
    // Add more properties as needed
}

export interface Panic {
    key: string;
    website: string;
    title: string;
    favicon: string;
}