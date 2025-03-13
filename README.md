<div align="center">

# Lumi OS

### Join the Discord!
[![Discord](https://raw.githubusercontent.com/LuminesenceProject/LumiOS/refs/heads/main/images/discord.png)](https://discord.gg/TyacaNY3GK)

Lumi OS is a React-Typescript operating system, offering a wide range of features that allow users to interact locally or on a server.

</div>

## Features

- Themes, plugins, and more
- Over 200+ games
- Constant updates
- Fully functional file system
- Built-in text editor

## Downloading

Lumi OS can be run locally, so click on this [link](https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/LumiOS.v12.1.html) in order to download the file. It can also be downloaded as an about:blank page.
- Can I run Lumi OS off of my chromebook?
	> Yes, Lumi OS can be run from local files.
- How do I know when to update my file?
	> There will be a popup notifying the user of an update.
- Why won't my changes be saved?
	> Selecting any other file besides the one opened will break it.

## Bookmarklet

Paste the following code into your bookmark bar and click it to run Lumi OS on any website.
```
javascript:(function(){(async () => {/** BUILT FOR LUMI OS NOVEMBER 17th 2024*/const fetchLink = "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/refs/heads/main/Info.json";try {const response = await fetch(fetchLink);if (!response.ok) throw new Error('Failed to fetch Info.json');const fetched = await response.json();const version = fetched[0]?.version;if (!version) throw new Error('Version not found in Info.json');const downloadLink = https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/LumiOS.v${version}.html;const fileResponse = await fetch(downloadLink);if (!fileResponse.ok) throw new Error('Failed to fetch the versioned file');const content = await fileResponse.text();const popupWindow = window.open('', '_blank', 'width=800,height=600');if (!popupWindow) throw new Error("Popup window couldn't be opened. Please check your browser settings.");popupWindow.document.open();popupWindow.document.write(content);popupWindow.document.close();} catch (error) {console.error('Error:', error.message);}})();})()
```

## Contributing

This repository will be open-source soon.  
Games have been moved to a separate repository, which can be found [here](https://github.com/LuminesenceProject/lumi-games).  
When adding games, please ensure you include an image.

Note: Some feature suggestions may not be added, especially those that rely on external servers, as it could disrupt the ability to use Lumi OS offline.

**Contributors** will be credited in this repository.

## Issues

To report an issue, please open a new one on the [GitHub Issues page](https://github.com/LuminesenceProject/LumiOS/issues) and click 'New Issue'.

### Common Issues & Solutions

- **White Screen Error:**  
  This is a common error. To resolve it, type `"lumiplus"` in the exact order, and it will clear all data stored. This solution works in version 4.2 and above of Lumi OS.

Please provide a screenshot or error message if possible.

## Todo

- Release source code
- Remove redundant features
- Release new websites for accessing Lumi OS
- Add more games?

## Terms of Use

By downloading or using this code, you agree to the terms, conditions, and license specified in the **MAIN** branch.

### Modification and Redistribution  
If this code is modified and redistributed, the following conditions must be met:  
- All modifications must be clearly disclosed to the user on the loading screen.  
- A direct link to the modified source code must be provided.
- You agree to all future versions of the terms  

### Notes  
This version will only receive updates for bug fixes and will not include new features or enhancements.

