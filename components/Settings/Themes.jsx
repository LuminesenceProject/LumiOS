import { useState } from 'react';
import { applyTheme, createTheme, applyBackground } from '../../util/themes/themeUtil';

import baseTheme from "../../util/themes/baseTheme";
import pinkTheme from '../../util/themes/pinkTheme';
import purpleTheme from '../../util/themes/purpleTheme';
import roseTheme from '../../util/themes/roseTheme';
import darkTheme from '../../util/themes/darkTheme';
import blueTheme from '../../util/themes/blueTheme';
import lightblueTheme from '../../util/themes/lightblueTheme';
import germanyTheme from '../../util/themes/germanyTheme';
import greenTheme from '../../util/themes/greenTheme';
import grayTheme from '../../util/themes/grayTheme';

import image1 from "../../Images/image1.jpeg";
import image2 from "../../Images/image2.jpeg";
import image3 from "../../Images/image3.jpeg";
import image4 from "../../Images/image4.jpeg";
import image5 from "../../Images/image5.jpeg";
import image6 from "../../Images/image6.jpeg";
import image7 from "../../Images/image7.jpeg";
import image8 from "../../Images/image8.jpeg";
import image9 from "../../Images/image9.jpeg";
import image10 from "../../Images/image10.jpeg";

const Themes = () => {
    const [selectedTheme, setSelectedTheme] = useState(null);
    const [customTheme, setCustomTheme] = useState({
        primary: '#ffffff',
        primaryLight: '#f0f0f0',
        secondary: '#000000',
        secondaryLight: '#333333',
        textBase: 'black', // Default text color
    });

    const imagesPresets = [
        image1,
        image2,
        image3,
        image4,
        image5,
        image6,
        image7,
        image8,
        image9,
        image10
    ];

    const themes = [
        baseTheme,
        grayTheme,
        darkTheme,
        blueTheme,
        greenTheme,
        lightblueTheme,
        pinkTheme,
        purpleTheme,
        roseTheme,
        germanyTheme,
    ];

    const handleColorChange = (property, color) => {
        setCustomTheme({
          ...customTheme,
          [property]: color,
        });
    };

    const handleTextBaseChange = (color) => {
        setCustomTheme({
            ...customTheme,
            textBase: color,
        });
    };

    const handleApplyCustomTheme = () => {
        const customThemeObject = createTheme(customTheme);
        applyTheme(customThemeObject);
    };

    const handleImageClick = (imageUrl) => {
        applyBackground(imageUrl);
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        applyBackground(URL.createObjectURL(file));
    };


    return ( 
        <div className="ml-4">
            <div className="grid grid-cols-5 gap-2">
            {/* Render existing themes */}
            {themes.map((theme, index) => (
                <div
                className="p-2 shadow-sm cursor-pointer hover:shadow-lg transition-shadow duration-200 rounded"
                key={index}
                style={{background: theme["--theme-primary"]}}
                onClick={() => applyTheme(theme)}
                >
                <h3 className="font-bold">{themes[theme]}</h3>
                </div>
            ))}
            </div>
            {/* Custom Theme Section */}
            <h2 className="text-2xl font-bold my-4">Custom Theme</h2>

            {/* Color Pickers for Theme Properties */}
            <div className="grid grid-cols-2 gap-4">
            <label className="inputLabel">
                Primary Color:
                <input
                type="color"
                value={customTheme.primary}
                onChange={(e) => handleColorChange('primary', e.target.value)}
                className="inputColor"
                />
            </label>
            <label className="inputLabel">
                Primary Light Color:
                <input
                type="color"
                value={customTheme.primaryLight}
                onChange={(e) => handleColorChange('primaryLight', e.target.value)}
                className="inputColor"
                />
            </label>
            <label className="inputLabel">
                Secondary Color:
                <input
                type="color"
                value={customTheme.secondary}
                onChange={(e) => handleColorChange('secondary', e.target.value)}
                className="inputColor"
                />
            </label>
            <label className="inputLabel">
                Secondary Light Color:
                <input
                type="color"
                value={customTheme.secondaryLight}
                onChange={(e) => handleColorChange('secondaryLight', e.target.value)}
                className="inputColor"
                />
            </label>
            </div>

            {/* Text Base Color Selector */}
            <div className="my-2">
            <label>
                Text Base Color:
                <select
                value={customTheme.textBase}
                onChange={(e) => handleTextBaseChange(e.target.value)}
                >
                <option value="black">Black</option>
                <option value="white">White</option>
                </select>
            </label>
            </div>

            {/* Apply Custom Theme Button */}
            <button
            className="p-2 bg-secondary hover:bg-secondary-light transition-colors duration-200 rounded"
            onClick={handleApplyCustomTheme}
            >
            Apply Custom Theme
            </button>

            <div className="flex flex-row justify-between items-center">
            <h2 className="text-2xl font-bold my-4">Images</h2>
            <input
                type="file"
                onChange={handleFileChange}
                accept="image/*"
                className="p-2 bg-secondary hover:bg-secondary-light transition-colors duration-200 rounded"
            />                
            </div>
            <div className="grid grid-cols-5 gap-2 w-full">
                {imagesPresets.map((image, index) => (
                <img className="cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-200 rounded" src={image} alt={index} key={index} onClick={() => {handleImageClick(image)}} />
                ))}
            </div>
        </div>
     );
}
 
export default Themes;