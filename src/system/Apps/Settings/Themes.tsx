import { useEffect, useState } from "react";
import virtualFS from "../../../utils/VirtualFS";
import image1 from "../../../assets/image1.jpeg";
import image2 from "../../../assets/image2.jpeg";
import image3 from "../../../assets/image3.jpeg";
import image4 from "../../../assets/image4.jpeg";
import image5 from "../../../assets/image5.jpeg";
import image6 from "../../../assets/image6.jpeg";
import image7 from "../../../assets/image7.jpeg";
import image8 from "../../../assets/image8.jpeg";
import image9 from "../../../assets/image9.jpeg";
import image10 from "../../../assets/image10.jpeg";
import { currentUserIndex } from "../../../utils/process";
import { applyBackground, applyTheme } from "../../../utils/Theme";
import { Theme } from "../../../utils/types";
import { useTopbar } from "../../Topbar/useTopbar";
import { faPalette, faRefresh } from "@fortawesome/free-solid-svg-icons";

const Themes = () => {
    const [themes, setThemes] = useState<Array<object>>([]);
    const [defaultTheme, setDefaultTheme] = useState("");
    const [defaultTaskbar, setDefaultTaskbar] = useState("");
    const defaultPosition = localStorage.getItem("position");
    const { addMenu, removeMenu } = useTopbar();

    useEffect(() => {
        const getThemes = async () => {
            const storedThemes = await virtualFS.readdir("System/Themes");
                        
            const names = Object.keys(storedThemes);
            const values = Object.keys(storedThemes).map(theme => JSON.parse(storedThemes[theme].content));
            
            const combinedValues = names.map((value: string, index: number) => ({ name: value, value: values[index] }));
            setThemes(combinedValues);

            const activeTheme = await virtualFS.readfile("System/", "Theme");
            const activeTaskbar = await virtualFS.readfile("System/Plugins/", "Taskbar");

            setDefaultTheme(JSON.parse(activeTheme.content));
            setDefaultTaskbar(activeTaskbar.content);            
        };

        getThemes();
    }, []);

    useEffect(() => {
        const handleTaskbarSwitch = async () => {
            const currentTaskbar: HTMLInputElement = document.getElementById("taskbarTheme") || "full";

            
            handleTaskbar(currentTaskbar?.value === "full" ? "floating" : "full");
        };

        addMenu({
          title: "",
          icon: faPalette,
          dropdown: [
            { label: "Switch Taskbar", onClick: handleTaskbarSwitch, icon: faRefresh, gap: true },
            { label: "System", onClick: () => {}, gap: true },
            { label: "Restart", onClick: () => {} },
            { label: "Logout", onClick: () => {} },
          ],
        });
    
        return () => removeMenu("");
    }, []);

    const images = [
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        image8,
        image9,
        image10,
    ];

    const applyImage = async (index: number) => {
        await applyBackground(images[index], currentUserIndex);
        await virtualFS.deleteFile("System/", "BackgroundImage");
        await virtualFS.writeFile("System/", "BackgroundImage", images[index], "sys");  
    }

    const applyThemeFromTheme = async (theme: Theme) => {
        await applyTheme(theme, currentUserIndex);
        await virtualFS.deleteFile("System/", "Theme");
        await virtualFS.writeFile("System/", "Theme", JSON.stringify(theme), "sys");
    }

    const handleTaskbar = async (position: string) => {
        await virtualFS.deleteFile("System/Plugins/", "Taskbar");
        await virtualFS.writeFile("System/Plugins/", "Taskbar", position, "sys");
    }

    const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e: ProgressEvent<FileReader>) => {
                if (e.target) {
                    await applyBackground(e.target.result as string, currentUserIndex);
                    await virtualFS.deleteFile("System/", "BackgroundImage");
                    await virtualFS.writeFile("System/", "BackgroundImage", e.target.result as string, "sys");  
                }
            };
            reader.readAsDataURL(file);
        }
    }

    return ( 
        <div className="p-5">
            <h2 className="text-2xl font-bold my-2">Themes</h2>
            <select defaultValue={defaultTheme} onChange={(e) => applyThemeFromTheme(themes[e.target.value].value)} className="bg-secondary cursor-pointer px-2 py-1 shadow-sm hover:bg-primary-light duration-100 ease-in-out transition-colors rounded text-text-base">
                {themes.map((theme, index) => (
                    <option 
                        value={index} 
                        key={index}
                        className="option-main"
                    >
                        {themes[index].name}
                    </option>
                ))}
            </select>
            <h2 className="text-2xl font-bold my-2">Taskbar</h2>
            <div className="flex flex-col gap-1 w-fit">
                <select id="taskbarTheme" defaultValue={defaultTaskbar} onChange={(e) => handleTaskbar(e.target.value)} className="bg-secondary cursor-pointer px-2 py-1 shadow-sm hover:bg-primary-light duration-100 ease-in-out transition-colors rounded text-text-base">
                    <option value="full">Full</option>
                    <option value="floating">Floating</option>
                </select>
                <select defaultValue={defaultPosition || ""} onChange={(e) => localStorage.setItem("position", e.target.value)} className="bg-secondary cursor-pointer px-2 py-1 shadow-sm hover:bg-primary-light duration-100 ease-in-out transition-colors rounded text-text-base">
                    <option value="north">Top</option>
                    <option value="south">Bottom</option>
                    <option value="west">Left</option>
                    <option value="east">Right</option>
                </select>
            </div>
            <div className="my-2 flex flex-row justify-between items-center">
                <h2 className="text-2xl font-bold my-2">Images</h2>
                <label htmlFor="file-upload" className="custom-file-upload">
                    Upload
                </label>
                <input id="file-upload" type="file" title="Image Upload" accept="image/*" onChange={handleImageUpload} />
            </div>
            <div className="grid grid-cols-2 gap-2">
                {images.map((image, index) => (
                    <img src={image} alt="Default Image" className="cursor-pointer transition-shadow duration-200 hover:brightness-75 hover:shadow-md shadow-sm rounded" key={index} onClick={() => applyImage(index)} />
                ))}
            </div>
        </div>
    );
}
 
export default Themes;