import React, { useEffect, useState } from "react";
import Button from "../../../structures/Button";
import virtualFS from "../../../utils/VirtualFS";

interface FileViewerProps {
    name: string;
    path: string;
    content: string;
    selectedFiles: { path: string; content: string }[];
    setSelectedFiles: (prev: { path: string; content: string }[]) => void;
}

const FileViewer: React.FC<FileViewerProps> = ({ name, path, content, selectedFiles, setSelectedFiles }) => {
  const [currentFile, setCurrentFile] = useState<{ name: string; path: string; content: string }>({ name: "", path: "", content: "" });
  const [newPath, setNewPath] = useState<string>(currentFile.path);

  useEffect(() => {
    const current = selectedFiles[selectedFiles.length - 1];

    if (current) {
      setCurrentFile(current);
      setSelectedFiles((prev) => prev.slice(0, -1));
    }    
  }, [selectedFiles, setSelectedFiles]);

  const handleFileSave = async () => {
    try {
        const splitPath = newPath.split("/");
        const adjustedPath = splitPath.slice(1, -1).join("/") + "/";
        const name = splitPath[splitPath.length - 1];
        console.log(adjustedPath);
        
        await virtualFS.deleteFile(adjustedPath, currentFile.name);
        await virtualFS.writeFile(adjustedPath, name, currentFile.content);
        console.log(await virtualFS.readdir(adjustedPath));
        
        //await virtualFS.deleteFile(adjustedPath, splitPath[splitPath.length]);

    } catch (error) {
        console.error("Error saving file:", error);
    }
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    setCurrentFile((prev) => ({ ...prev, content: newContent }));
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPathValue = e.target.value;
    setNewPath(newPathValue);
  };

  const handlePathSave = () => {
    setCurrentFile((prev) => ({ ...prev, path: newPath }));
    setNewPath("");
  };

  return (
    <div>
      <div>
        <input style={{ color: "black" }} type="text" defaultValue={currentFile.path} onChange={handlePathChange} />
        <Button onClick={handlePathSave}>Change Path</Button>
      </div>
      <textarea style={{ color: "black" }} defaultValue={currentFile.content} onChange={handleContentChange} readOnly={false} />
      <Button onClick={handleFileSave}>Save</Button>
    </div>
  );
};

export default FileViewer;