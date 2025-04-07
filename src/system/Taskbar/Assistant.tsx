import React, { useEffect, useRef, useState } from "react";
import Button from "../../structures/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { getAiResponse } from "./getAiResponse";

interface AssistantProps {
    shown: boolean;
    openedApps: string[];
    htmlOpenedApps: object[];
    setShown: (prev: boolean) => void;
    setOpenedApps: (prev: string[]) => void;
    setHTMLOpenedApps: (prev: object[]) => void;
}

const Assistant: React.FC<AssistantProps> = ({ shown, setShown, setOpenedApps }) => {
    const helpRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const [messages, setMessages] = useState<{ text: string; sender: "AI" | "User" }[]>([]);
    const [inputValue, setInputValue] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect(() => {
        const handleOutsideClick = (e: MouseEvent) => {
            if (helpRef.current && !helpRef.current.contains(e.target as Node)) {
                setShown(false);
                setMessages([]);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (inputValue.trim() !== "") {
            setMessages((prev) => [...prev, { text: inputValue, sender: "User" }]);
            setInputValue(""); // Clear input after sending message
            setIsLoading(true); // Show loading indicator
            setTimeout(async () => {
                const response = await getAiResponse(inputValue, setOpenedApps);

                setMessages((prev) => [...prev, { text: response, sender: "AI" }]);
                setIsLoading(false); // Hide loading indicator after setting AI response
            }, 1000); // Simulate AI response time
        }
    };

    const handleButtonMessage = (message: string) => {
        setInputValue(message);
        setMessages((prev) => [...prev, { text: message, sender: "User" }]);
        setInputValue(""); // Clear input after sending message
        setIsLoading(true); // Show loading indicator
        setTimeout(async () => {
            // Simulate AI response delay
            const response = await getAiResponse(message, setOpenedApps);

            setMessages((prev) => [...prev, { text: response, sender: "AI" }]);
            setIsLoading(false); // Hide loading indicator after setting AI response
        }, 1000); // Simulate AI response time
    };

    const renderMessages = () => {
        return messages.map((message, index) => (
            <div
                key={index}
                className={`message ${message.sender === "AI" ? "text-left" : "text-right"} relative`}
                style={{
                    maxWidth: "70%", // Limiting maximum width of messages for better readability
                    alignSelf: message.sender === "AI" ? "flex-start" : "flex-end", // Aligning messages based on sender
                    wordWrap: "break-word", // Ensure words wrap within the container
                    overflowWrap: "break-word", // Break long words if necessary
                    whiteSpace: "pre-wrap", // Ensure whitespace is handled correctly
                    opacity: 0,
                    transform: `translateX(${message.sender === "AI" ? "-100%" : "100%"})`,
                    transition: "opacity 300ms ease, transform 300ms ease",
                }}
                ref={(el) => {
                    if (el) {
                        setTimeout(() => {
                            el.style.opacity = "1";
                            el.style.transform = "translateX(0)";
                        }, 10);
                    }
                }}
            >
                <span
                    className={`p-2 rounded-lg shadow-md block ${message.sender === "AI" ? "bg-[#212121]" : "bg-secondary-light"}`} // Changed to block to ensure wrapping
                >
                    {message.text}
                </span>
            </div>
        ));
    };

    return (
        <div
            ref={helpRef}
            id="Assistant"
            className={`${
                shown ? "scale-100 pointer-events-auto z-50" : "scale-0 pointer-events-none"
            } transition-transform duration-200 absolute -translate-y-20 backdrop-blur-lg w-3/12 h-1/2 mx-20 left-0 origin-bottom p-4 rounded overflow-hidden`}
            style={{ bottom: 0, backdropFilter: "blur(20px)", color: "white" }}
        >
            <div className="flex flex-col h-full w-full justify-between">
                {messages.length === 0 && (
                    <div className="text-center flex items-center flex-col">
                        <h3 className="font-bold text-xl my-2">Assistant</h3>
                        <p className="pb-3">Type "help" to get started!</p>
                        <Button className="flex flex-row gap-2 my-1" onClick={() => handleButtonMessage("Hello!")}>
                            <FontAwesomeIcon icon={faPaperPlane} /> Hello!
                        </Button>
                        <Button className="flex flex-row gap-2 my-1" onClick={() => handleButtonMessage("What's in the new update?")}>
                            <FontAwesomeIcon icon={faPaperPlane} /> What's in the new update?
                        </Button>
                        <Button className="flex flex-row gap-2 my-1" onClick={() => handleButtonMessage("Tell me about settings.")}>
                            <FontAwesomeIcon icon={faPaperPlane} /> Tell me about settings.
                        </Button>
                        <hr style={{ color: "gray" }} className="w-11/12 text-center mx-auto my-2" />
                    </div>
                )}
                <div className="h-full flex flex-col justify-between overflow-y-auto overflow-x-hidden">
                    <div className="flex flex-col overflow-y-auto px-2 h-full py-2 overflow-x-hidden">
                        {renderMessages()}
                        <div style={{ float: "left", clear: "both" }} ref={messagesEndRef} />
                    </div>
                    <form className="flex items-center gap-2 py-1 px-2" onSubmit={handleSendMessage}>
                        <input
                            type="text"
                            value={inputValue}
                            onChange={handleInputChange}
                            placeholder="Type a message..."
                            className="bg-secondary w-full cursor-pointer px-2 py-1 shadow-sm hover:bg-primary-light duration-100 ease-in-out transition-colors rounded text-text-base"
                        />
                        <button
                            type="submit"
                            className="bg-secondary cursor-pointer px-2 py-1 shadow-sm hover:bg-primary-light duration-100 ease-in-out transition-colors rounded text-text-base min-w-min"
                        >
                            {isLoading ? "Sending..." : "Send"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Assistant;