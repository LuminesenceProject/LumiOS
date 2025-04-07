import React, { useState } from "react";
import virtualFS from "../../../utils/VirtualFS";
import Button from "../../../structures/Button";

interface ContentProps {
    content: string | Record<string, unknown>; // Change type to accept string or object
    path: string;
    name: string;
}

const HTMLFileEditor: React.FC<ContentProps> = ({ content, path, name }) => {
    const [newContent, setNewContent] = useState<string>(getContentAsString(content)); // Set initial state with content

    const handleContentChange = async () => {
        try {
            let parsedContent: any = newContent;
            // Try to parse the content as JSON
            try {
                parsedContent = JSON.parse(newContent);
            } catch (error) {
                // If it fails, treat it as a plain string
                console.warn("Content is not valid JSON, treating as string.");
            }

            await virtualFS.deleteFile(path, name);
            await virtualFS.writeFile(path, name, parsedContent);
        } catch (error) {
            console.error("Error saving changes:", error);
        }
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setNewContent(e.target.value);
    };

    // Function to get content as string, handling objects by stringifying them
    function getContentAsString(data: string | Record<string, unknown>): string {
        if (typeof data === "object") {
            return JSON.stringify(data, null, 2);
        }
        return data;
    }

    return (
        <div className="w-full h-full flex flex-row">
            <div className="min-w-[3/4]">
                <Button onClick={handleContentChange}>Save Changes</Button>
            </div>
            <textarea className="w-full h-full p-1 border-none" value={newContent} onChange={handleTextareaChange} />
        </div>
    );
}
 
export default HTMLFileEditor;