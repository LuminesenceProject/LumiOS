import { useState, useEffect } from 'react';
import version from "../../util/util";
import Button from '../../util/Button';

const Advanced = ({ bootScreen }) => {
    const crntusr = JSON.parse(localStorage.getItem("currentUser"));

    const advancedSettingsTemplate = {
        terminal: false,
        quickLoad: false,
        fileSystem: false,
        questionPrompts: false,
    };

    const [settings, setSettings] = useState(() => {
        const storedSettings = JSON.parse(localStorage.getItem(crntusr.name + "advancedSettings"));
        return storedSettings || advancedSettingsTemplate;
    });

    useEffect(() => {
        localStorage.setItem(crntusr.name + "advancedSettings", JSON.stringify(settings));
    }, [settings]);

    const handleSettingsChange = (option, settingKey) => {
        setSettings(prevSettings => ({
            ...prevSettings,
            [settingKey]: option === 'true',
        }));
    };

    const handleBootScreen = () => {
        bootScreen(true);
    };

    return (
        <div className="flex flex-col gap-2">
            {Object.entries(settings).map(([key, value]) => (
            <div className="relative flex flex-row justify-center items-center" key={key}>
                    <select 
                        className="select-main"
                        style={{ color: "black" }}
                        onChange={(e) => handleSettingsChange(e.target.value, key)}
                        value={value.toString()}
                    >
                        <option value="true">Enabled</option>
                        <option value="false">Disabled</option>
                    </select>
                    <label
                        style={{ color: "black" }}
                        className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[11px] font-normal leading-tight text-blue-gray-400 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                        {key}
                    </label>
                </div>
            ))}
            <Button onClick={handleBootScreen}>
                Boot Screen
            </Button>
        </div>
    );
}

export default Advanced;