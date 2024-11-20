<div align="center">

# Lumi OS

### Join the Discord!
[<img src="https://raw.githubusercontent.com/LuminesenceProject/LumiOS/refs/heads/main/images/discord.png" alt="Discord" style="width: 25%; height: 23.5%" />](https://discord.gg/TyacaNY3GK)

Lumi OS is a React-typescript operating system, with many different features,
letting the user interact locally, or on a server.
</div>

## Features

SOME ISSUES WITH CERTAIN BROWSERS MAY OCCUR
Firefox, Safari, and mobile devices will not work at the moment.

- Themes, plugins, and more
- Over 200+ games
- Constant updates
- Fully working file system
- Built-in text-editor

# Downloading

Lumi OS can be run locally, so click on this [link](https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/LumiOS.v10.html) in order to download the file. It can also be downloaded as an about:blank page.
- Can I run Lumi OS off of my chromebook?
	> Yes, Lumi OS can be run from local files.
- How do I know when to update my file?
	> There will be a popup notifying the user of an update.
- Why won't my changes be saved?
	> Selecting any other file besides the one opened will break it.

## Bookmarklet

Paste this into your bookmark bar, and click it to run it on a website.

```
javascript:(function()%7B(async () %3D> %7B%2F** BUILT FOR LUMI OS* NOVEMBER 17th 2024*%2Fconst fetchLink %3D "https%3A%2F%2Fraw.githubusercontent.com%2FLuminesenceProject%2FLumiOS%2Frefs%2Fheads%2Fmain%2FInfo.json"%3Btry %7Bconst response %3D await fetch(fetchLink)%3Bif (!response.ok) throw new Error('Failed to fetch Info.json')%3Bconst fetched %3D await response.json()%3Bconst version %3D fetched%5B0%5D%3F.version%3Bif (!version) throw new Error('Version not found in Info.json')%3Bconst downloadLink %3D %60https%3A%2F%2Fraw.githubusercontent.com%2FLuminesenceProject%2FLumiOS%2Fmain%2FLumiOS.v%24%7Bversion%7D.html%60%3Bconst fileResponse %3D await fetch(downloadLink)%3Bif (!fileResponse.ok) throw new Error('Failed to fetch the versioned file')%3Bconst content %3D await fileResponse.text()%3Bconst popupWindow %3D window.open(''%2C '_blank'%2C 'width%3D800%2Cheight%3D600')%3Bif (!popupWindow) throw new Error("Popup window couldn't be opened. Please check your browser settings.")%3BpopupWindow.document.open()%3BpopupWindow.document.write(content)%3BpopupWindow.document.close()%3B%7D catch (error) %7Bconsole.error('Error%3A'%2C error.message)%3B%7D%7D)()%7D)()
```

## Contributing
This respository will become open source shortly.
Games have been moved to a seperate repository, which can be found [here](https://github.com/LuminesenceProject/lumi-games).
When adding games, please make sure to include an image.

Sometimes features suggeseted will not be added.
This includes most things that have to involve an outside server, since it will ruin the functionality of being able to download
Lumi OS and use it anywhere.

You will be marked as **contributer** in this repository. 

## Issues

To report a problem, open the [issues](https://github.com/LuminesenceProject/LumiOS/issues) on the github page, and click 'New issue'

If you are facing a white screen, this is a common error.

### Built in solution
The easy solution is to simply type "lumiplus" in that exact order, and it will wipe all data stored.
This only works in v4.2 and above of lumi os.

Please try to provide a screenshot of the problem, or any error messege.

## Todo

- Release source code
- Remove redundant features
- Release new websites for accessing Lumi OS
- Add more games?

## Source Code

Cite the changes made within the loading screen.
