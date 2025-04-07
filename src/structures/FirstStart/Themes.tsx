import { useEffect, useState } from "react";
import virtualFS from "../../utils/VirtualFS";
import Button from "../Button";
import { Theme } from "../../utils/types";
import { applyTheme } from "../../utils/Theme";

interface Themez {
    name: string;
    value: Theme;
}

interface ThemesProps {
    canContinue: boolean;
    setCanContinue: (prev: boolean) => void;
}

const Themes: React.FC<ThemesProps> = ({ canContinue, setCanContinue }) => {
    const [themes, setThemes] = useState<Themez[]>([]);

    useEffect(() => {
        const getThemes = async () => {
            const storedThemes = await virtualFS.readdir("System/Themes/");
                        
            const names = Object.keys(storedThemes);
            const values = Object.keys(storedThemes).map(theme => JSON.parse(storedThemes[theme].content));
            
            const combinedValues = names.map((value: string, index: number) => ({ name: value, value: values[index] }));
            setThemes(combinedValues);
        };

        getThemes();
    }, []);

    const handleTheme = async (theme: Themez) => {        
        await virtualFS.deleteFile("System/", "Theme");

        await virtualFS.writeFile("System/", "Theme", JSON.stringify(theme.value), "theme");
        await applyTheme(theme.value, 0);

        setCanContinue(true);
    }

    return ( 
        <div className="flex flex-col gap-2 justify-start items-start text-left">
            <h3 className="my-2 font-bold text-xl">Get started by choosing a theme.</h3>
            {!canContinue && <p className="text-xs font-light" style={{ color: "gray" }}>Please choose an option to continue.</p>}
            {themes.map((theme: Themez, index) => (
                <Button onClick={() => handleTheme(theme)} key={index} style={{
                    background: theme.value.primary,
                    color: theme.value.textBase,
                }}>
                    {theme.name.split(/(?=[A-Z])/)[0].slice(0, 1).toUpperCase() + theme.name.split(/(?=[A-Z])/)[0].slice(1, 100) + " " + theme.name.split(/(?=[A-Z])/)[1]}
                </Button>
            ))}
        </div>
    );
}
 
export default Themes;