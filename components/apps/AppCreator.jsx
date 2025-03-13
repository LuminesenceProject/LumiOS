import React, { useEffect, useState } from "react";
import { addFileOrFolder } from "../Filesystem/indexedDB";
import { pushNotification } from "../Notifications/Notifications";
import version from "../../util/util";

const AppCreator = () => {
  const [appDescription, setAppDescription] = useState("");
  const [messege, setMessege] = useState("");
  const [currentUser, setCurrentUser] = useState({});
  const [htmlFile, setHtmlFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [pinned, setPinned] = useState(false);
  const [shortcut, setShortcut] = useState(false);

  useEffect(() => {
    // Get current user
    const crntusr = JSON.parse(localStorage.getItem("currentUser"));
    setCurrentUser(crntusr);
  }, []);

  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    setFile(file);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Upload HTML file to the "apps" folder
    if (htmlFile) {
      const htmlReader = new FileReader();
      htmlReader.onload = async () => {
        const htmlFileData = {
          name: htmlFile.name,
          content: htmlReader.result,
          type: "file",
          parentId: "apps",
        };
        await addFileOrFolder(htmlFileData);
      };
      htmlReader.readAsText(htmlFile);
    }

    // Upload Image file to the "apps" folder
    if (imageFile) {
      const imageReader = new FileReader();
      imageReader.onload = () => {
        const dataUrl = imageReader.result;
        const installedApps = JSON.parse(localStorage.getItem(currentUser.name + "installedApps")) || [];
        const pinnedApps = JSON.parse(localStorage.getItem(currentUser.name + "-pinned-apps")) || [];
        const shortcutApps = JSON.parse(localStorage.getItem(currentUser.name + "-shortcutted-apps")) || [];

        const newApp = {
          name: htmlFile.name,
          pinned: pinned,
          shortcut: shortcut,
          open: false,
          description: appDescription,
          svg: "",
          "user-installed": true,
          isUserHtml: true,
        };

        installedApps.push(newApp);

        if (pinned) {
          pinnedApps.push(newApp);
        }

        if (shortcut) {
          shortcutApps.push(newApp);
        }

        localStorage.setItem(currentUser.name + "installedApps", JSON.stringify(installedApps));
        localStorage.setItem(currentUser.name + "-pinned-apps", JSON.stringify(pinnedApps));
        localStorage.setItem(currentUser.name + "-shortcutted-apps", JSON.stringify(shortcutApps));

        setMessege(`${ htmlFile.name } was created successfully! `);
        pushNotification("AppCreator", `Your app was successfully created! Restart ${version.name} now to apply the changes.`, () => {window.location.reload()})
      };
      imageReader.readAsDataURL(imageFile);
    }
  };

  return (
    <div className="bg-primary text-text-base p-8">
      <form className="flex flex-col gap-4 max-w-md mx-auto p-6 bg-gray-100 rounded-md shadow-md bg-primary-light" onSubmit={handleFormSubmit}>
        <h3 className="font-bold text-2xl">App Creator</h3>
        <div>
          <label className="text-lg font-semibold mb-1" htmlFor="htmlFile">
            Select HTML file:
          </label>
          <input
            type="file"
            id="htmlFile"
            accept=".html"
            className="p-2 border rounded-md focus:outline-none focus:ring"
            onChange={(e) => handleFileChange(e, setHtmlFile)}
            required
          />
        </div>
        
        <div>
          <label className="text-lg font-semibold mb-1" htmlFor="imageFile">
            Select Image file:
          </label>
          <input
            type="file"
            id="imageFile"
            accept=".svg, .jpg, .jpeg, .png"
            className="p-2 border rounded-md focus:outline-none focus:ring"
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
          <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
            <input 
              type="checkbox"
              onChange={() => {
                setPinned(!pinned);
              }}
              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"/>
            <span
              className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"></path>
              </svg>
            </span>
          </label>
          <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="check">
            Pinned when installed
          </label>
        </div>
        <div className="inline-flex items-center">
          <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
            <input 
              type="checkbox"
              onChange={() => {
                setShortcut(!shortcut);
              }}
              className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"/>
            <span
              className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                stroke="currentColor" strokeWidth="1">
                <path fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"></path>
              </svg>
            </span>
          </label>
          <label class="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="check">
            Shortcut when installed
          </label>
        </div> 
        <button
          type="submit"
          className="button-main"
        >
          Create App
        </button>
      </form>
      <p className="text-sm">{ messege }</p>
    </div>
  );
};

export default AppCreator;