import virtualFS from "./VirtualFS";
import { Theme } from "./types";

export async function createTheme(name: string, theme: Theme) {
    await virtualFS.writeFile("System/Themes/", name, JSON.stringify(theme));
}

export async function applyTheme(theme: Theme, currentUserIndex?: number) {
    const root = document.documentElement;
    Object.keys(theme).forEach((cssVar) => {
        if (typeof cssVar === 'string') {
            const key = cssVar as keyof Theme;
            root.style.setProperty(`--${cssVar}`, theme[key]);
        }
    });    



    //await modifyUserProp("theme", theme);
}

export async function applyBackground(image: string, currentUserIndex?: number) {    
    const root = document.documentElement;
    
    root.style.setProperty('--background-image', `url(${image})`);  
  
    //await modifyUserProp("backgroundImage", image);
}