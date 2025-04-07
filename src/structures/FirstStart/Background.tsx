import image1 from "../../assets/image1.jpeg";
import image2 from "../../assets/image2.jpeg";
import image3 from "../../assets/image3.jpeg";
import image4 from "../../assets/image4.jpeg";
import image5 from "../../assets/image5.jpeg";
import image6 from "../../assets/image6.jpeg";
import image7 from "../../assets/image7.jpeg";
import image8 from "../../assets/image8.jpeg";
import image9 from "../../assets/image9.jpeg";
import image10 from "../../assets/image10.jpeg";
import { applyBackground } from "../../utils/Theme";
import virtualFS from "../../utils/VirtualFS";
import React, { useState } from "react";

interface BackgroundProps {
    canContinue: boolean;
    setCanContinue: (prev: boolean) => void;
}

const Background: React.FC<BackgroundProps> = ({ canContinue, setCanContinue }) => {
    const [bgIndex, setBgIndex] = useState<number>();

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

    const handleBackground = async (index: number) => {
        setBgIndex(index);
        
        await applyBackground(images[index], index);
        await virtualFS.deleteFile("System/", "BackgroundImage");
        await virtualFS.writeFile("System/", "BackgroundImage", images[index], "sys");  

        setCanContinue(true);
    }

    return ( 
        <div className="flex flex-col gap-2 justify-center items-center text-left">
            <h3 className="my-2 font-bold text-lg">Now choose the background that fits <span className="font-extrabold text-xl">you</span>.</h3>
            {!canContinue && <p className="text-xs font-light" style={{ color: "gray" }}>Please choose an option to continue.</p>}
            <div className="grid grid-cols-2 gap-2 w-1/4">
                {images.map((image, index) => (
                    <img onClick={() => handleBackground(index)} src={image} alt={`Image ${index}`} key={index} className={`w-full h-auto cursor-pointer shadow transition-shadow hover:shadow-lg rounded-sm ${index == bgIndex && "border-2 border-primary-light"}`} />
                ))}
            </div>
        </div>    
    );
}
 
export default Background;