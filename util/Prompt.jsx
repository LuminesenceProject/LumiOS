import { useEffect, useRef } from "react";

const Prompt = ({ children, setShown }) => {
    const promptRef = useRef(null);
    
    useEffect(() => {
        const handleOutsideClick = (e) => {
            if (promptRef.current && !promptRef.current.contains(e.target)) {
                setShown(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    return (
        <div className="fixed top-0 left-0 flex justify-center items-center w-full h-full backdrop-blur-lg z-[10000]">
            <div ref={promptRef} className="absolute">
                {children}
            </div>
        </div>
    );
}

export default Prompt;