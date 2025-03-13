import React, { useState } from "react";
import version from "../../util/util";

const JavascriptConsole = () => {
  const [stack, setStack] = useState([`OS [${version.version}]`, ""]);
  const [pwd, setPwd] = useState("quickAccess");
  const [command, setCommand] = useState("");
  const [lastCmd, setLsc] = useState(0);
  const [editingFile, setEditingFile] = useState(null);

  const cmdTool = async (cmd) => {
    var tmpStack = [...stack];
    tmpStack.push(pwd + ">" + cmd);
    var arr = cmd.split(" "),
      type = arr[0].trim().toLowerCase(),
      arg = arr.splice(1, arr.length).join(" ") || "";

    arg = arg.trim();

    if (type == "cls") {
      tmpStack = [];
    } else if (type == "echo") {
        tmpStack.push(arg);
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
        "CLS            Clears the screen.",
        "COLOR          Sets the default console foreground and background colors.",
        "DATE           Displays or sets the date.",
        "ECHO           Displays messages, or turns command echoing on or off.",
        `HELP           Provides Help information for ${ version.name } commands.`,
        "SYSTEMINFO     Displays machine specific properties and configuration.",
        "TIME           Displays or sets the system time.",
        `VER            Displays the ${ version.name } version.`,
      ];

      for (var i = 0; i < helpArr.length; i++) {
        tmpStack.push(helpArr[i]);
      }
    } else if (type == "ipconfig") {
      tmpStack.push("No, not yet!");
    } else {
      try {
        const func = eval(command);

        tmpStack.push(command);
        tmpStack.push(func);
      } catch (error) {
        tmpStack.push(version.name + " could not evaluate the code!");
        tmpStack.push("Are you sure its proper javascript?");
        tmpStack.push(" ");
        tmpStack.push(version.name + " found this error:");
        tmpStack.push(error?.message);
      }
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

  return (
      <div className="bg-primary text-text-base flex p-1" data-dock="true">
        <div className="h-full flex-grow">
          <div
            className="w-full box-border"
            id="cmdcont"
            onMouseOver={action}
            onClick={action}
            data-action="hover"
          >
            <div className="w-full h-max pb-12">
              {stack.map((x, i) => (
                <pre key={i}>
                  {x}
                </pre>
              ))}
              <div>
                {pwd}&gt;
                <div className="relative my-2"> 
                  <input
                  style={{ borderColor: "black", background: "transparent" }}
                  className="peer w-full h-full font-sans font-normal outline outline-0 focus:outline-0 disabled:border-0 transition-all placeholder-shown:border border focus:border-2 border-t-0 focus:border-t-0 text-sm px-3 py-2.5 rounded-[7px] text-text-base"
                  id="curcmd"
                  contentEditable
                  data-action="enter"
                  onKeyDown={action}
                  spellCheck="false"
                  onChange={(e) => setCommand(e.target.value)}
                  placeholder="" />
                  <label
                  style={{ color: "black" }}
                  className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate leading-tight peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-0 before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-0 after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-0 after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-0 peer-placeholder-shown:leading-[3.75] !text-white"><span className={`${"text-text-base" === "white" ? "invert" : ""} text-text-base`}>Enter Command</span>
                  </label>
                </div>
                {editingFile && textEditor(editingFile.content, (newContent) => setEditingFile({ ...editingFile, content: newContent }))}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default JavascriptConsole;