import React from 'react';
import Settings from "./Settings/Settings";
import AppStore from './AppStore/AppStore';
import InstalledApps from './AppStore/InstalledApps';
import HTMLFileViewer from './HTML/HTMLFileViewer';
import Discord from './Discord/Discord';
import AppCreator from './AppCreator/AppCreator';
import Terminal from './Terminal/Terminal';
import FileExplorer from './FileSystem/FileExplorer';
import FileViewer from './FileSystem/FileViewer';
import Browser from './Browser/Browser';
import Notepad from './OptionalApps/Notepad/Notepad';
import Calculator from './OptionalApps/Calculator/Calculator';
import Taskmanager from './Taskmanager/Taskmanager';
import LocalStorageViewer from './OptionalApps/Localstorage/Localstorage';
import Webtools from './Webtools/Webtools';

// Define the types for your components
type ComponentType = React.FC<any> | React.ComponentClass<any, any>;

// Create an array of React components
const components: { [key: string]: ComponentType } = {
  "Settings": Settings,
  "AppStore": AppStore,
  "InstalledApps": InstalledApps,
  "HTMLFileViewer": HTMLFileViewer,
  "Discord": Discord,
  "FileExplorer": FileExplorer,
  "AppCreator": AppCreator,
  "Terminal": Terminal,
  "FileViewer": FileViewer,
  "Browser": Browser,
  "Notepad": Notepad,
  "Calculator": Calculator,
  "TaskManager": Taskmanager,
  "LocalstorageViewer": LocalStorageViewer,
  "Webtools": Webtools,
};

export default components;