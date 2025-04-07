import React, { useEffect, useRef } from "react";
import Button from "./Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons"; // Changed to faTimes for X icon
import alertSound from "../assets/sound/alert.wav";
import Draggable from "react-draggable";
import { Stamp } from "../utils/types";
import { saveStamp } from "./Timestamp";

interface PromptProps {
    title: string;
    description: string;
    game: any;
    setPrompts: (prev: any) => void;
    onConfirm: (props: any) => void;
}

const Prompt: React.FC<PromptProps> = ({ title, description, setPrompts, onConfirm, game }) => {
    const promptRef = useRef(null);

    useEffect(() => {
        // Play sound on component mount
        const audio = new Audio(alertSound);
        audio.play();

        const handleOutsideClick = (e) => {
            if (promptRef.current && !promptRef.current.contains(e.target)) {
                handlePromptClose();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            audio.pause();
            audio.currentTime = 0;
        };
    }, []);

    const handlePromptClose = () => {
        setPrompts((prev: any) => {
            return prev.filter((prompt: any) => prompt.title !== title);
        });

        // Stamp here
        const stamp: Stamp = {
            app: "FilePrompt",
            content: {
                title,
                description,
                game,
            },
            openedApps: [],
            error: new Error("App was not installed."),
        };

        saveStamp(stamp);
    };

    const handleConfirm = async () => {
        await onConfirm(await game);
        setTimeout(handlePromptClose, 1000);
    };

    return (
        <div className="fixed top-0 left-0 w-screen h-screen flex justify-center items-center z-50 backdrop-blur-lg text-text-base">
            <Draggable>
                <div ref={promptRef} className="flex flex-col justify-between items-center bg-primary rounded shadow-lg min-h-[200px] min-w-1/4 max-w-[75%]">
                    <div className="bg-primary-light w-full py-1 px-2 flex justify-between items-center rounded cursor-move">
                        <h2 className="font-bold text-2xl">{title}</h2>
                        <Button onClick={handlePromptClose}><FontAwesomeIcon icon={faTimes} /></Button>
                    </div>
                    <p className="p-2">{description}</p>
                    <div className="w-5/6 my-4">
                        <Button onClick={handlePromptClose}>Close</Button>
                        <Button onClick={handleConfirm}>Confirm</Button>
                    </div>
                </div>
            </Draggable>
        </div>
    );
};

export default Prompt;