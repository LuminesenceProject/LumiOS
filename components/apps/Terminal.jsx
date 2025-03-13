import React, { useState, useEffect } from "react";
import { getFilesAndFolders, getAllItemsInFolder, addFileOrFolder, fetchFileContent } from "../Filesystem/indexedDB";
import version from "../../util/util";

const Terminal = () => {
  const [stack, setStack] = useState([`OS [${version.version}]`, ""]);
  const [pwd, setPwd] = useState("quickAccess");
  const [lastCmd, setLsc] = useState(0);
  const [editingFile, setEditingFile] = useState(null);
  const [terminalEnabled, setTerminalEnabled] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    const advancedSettings = JSON.parse(localStorage.getItem(currentUser.name + "advancedSettings"));

    setTerminalEnabled(advancedSettings?.terminal || false);
  }, [])

  const cmdTool = async (cmd) => {
    var tmpStack = [...stack];
    tmpStack.push(pwd + ">" + cmd);
    var arr = cmd.split(" "),
      type = arr[0].trim().toLowerCase(),
      arg = arr.splice(1, arr.length).join(" ") || "";

    arg = arg.trim();

    if (type == "echo") {
      if (arg.length) {
        tmpStack.push(arg);
      } else {
        tmpStack.push("ECHO is on.");
      }
    } else if (type == "eval") {
      if (arg.length) {
        tmpStack.push(eval(arg).toString());
      }
    } else if (type == "python") {
      if (arg.length) {
        if (window.pythonRunner) {
          var content = await window.pythonRunner.runCode(arg);
          if (window.pythonResult) {
            window.pythonResult.split("\n").forEach((x) => {
              if (x.trim().length) tmpStack.push(x);
            });
          }
        }
      }
    } else if (type === "cd") {
      const newPwd = await navigateDirectory(pwd, arg);
      if (newPwd) {
        setPwd(newPwd);
      } else {
        tmpStack.push(`The system cannot find the path specified: ${arg}`);
      }
    } else if (type === "ls") {
      try {
        const items = await getAllItemsInFolder(pwd);
    
        if (items && items.length > 0) {
          tmpStack.push(items.map(item => item.name + ", "));
        } else {
          tmpStack.push("No items were found in the current directory.");
        }
      } catch (error) {
        console.error("Error listing items:", error);
        tmpStack.push("An error occurred while listing items.");
      }
    } else if (type === "pwd") {
      tmpStack.push(pwd);
    } else if (type === "touch") {
      try {
        const file = await addFileOrFolder(arg);
      } catch (error) {
        tmpStack.push(`${arg} could not be created.`);
      }

    } else if (type === "nano") {
      const items = await getFilesAndFolders();

      if (items.find((item) => item.name === arg)) {
        // Open existing file for editing
        const content = await fetchFileContent(arg);
        setEditingFile({ name: arg, content });
      } else {
        // Create a new file for editing
        const newItem = await addFileOrFolder(arg);

        if (newItem) {
          setEditingFile({ name: newItem.name, content: "" });
        } else {
          tmpStack.push("Error creating file.");
        }
      }
    } else if (type == "cls") {
      tmpStack = [];
    } else if (type == "color") {
      let color = "#FFFFFF";
      let background = "#000000";
      let re = /^[A-Fa-f0-9]+$/g;
      if (!arg || (arg.length < 3 && re.test(arg))) {
        if (arg.length == 2) {
          color = colorCode(arg[1]);
          background = colorCode(arg[0]);
        } else if (arg.length == 1) {
          color = colorCode(arg[0]);
        }

        //set background color of the element id cmdCont
        var cmdcont = document.getElementById("cmdcont");
        cmdcont.style.backgroundColor = background;

        //set color of text of .cmdLine class
        cmdcont.style.color = color;
      } else {
        tmpStack.push(
          "Set the color of the background and the text for the console.",
        );
        tmpStack.push("COLOR [arg]");
        tmpStack.push("arg\t\tSpecifies the color for the console output");
        tmpStack.push(
          "The color attribute is a combination of the following values:",
        );
        tmpStack.push("0\t\tBlack");
        tmpStack.push("1\t\tBlue");
        tmpStack.push("2\t\tGreen");
        tmpStack.push("3\t\tCyan");
        tmpStack.push("4\t\tRed");
        tmpStack.push("5\t\tMagenta");
        tmpStack.push("6\t\tBrown");
        tmpStack.push("7\t\tLight Gray");
        tmpStack.push("8\t\tDark Gray");
        tmpStack.push("9\t\tLight Blue");
        tmpStack.push("A\t\tLight Green");
        tmpStack.push("B\t\tLight Cyan");
        tmpStack.push("C\t\tLight Red");
        tmpStack.push("D\t\tLight Magenta");
        tmpStack.push("E\t\tYellow");
        tmpStack.push("F\t\tWhite");
        tmpStack.push("Example: COLOR 0a for black text on a green background");
      }
    } else if (type == "type") {
      var errp = true;



      if (errp) {
        tmpStack.push("The system cannot find the file specified.");
      }
    } else if (type == "start") {
      openApp(arg);
    } else if (type == "date") {
      tmpStack.push("The current date is: " + new Date().toLocaleDateString());
    } else if (type == "time") {
      tmpStack.push(
        "The current time is: " +
          new Date()
            .toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            })
            .replaceAll(":", ".") +
          "." +
          Math.floor(Math.random() * 100),
      );
    } else if (type == "hostname") {
      const host = localStorage.getItem("currentUser");
      tmpStack.push(host);
    } else if (type == "login") {
      tmpStack.push("started login");
    } else if (type == "lang-test") {
      tmpStack.push("French");
    } else if (type == "lumi") {
      tmpStack.push("Luminesence was here.");
    } else if (type == "dev") {
      tmpStack.push("https://github.com/LuminesenceProject/LumiOS/");
    } else if (type == "ver") {
      tmpStack.push(`OS [Version ${version?.version}]`);
    } else if (type == "systeminfo") {
      const host = localStorage.getItem("currentUser");
      var dvInfo = [
        `Host Name:                 ${host?.name}`,
        `OS Name:                   ${version?.name}`,
        `OS Version:                ${version?.version}`,
        "OS Manufacturer:           N/A",
        "OS Configuration:          Standalone Workstation",
        "OS Build Type:             Multiprocessor Free",
        `Registered Owner:          ${host?.name}`,
        "Registered Organization:   N/A",
        `Product ID:                ${Date.now()}`,
      ];

      for (var i = 0; i < dvInfo.length; i++) {
        tmpStack.push(dvInfo[i]);
      }
    } else if (type == "help") {
      var helpArr = [
        "CD             Displays the name of or changes the current directory.",
        "CLS            Clears the screen.",
        "COLOR          Sets the default console foreground and background colors.",
        "DATE           Displays or sets the date.",
        "DIR            Displays a list of files and subdirectories in a directory.",
        "ECHO           Displays messages, or turns command echoing on or off.",
        "EXIT           Quits the Terminal.lOS program (command interpreter).",
        `HELP           Provides Help information for ${ version.name } commands.`,
        "START          Starts a separate window to run a specified program or command.",
        "SYSTEMINFO     Displays machine specific properties and configuration.",
        "TIME           Displays or sets the system time.",
        "TITLE          Sets the window title for a Terminal.lOS session.",
        "TYPE           Displays the contents of a text file.",
        `VER            Displays the ${ version.name } version.`,
        "PYTHON         EXECUTE PYTHON CODE.",
        "EVAL           RUNS JavaScript statements.",
      ];

      for (var i = 0; i < helpArr.length; i++) {
        tmpStack.push(helpArr[i]);
      }
    } else if (type == "") {
    } else if (type == "ipconfig") {
      tmpStack.push("No, not yet!");
    } else {
      tmpStack.push(version.name + " could not evaluate the code!");
      tmpStack.push("Are you sure its proper javascript?");
      tmpStack.push(" ");
      tmpStack.push(version.name + " found this error:");
      tmpStack.push(`${type} does not exist. See help avalible commands.`);
    }

    if (type.length > 0) tmpStack.push("");
    setStack(tmpStack);
  };

  const colorCode = (color) => {
    let code = "#000000";
    /*
			0: Black
			1: Blue
			2: Green
			3: Cyan
			4: Red
			5: Magenta
			6: Brown
			7: Light Gray
			8: Dark Gray
			9: Light Blue
			A: Light Green
			B: Light Cyan
			C: Light Red
			D: Light Magenta
			E: Yellow
			F: White
		*/

    switch (color.toUpperCase()) {
      case "0":
        code = "#000000";
        break;
      case "1":
        code = "#0000AA";
        break;
      case "2":
        code = "#00AA00";
        break;
      case "3":
        code = "#00AAAA";
        break;
      case "4":
        code = "#AA0000";
        break;
      case "5":
        code = "#AA00AA";
        break;
      case "6":
        code = "#AA5500";
        break;
      case "7":
        code = "#AAAAAA";
        break;
      case "8":
        code = "#555555";
        break;
      case "9":
        code = "#5555FF";
        break;
      case "A":
        code = "#55FF55";
        break;
      case "B":
        code = "#55FFFF";
        break;
      case "C":
        code = "#FF5555";
        break;
      case "D":
        code = "#FF55FF";
        break;
      case "E":
        code = "#FFFF55";
        break;
      case "F":
        code = "#FFFFFF";
        break;
    }

    return code;
  };

  const action = (event) => {
    var cmdline = document.getElementById("curcmd");
    var action = event.target.dataset.action;

    if (cmdline) {
      if (action == "hover") {
        var crline = cmdline.parentNode;
        var cmdcont = document.getElementById("cmdcont");
        if (crline && cmdcont) {
          cmdcont.scrollTop = crline.offsetTop;
        }
        cmdline.focus();
      } else if (action == "enter") {
        if (event.key == "Enter") {
          event.preventDefault();
          var tmpStack = [...stack];
          var cmd = event.target.innerText.trim();
          event.target.innerText = "";
          setLsc(tmpStack.length + 1);
          cmdTool(cmd);
        } else if (event.key == "ArrowUp" || event.key == "ArrowDown") {
          event.preventDefault();
          var i = lastCmd + [1, -1][Number(event.key == "ArrowUp")];

          while (i >= 0 && i < stack.length) {
            if (stack[i].startsWith("C:\\") && stack[i].includes(">")) {
              var tp = stack[i].split(">");
              event.target.innerText = tp[1] || "";
              setLsc(i);
              break;
            }

            i += [1, -1][Number(event.key == "ArrowUp")];
          }

        } else if (event.key == "Tab") {

        }
      }
    }
  };

  const navigateDirectory = async (currentDir, targetDir) => {
    try {
      if (targetDir === '..') {
        // Navigate up one level
        const parentDir = currentDir.replace(/\\/g, '/').split('/').slice(0, -1).join('\\');
        return parentDir || null;
      }
  
      const itemsInFolder = await getAllItemsInFolder(currentDir);
      const matchingItem = itemsInFolder.find(item => item.name === targetDir);
  
      if (matchingItem) {
        if (matchingItem.type === 'folder') {
          return `${currentDir}\\${targetDir}`;
        } else {
          console.error(`${targetDir} is not a directory.`);
          return null;
        }
      } else {
        console.error(`The system cannot find the path specified: ${targetDir}`);
        return null;
      }
    } catch (error) {
      console.error("Error navigating directory:", error);
      return null;
    }
  };  

  const saveFile = async () => {
    if (editingFile) {
      await moveFile(editingFile.name, pwd);
      setEditingFile(null);
    }
  };
  
  return (
      <div className="bg-primary text-text-base flex" data-dock="true">
        {terminalEnabled ? (
          <div className="h-full flex-grow">
            <div
              className="w-full box-border overflow-y-scroll win11Scroll prtclk"
              id="cmdcont"
              onMouseOver={action}
              onClick={action}
              data-action="hover"
            >
              <div className="w-full h-max pb-12">
                {stack.map((x, i) => (
                  <pre key={i} className="cmdLine">
                    {x}
                  </pre>
                ))}
                <div className="cmdLine actmd">
                  {pwd}&gt;
                  <div
                    className="ipcmd"
                    id="curcmd"
                    contentEditable
                    data-action="enter"
                    onKeyDown={action}
                    spellCheck="false"
                  ></div>
                  {editingFile && textEditor(editingFile.content, (newContent) => setEditingFile({ ...editingFile, content: newContent }))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col gap-4 justify-center items-center p-4">
            <h3 className="font-bold text-2xl">Admin Needed</h3>
            <p className=" font-extralight text-sm">You need admin permisions to enable terminal in settings.</p>
          </div>
        )}

      </div>
  );
};

export default Terminal;