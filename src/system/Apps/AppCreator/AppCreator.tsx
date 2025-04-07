import React, { useState } from "react";
import virtualFS from "../../../utils/VirtualFS";

const AppCreator = () => {
  const [appDescription, setAppDescription] = useState("");
  const [message, setMessage] = useState("");
  const [htmlFile, setHtmlFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [pinned, setPinned] = useState(false);
  const [shortcut, setShortcut] = useState(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>, setFile: React.Dispatch<React.SetStateAction<File | null>>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      setFile(file);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Upload HTML file to the "apps" folder
    if (htmlFile) {
      const htmlReader = new FileReader();
      htmlReader.onload = async () => {
        try {
            // Upload Image file to the "apps" folder
            if (imageFile) {
              const imageReader = new FileReader();
              imageReader.onload = async () => {
              // You can do something with the image if needed
              await virtualFS.writeFile("Apps/", htmlFile.name, JSON.stringify({
                  name: htmlFile.name,
                  description: appDescription,
                  userInstalled: true,
                  svg: imageReader.result,
                  fileContent: htmlReader.result,
              }), "app");
                
              if (pinned) {
                await virtualFS.writeFile("System/Taskbar/", htmlFile.name, JSON.stringify({
                  name: htmlFile.name,
                  svg: imageReader.result,
                }), "pinn");
              }
              if (shortcut) {
                await virtualFS.writeFile("System/Taskbar/", htmlFile.name, JSON.stringify({
                  name: htmlFile.name,
                  svg: imageReader.result,
                }), "shrt");
              }};

              imageReader.readAsDataURL(imageFile);
            }
          setMessage("App created successfully!");
        } catch (error) {
          console.error("Error creating app:", error);
          setMessage("Error creating app");
        }
      };
      htmlReader.readAsText(htmlFile);
    }
  };

  return (
    <div className="bg-primary text-text-base p-8">
      <form className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md bg-primary-light" onSubmit={handleFormSubmit}>
        <h3 className="font-bold text-2xl">App Creator</h3>
        <div>
          <label htmlFor="file-upload" className="custom-file-upload">
            Choose HTML File
          </label>
          <input
            type="file"
            id="file-upload"
            accept=".html"
            className="hidden"
            onChange={(e) => handleFileChange(e, setHtmlFile)}
            required
          />
        </div>
        <div>
          <label htmlFor="image-upload" className="custom-file-upload">
            Choose Image File
          </label>
          <input
            type="file"
            id="image-upload"
            accept=".svg, .jpg, .jpeg, .png"
            className="hidden"
            onChange={(e) => handleFileChange(e, setImageFile)}
            required
          />
        </div>

        <label className="text-lg font-semibold mb-1">
          App Description:
        </label>
        <textarea
          className="p-2 border rounded-md focus:outline-none focus:ring"
          value={appDescription}
          onChange={(e) => setAppDescription(e.target.value)}
          required
        />

        <div className="inline-flex items-center">
          <input
            type="checkbox"
            id="pinned"
            checked={pinned}
            onChange={() => setPinned(!pinned)}
            className="p-2 border rounded-md focus:outline-none focus:ring"
          />
          <label htmlFor="pinned" className="ml-2">
            Pinned when installed
          </label>
        </div>

        <div className="inline-flex items-center">
          <input
            type="checkbox"
            id="shortcut"
            checked={shortcut}
            onChange={() => setShortcut(!shortcut)}
            className="p-2 border rounded-md focus:outline-none focus:ring"
          />
          <label htmlFor="shortcut" className="ml-2">
            Shortcut when installed
          </label>
        </div>

        <button type="submit" className="button-main">
          Create App
        </button>
      </form>

      <p className="text-sm">{message}</p>
    </div>
  );
};

export default AppCreator;