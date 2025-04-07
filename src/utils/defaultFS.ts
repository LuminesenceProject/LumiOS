import { Folder, App, Panic } from "./types";
import image8 from "../assets/image8.jpeg";

interface DefaultFS {
    root: Folder;
}

interface Shortcut {
  name: string;
  svg: string;
}

const defaultFS: DefaultFS = {
    root: {
      type: "folder",
      date: new Date().toISOString(),
      permissions: true,
      children: {
        "Desktop": {
          type: "folder",
          date: new Date().toISOString(),
          permissions: true,
          children: {
            "FileExplorer": {
              type: "file",
              fileType: "shrt",
              content: JSON.stringify(<Shortcut>{
                name: "File Explorer",
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d='M448 480H64c-35.3 0-64-28.7-64-64V192H512V416c0 35.3-28.7 64-64 64zm64-320H0V96C0 60.7 28.7 32 64 32H192c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8H448c35.3 0 64 28.7 64 64z'/></svg>"
              }),
              date: new Date().toISOString(),
              permissions: false,
            },
            "AppStore": {
              type: "file",
              fileType: "shrt",
              content: JSON.stringify(<Shortcut>{
                name: "App Store",
                svg: "<svg viewBox='0 0 448 512' xmlns='http://www.w3.org/2000/svg' ><path d='M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z'/></svg>",
              }),
              date: new Date().toISOString(),
              permissions: false,
            }
          }
        },
        "Documents": {
          type: "folder",
          permissions: true,
          date: new Date().toISOString(),
          children: {
            "Test.txt": {
              type: "file",
              fileType: "txt",
              content: "hello world",
              date: new Date().toISOString(),
              permissions: false,
            },
            "High School Photos": {
              type: "folder",
              permissions: false,
              date: new Date().toISOString(),
              children: {
                "Did you really expect this?": {
                  type: "file",
                  fileType: "txt",
                  content: "Naw actually this is crazy",
                  date: new Date().toISOString(),
                  permissions: false,
                }
              },
            },
          },
        },
        "Apps": {
          type: "folder",
          date: new Date().toISOString(),
          permissions: true,
          children: {
            "Settings": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "Settings",
                description: "Change or customize the settings for all of LumiOS.",
                userInstalled: false,
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z'/></svg>",
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "AppStore": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "App Store",
                description: "Download from over 200+ games or plugins.",
                userInstalled: false,
                svg: "<svg viewBox='0 0 448 512' xmlns='http://www.w3.org/2000/svg' ><path d='M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z'/></svg>",
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "InstalledApps": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "Installed Apps",
                description: "Displays a list of every app for LumiOS.",
                userInstalled: false,
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 384 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d='M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM72 272a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm104-16H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16s7.2-16 16-16zM72 368a24 24 0 1 1 48 0 24 24 0 1 1 -48 0zm88 0c0-8.8 7.2-16 16-16H304c8.8 0 16 7.2 16 16s-7.2 16-16 16H176c-8.8 0-16-7.2-16-16z'/></svg>",
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "Discord": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "Discord",
                description: "Messege your friends and talk to fellow users.",
                userInstalled: false,
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d='M524.5 69.8a1.5 1.5 0 0 0 -.8-.7A485.1 485.1 0 0 0 404.1 32a1.8 1.8 0 0 0 -1.9 .9 337.5 337.5 0 0 0 -14.9 30.6 447.8 447.8 0 0 0 -134.4 0 309.5 309.5 0 0 0 -15.1-30.6 1.9 1.9 0 0 0 -1.9-.9A483.7 483.7 0 0 0 116.1 69.1a1.7 1.7 0 0 0 -.8 .7C39.1 183.7 18.2 294.7 28.4 404.4a2 2 0 0 0 .8 1.4A487.7 487.7 0 0 0 176 479.9a1.9 1.9 0 0 0 2.1-.7A348.2 348.2 0 0 0 208.1 430.4a1.9 1.9 0 0 0 -1-2.6 321.2 321.2 0 0 1 -45.9-21.9 1.9 1.9 0 0 1 -.2-3.1c3.1-2.3 6.2-4.7 9.1-7.1a1.8 1.8 0 0 1 1.9-.3c96.2 43.9 200.4 43.9 295.5 0a1.8 1.8 0 0 1 1.9 .2c2.9 2.4 6 4.9 9.1 7.2a1.9 1.9 0 0 1 -.2 3.1 301.4 301.4 0 0 1 -45.9 21.8 1.9 1.9 0 0 0 -1 2.6 391.1 391.1 0 0 0 30 48.8 1.9 1.9 0 0 0 2.1 .7A486 486 0 0 0 610.7 405.7a1.9 1.9 0 0 0 .8-1.4C623.7 277.6 590.9 167.5 524.5 69.8zM222.5 337.6c-29 0-52.8-26.6-52.8-59.2S193.1 219.1 222.5 219.1c29.7 0 53.3 26.8 52.8 59.2C275.3 311 251.9 337.6 222.5 337.6zm195.4 0c-29 0-52.8-26.6-52.8-59.2S388.4 219.1 417.9 219.1c29.7 0 53.3 26.8 52.8 59.2C470.7 311 447.5 337.6 417.9 337.6z'/></svg>"
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "Terminal": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "Terminal",
                description: "Run commands in javascript or directly modify the file system.",
                userInstalled: false,
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d='M9.4 86.6C-3.1 74.1-3.1 53.9 9.4 41.4s32.8-12.5 45.3 0l192 192c12.5 12.5 12.5 32.8 0 45.3l-192 192c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3L178.7 256 9.4 86.6zM256 416H544c17.7 0 32 14.3 32 32s-14.3 32-32 32H256c-17.7 0-32-14.3-32-32s14.3-32 32-32z'/></svg>",
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "FileExplorer": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "File Explorer",
                description: "Add or directly modify the filesystem.",
                userInstalled: false,
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d='M448 480H64c-35.3 0-64-28.7-64-64V192H512V416c0 35.3-28.7 64-64 64zm64-320H0V96C0 60.7 28.7 32 64 32H192c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8H448c35.3 0 64 28.7 64 64z'/></svg>"
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "AppCreator": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "App Creator",
                description: "Add or create your own custom app.",
                userInstalled: false,
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d='M512 416c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V96C0 60.7 28.7 32 64 32H192c20.1 0 39.1 9.5 51.2 25.6l19.2 25.6c6 8.1 15.5 12.8 25.6 12.8H448c35.3 0 64 28.7 64 64V416zM232 376c0 13.3 10.7 24 24 24s24-10.7 24-24V312h64c13.3 0 24-10.7 24-24s-10.7-24-24-24H280V200c0-13.3-10.7-24-24-24s-24 10.7-24 24v64H168c-13.3 0-24 10.7-24 24s10.7 24 24 24h64v64z'/></svg>"
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "FileViewer": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "File Viewer",
                description: "Add or create your own custom app.",
                userInstalled: false,
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 576 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d='M288 32c-80.8 0-145.5 36.8-192.6 80.6C48.6 156 17.3 208 2.5 243.7c-3.3 7.9-3.3 16.7 0 24.6C17.3 304 48.6 356 95.4 399.4C142.5 443.2 207.2 480 288 480s145.5-36.8 192.6-80.6c46.8-43.5 78.1-95.4 93-131.1c3.3-7.9 3.3-16.7 0-24.6c-14.9-35.7-46.2-87.7-93-131.1C433.5 68.8 368.8 32 288 32zM144 256a144 144 0 1 1 288 0 144 144 0 1 1 -288 0zm144-64c0 35.3-28.7 64-64 64c-7.1 0-13.9-1.2-20.3-3.3c-5.5-1.8-11.9 1.6-11.7 7.4c.3 6.9 1.3 13.8 3.2 20.7c13.7 51.2 66.4 81.6 117.6 67.9s81.6-66.4 67.9-117.6c-11.1-41.5-47.8-69.4-88.6-71.1c-5.8-.2-9.2 6.1-7.4 11.7c2.1 6.4 3.3 13.2 3.3 20.3z'/></svg>"
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "Browser": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "Browser",
                description: "Search the web unblocked.",
                userInstalled: false,
                svg: "<svg viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns' fill='#000000'><g stroke-width='0'></g><g stroke-linecap='round' stroke-linejoin='round'></g><g> <title>browser</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g sketch:type='MSLayerGroup' transform='translate(-258.000000, -673.000000)' fill='#000000'> <path d='M258,701 C258,703.209 259.791,705 262,705 L286,705 C288.209,705 290,703.209 290,701 L290,683 L258,683 L258,701 L258,701 Z M271,679 C270.448,679 270,678.553 270,678 C270,677.448 270.448,677 271,677 C271.552,677 272,677.448 272,678 C272,678.553 271.552,679 271,679 L271,679 Z M267,679 C266.448,679 266,678.553 266,678 C266,677.448 266.448,677 267,677 C267.552,677 268,677.448 268,678 C268,678.553 267.552,679 267,679 L267,679 Z M263,679 C262.448,679 262,678.553 262,678 C262,677.448 262.448,677 263,677 C263.552,677 264,677.448 264,678 C264,678.553 263.552,679 263,679 L263,679 Z M286,673 L262,673 C259.791,673 258,674.791 258,677 L258,681 L290,681 L290,677 C290,674.791 288.209,673 286,673 L286,673 Z' id='browser' sketch:type='MSShapeGroup'> </path> </g> </g> </g></svg>"
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "TaskManager": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "Task Manager",
                description: "Access apps and functions.",
                userInstalled: false,
                svg: "<svg fill='#000000' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' viewBox='0 0 512 512' xml:space='preserve'><g stroke-width='0'></g><g stroke-linecap='round' stroke-linejoin='round'></g><g> <g> <g> <g> <path d='M490.667,0H21.333C9.551,0,0,9.551,0,21.333v469.333C0,502.449,9.551,512,21.333,512h469.333 c11.782,0,21.333-9.551,21.333-21.333V21.333C512,9.551,502.449,0,490.667,0z M469.333,469.333H42.667V42.667h426.667V469.333z'></path> <path d='M106.667,384H128v21.333c0,11.782,9.551,21.333,21.333,21.333c11.782,0,21.333-9.551,21.333-21.333V384H192 c11.782,0,21.333-9.551,21.333-21.333v-128c0-11.782-9.551-21.333-21.333-21.333h-21.333V106.667 c0-11.782-9.551-21.333-21.333-21.333c-11.782,0-21.333,9.551-21.333,21.333v106.667h-21.333 c-11.782,0-21.333,9.551-21.333,21.333v128C85.333,374.449,94.885,384,106.667,384z M128,256h42.667v85.333H128V256z'></path> <path d='M320,298.667h21.333v106.667c0,11.782,9.551,21.333,21.333,21.333S384,417.115,384,405.333V298.667h21.333 c11.782,0,21.333-9.551,21.333-21.333v-128c0-11.782-9.551-21.333-21.333-21.333H384v-21.333 c0-11.782-9.551-21.333-21.333-21.333s-21.333,9.551-21.333,21.333V128H320c-11.782,0-21.333,9.551-21.333,21.333v128 C298.667,289.115,308.218,298.667,320,298.667z M341.333,170.667H384V256h-42.667V170.667z'></path> </g> </g> </g> </g></svg>"
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "Webtools": {
              type: "file",
              fileType: "app",
              content: JSON.stringify(<App>{
                name: "Web Tools",
                description: "Access this and other webpage tools using eruda.",
                userInstalled: false,
                svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 640 512'><!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d='M308.5 135.3c7.1-6.3 9.9-16.2 6.2-25c-2.3-5.3-4.8-10.5-7.6-15.5L304 89.4c-3-5-6.3-9.9-9.8-14.6c-5.7-7.6-15.7-10.1-24.7-7.1l-28.2 9.3c-10.7-8.8-23-16-36.2-20.9L199 27.1c-1.9-9.3-9.1-16.7-18.5-17.8C173.9 8.4 167.2 8 160.4 8h-.7c-6.8 0-13.5 .4-20.1 1.2c-9.4 1.1-16.6 8.6-18.5 17.8L115 56.1c-13.3 5-25.5 12.1-36.2 20.9L50.5 67.8c-9-3-19-.5-24.7 7.1c-3.5 4.7-6.8 9.6-9.9 14.6l-3 5.3c-2.8 5-5.3 10.2-7.6 15.6c-3.7 8.7-.9 18.6 6.2 25l22.2 19.8C32.6 161.9 32 168.9 32 176s.6 14.1 1.7 20.9L11.5 216.7c-7.1 6.3-9.9 16.2-6.2 25c2.3 5.3 4.8 10.5 7.6 15.6l3 5.2c3 5.1 6.3 9.9 9.9 14.6c5.7 7.6 15.7 10.1 24.7 7.1l28.2-9.3c10.7 8.8 23 16 36.2 20.9l6.1 29.1c1.9 9.3 9.1 16.7 18.5 17.8c6.7 .8 13.5 1.2 20.4 1.2s13.7-.4 20.4-1.2c9.4-1.1 16.6-8.6 18.5-17.8l6.1-29.1c13.3-5 25.5-12.1 36.2-20.9l28.2 9.3c9 3 19 .5 24.7-7.1c3.5-4.7 6.8-9.5 9.8-14.6l3.1-5.4c2.8-5 5.3-10.2 7.6-15.5c3.7-8.7 .9-18.6-6.2-25l-22.2-19.8c1.1-6.8 1.7-13.8 1.7-20.9s-.6-14.1-1.7-20.9l22.2-19.8zM112 176a48 48 0 1 1 96 0 48 48 0 1 1 -96 0zM504.7 500.5c6.3 7.1 16.2 9.9 25 6.2c5.3-2.3 10.5-4.8 15.5-7.6l5.4-3.1c5-3 9.9-6.3 14.6-9.8c7.6-5.7 10.1-15.7 7.1-24.7l-9.3-28.2c8.8-10.7 16-23 20.9-36.2l29.1-6.1c9.3-1.9 16.7-9.1 17.8-18.5c.8-6.7 1.2-13.5 1.2-20.4s-.4-13.7-1.2-20.4c-1.1-9.4-8.6-16.6-17.8-18.5L583.9 307c-5-13.3-12.1-25.5-20.9-36.2l9.3-28.2c3-9 .5-19-7.1-24.7c-4.7-3.5-9.6-6.8-14.6-9.9l-5.3-3c-5-2.8-10.2-5.3-15.6-7.6c-8.7-3.7-18.6-.9-25 6.2l-19.8 22.2c-6.8-1.1-13.8-1.7-20.9-1.7s-14.1 .6-20.9 1.7l-19.8-22.2c-6.3-7.1-16.2-9.9-25-6.2c-5.3 2.3-10.5 4.8-15.6 7.6l-5.2 3c-5.1 3-9.9 6.3-14.6 9.9c-7.6 5.7-10.1 15.7-7.1 24.7l9.3 28.2c-8.8 10.7-16 23-20.9 36.2L315.1 313c-9.3 1.9-16.7 9.1-17.8 18.5c-.8 6.7-1.2 13.5-1.2 20.4s.4 13.7 1.2 20.4c1.1 9.4 8.6 16.6 17.8 18.5l29.1 6.1c5 13.3 12.1 25.5 20.9 36.2l-9.3 28.2c-3 9-.5 19 7.1 24.7c4.7 3.5 9.5 6.8 14.6 9.8l5.4 3.1c5 2.8 10.2 5.3 15.5 7.6c8.7 3.7 18.6 .9 25-6.2l19.8-22.2c6.8 1.1 13.8 1.7 20.9 1.7s14.1-.6 20.9-1.7l19.8 22.2zM464 304a48 48 0 1 1 0 96 48 48 0 1 1 0-96z'/></svg>",
              }),
              date: new Date().toISOString(),
              permissions: true,
            }
          },
        },
        "System": {
          type: "folder",
          date: new Date().toISOString(),
          permissions: true,
          children: {
            "Themes": {
              type: "folder",
              date: new Date().toISOString(),
              permissions: true,
              children: {
                blueTheme: {
                  type: "file",
                  fileType: "theme",
                  date: new Date().toISOString(),
                  permissions: true,
                  content: JSON.stringify({
                    primary: "#212529",
                    primaryLight: "#464f58",
                    secondary: "#2e79ba",
                    secondaryLight: "#5fc9f3",
                    textBase: "white",
                  }),
                },
                lightBlueTheme: {
                  type: "file",
                  fileType: "theme",
                  date: new Date().toISOString(),
                  permissions: true,
                  content: JSON.stringify({
                    primary: "#D2DAFF",
                    primaryLight: "#AAC4FF",
                    secondary: "#B1B2FF",
                    secondaryLight: "#AAC4FF",
                    textBase: "black",
                  }),
                },
                pinkTheme: {
                  type: "file",
                  fileType: "theme",
                  date: new Date().toISOString(),
                  permissions: true,
                  content: JSON.stringify({
                    primary: "#F9F5F6",
                    primaryLight: "#F8E8EE",
                    secondary: "#FDCEDF",
                    secondaryLight: "#F2BED1",
                    textBase: "black",
                  }),
                },
                purpleTheme: {
                  type: "file",
                  fileType: "theme",
                  date: new Date().toISOString(),
                  permissions: true,
                  content: JSON.stringify({
                    primary: "#927fbf",
                    primaryLight: "#c4bbf0",
                    secondary: "#363b4e",
                    secondaryLight: "#4f3b78",
                    textBase: "white",
                  }),
                },
                whiteTheme: {
                  type: "file",
                  fileType: "theme",
                  date: new Date().toISOString(),
                  permissions: true,
                  content: JSON.stringify({
                    primary: "#E8E8E8",
                    primaryLight: "#F4F4F2",
                    secondary: "#495464",
                    secondaryLight: "#BBBFCA",
                    textBase: "black",
                  }),
                },
                blackTheme: {
                  type: "file",
                  fileType: "theme",
                  date: new Date().toISOString(),
                  permissions: true,
                  content: JSON.stringify({
                    primary: "#212529",
                    primaryLight: "#464f58",
                    secondary: "#343A40",
                    secondaryLight: "#737f8c",
                    textBase: "white",
                  }),
                },
                greenTheme: {
                  type: "file",
                  fileType: "theme",
                  date: new Date().toISOString(),
                  permissions: true,
                  content: JSON.stringify({
                    primary: "#212529",
                    primaryLight: "#464f58",
                    secondary: "#00ad7c",
                    secondaryLight: "#52d681",
                    textBase: "white",
                  }),
                },
              }
            },
            "Users": {
              type: "folder",
              date: new Date().toISOString(),
              permissions: true,
              children: {
  
              }
            },
            "Plugins": {
              type: "folder",
              date: new Date().toISOString(),
              permissions: true,
              children: {
                "Window": {
                  type: "file",
                  fileType: "sys",
                  content: JSON.stringify({
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "brightness(75%)",
                    backdropBrightness: "75%",
                    color: "white",
                    cursor: "move",
                    borderTopLeftRadius: "0.275rem",
                  }),
                  date: new Date().toISOString(),
                  permissions: true,
                },
                "Scrollbar": {
                  type: "file",
                  fileType: "sys",
                  content: JSON.stringify(`::-webkit-scrollbar{height:1rem;width:.5rem}::-webkit-scrollbar:horizontal{height:.5rem;width:1rem}::-webkit-scrollbar-track{background-color:transparent;border-radius:9999px}::-webkit-scrollbar-thumb{--tw-border-opacity:1;background-color:hsla(0,0%,89%,.8);border-color:rgba(255,255,255,var(--tw-border-opacity));border-radius:9999px;border-width:1px}::-webkit-scrollbar-thumb:hover{--tw-bg-opacity:1;background-color:rgba(227,227,227,var(--tw-bg-opacity))}.dark ::-webkit-scrollbar-thumb{background-color:hsla(0,0%,100%,.1)}.dark ::-webkit-scrollbar-thumb:hover{background-color:hsla(0,0%,100%,.3)}@media (min-width:768px){.scrollbar-trigger ::-webkit-scrollbar-thumb{visibility:hidden}.scrollbar-trigger:hover ::-webkit-scrollbar-thumb{visibility:visible}}`),
                  date: new Date().toISOString(),
                  permissions: true,
                },
                "Startup": {
                  type: "file",
                  fileType: "sys",
                  content: "// startup scripts will run here",
                  date: new Date().toISOString(),
                  permissions: true,
                },
                "Taskbar": {
                  type: "file",
                  fileType: "sys",
                  content: "full",
                  date: new Date().toISOString(),
                  permissions: true,
                },
                "Positions": {
                  type: "folder",
                  children: {

                  },
                  date: new Date().toISOString(),
                  permissions: true,
                },
              },
            },
            "Taskbar": {
              type: "folder",
              date: new Date().toISOString(),
              permissions: true,
              children: {
                "Settings": {
                  type: "file",
                  fileType: "pinn",
                  content: JSON.stringify(<Shortcut>{
                    name: "Settings",
                    svg: "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 512 512'><path d='M495.9 166.6c3.2 8.7 .5 18.4-6.4 24.6l-43.3 39.4c1.1 8.3 1.7 16.8 1.7 25.4s-.6 17.1-1.7 25.4l43.3 39.4c6.9 6.2 9.6 15.9 6.4 24.6c-4.4 11.9-9.7 23.3-15.8 34.3l-4.7 8.1c-6.6 11-14 21.4-22.1 31.2c-5.9 7.2-15.7 9.6-24.5 6.8l-55.7-17.7c-13.4 10.3-28.2 18.9-44 25.4l-12.5 57.1c-2 9.1-9 16.3-18.2 17.8c-13.8 2.3-28 3.5-42.5 3.5s-28.7-1.2-42.5-3.5c-9.2-1.5-16.2-8.7-18.2-17.8l-12.5-57.1c-15.8-6.5-30.6-15.1-44-25.4L83.1 425.9c-8.8 2.8-18.6 .3-24.5-6.8c-8.1-9.8-15.5-20.2-22.1-31.2l-4.7-8.1c-6.1-11-11.4-22.4-15.8-34.3c-3.2-8.7-.5-18.4 6.4-24.6l43.3-39.4C64.6 273.1 64 264.6 64 256s.6-17.1 1.7-25.4L22.4 191.2c-6.9-6.2-9.6-15.9-6.4-24.6c4.4-11.9 9.7-23.3 15.8-34.3l4.7-8.1c6.6-11 14-21.4 22.1-31.2c5.9-7.2 15.7-9.6 24.5-6.8l55.7 17.7c13.4-10.3 28.2-18.9 44-25.4l12.5-57.1c2-9.1 9-16.3 18.2-17.8C227.3 1.2 241.5 0 256 0s28.7 1.2 42.5 3.5c9.2 1.5 16.2 8.7 18.2 17.8l12.5 57.1c15.8 6.5 30.6 15.1 44 25.4l55.7-17.7c8.8-2.8 18.6-.3 24.5 6.8c8.1 9.8 15.5 20.2 22.1 31.2l4.7 8.1c6.1 11 11.4 22.4 15.8 34.3zM256 336a80 80 0 1 0 0-160 80 80 0 1 0 0 160z'/></svg>",
                  }),
                  date: new Date().toISOString(),
                  permissions: false,
                },
                "AppStore": {
                  type: "file",
                  fileType: "app",
                  content: JSON.stringify(<Shortcut>{
                    name: "App Store",
                    svg: "<svg viewBox='0 0 448 512' xmlns='http://www.w3.org/2000/svg' ><path d='M160 112c0-35.3 28.7-64 64-64s64 28.7 64 64v48H160V112zm-48 48H48c-26.5 0-48 21.5-48 48V416c0 53 43 96 96 96H352c53 0 96-43 96-96V208c0-26.5-21.5-48-48-48H336V112C336 50.1 285.9 0 224 0S112 50.1 112 112v48zm24 48a24 24 0 1 1 0 48 24 24 0 1 1 0-48zm152 24a24 24 0 1 1 48 0 24 24 0 1 1 -48 0z'/></svg>",
                  }),
                  date: new Date().toISOString(),
                  permissions: false,
                },
                "Browser": {
                  type: "file",
                  fileType: "app",
                  content: JSON.stringify(<Shortcut>{
                    name: "Browser",
                    svg: "<svg viewBox='0 0 32 32' version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' xmlns:sketch='http://www.bohemiancoding.com/sketch/ns' fill='#000000'><g id='SVGRepo_bgCarrier' stroke-width='0'></g><g id='SVGRepo_tracerCarrier' stroke-linecap='round' stroke-linejoin='round'></g><g id='SVGRepo_iconCarrier'> <title>browser</title> <desc>Created with Sketch Beta.</desc> <defs> </defs> <g id='Page-1' stroke='none' stroke-width='1' fill='none' fill-rule='evenodd' sketch:type='MSPage'> <g id='Icon-Set-Filled' sketch:type='MSLayerGroup' transform='translate(-258.000000, -673.000000)' fill='#000000'> <path d='M258,701 C258,703.209 259.791,705 262,705 L286,705 C288.209,705 290,703.209 290,701 L290,683 L258,683 L258,701 L258,701 Z M271,679 C270.448,679 270,678.553 270,678 C270,677.448 270.448,677 271,677 C271.552,677 272,677.448 272,678 C272,678.553 271.552,679 271,679 L271,679 Z M267,679 C266.448,679 266,678.553 266,678 C266,677.448 266.448,677 267,677 C267.552,677 268,677.448 268,678 C268,678.553 267.552,679 267,679 L267,679 Z M263,679 C262.448,679 262,678.553 262,678 C262,677.448 262.448,677 263,677 C263.552,677 264,677.448 264,678 C264,678.553 263.552,679 263,679 L263,679 Z M286,673 L262,673 C259.791,673 258,674.791 258,677 L258,681 L290,681 L290,677 C290,674.791 288.209,673 286,673 L286,673 Z' id='browser' sketch:type='MSShapeGroup'> </path> </g> </g> </g></svg>"
                  }),
                  date: new Date().toISOString(),
                  permissions: false,
                },
              }
            },
            "Browser": {
              type: "folder",
              date: new Date().toISOString(),
              permissions: true,
              children: {
                "Links": {
                  type: "folder",
                  date: new Date().toISOString(),
                  permissions: true,
                  children: {

                  }
                },
                "Active": {
                  type: "file",
                  fileType: "sys",
                  date: new Date().toISOString(),
                  permissions: true,
                  content: "",
                }
              }
            },
            "AppStore": {
              type: "folder",
              date: new Date().toISOString(),
              permissions: true,
              children: {
                "Favorites": {
                  type: "folder",
                  date: new Date().toISOString(),
                  permissions: true,
                  children: {
                    
                  },
                },
                "Recents": {
                  type: "folder",
                  date: new Date().toISOString(),
                  permissions: true,
                  children: {

                  },
                },
              },
            },
            "Updates": { // Very important, tracks any updates, use Update type for file content
              type: "folder",
              date: new Date().toISOString(),
              permissions: true,
              children: {

              }
            },
            "Version": {
              type: "file",
              fileType: "sys",
              content: JSON.stringify({
                name: "Lumi OS",
                image: "https://avatars.githubusercontent.com/u/101959214?v=4",
                version: "10",
                secure: true,
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "Autologin": {
              type: "file",
              fileType: "sys",
              content: JSON.stringify(true),
              date: new Date().toISOString(),
              permissions: true,
            },
            "BackgroundImage": {
              type: "file",
              fileType: "sys",
              content: image8,
              date: new Date().toISOString(),
              permissions: true,
            },
            "Theme": {
              type: "file",
              fileType: "sys",
              content: JSON.stringify({
                primary: "#212529",
                primaryLight: "#464f58",
                secondary: "#343A40",
                secondaryLight: "#737f8c",
                textBase: "white",
              }),
              date: new Date().toISOString(),
              permissions: true,
            },
            "FirstStart": {
              type: "file",
              fileType: "sys",
              content: "true",
              date: new Date().toISOString(),
              permissions: true,
            },
            "ViewSystemFiles": {
              type: "file",
              fileType: "sys",
              content: "false",
              date: new Date().toISOString(),
              permissions: true,
            },
            "Panic": {
              type: "file",
              fileType: "sys",
              content: JSON.stringify(<Panic>{
                key: "\\",
                website: "https://google.com",
                title: "Lumi OS v10",
                favicon: "https://avatars.githubusercontent.com/u/101959214?v=4",
              }),
              date: new Date().toISOString(),
              permissions: true,
            }
          }
        },
      }
    }
};

export default defaultFS;