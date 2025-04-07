import { useState } from "react";
import { useContextMenu } from "../../../ContextMenu/useContextMenu";
import { Game } from "../../../../utils/types";
import ContextMenu from "../../../ContextMenu/ContextMenu";
import virtualFS from "../../../../utils/VirtualFS";

interface GameListProps {
    title: string;
    sort: string;
    bar?: boolean;
    games: Array<Game>;
    setFlexProp?: (prev: boolean) => void;
    setSelectedGame: (prev: Game) => void;
}

const handleAppInstall = async (game: Game) => {        
    const fetchedContent = await fetch(game.path);
    let fileContent: string;

    if (game.path.endsWith("swf")) {
        fileContent = game.path;         
        await virtualFS.writeFile("Apps/", game.name, JSON.stringify({
            name: game.name,
            description: "blah blah blah",
            userInstalled: true,
            svg: game.image,
            fileContent: fileContent,
        }), game.type);
        await virtualFS.writeFile("System/Taskbar/", game.name, JSON.stringify({        name: game.name,
            svg: game.image,}), "pinn");        
    } else {
        await virtualFS.initialize();
        await fetchedContent.text().then(async (text) => {
            await virtualFS.writeFile("Apps/", game.name, JSON.stringify({
                name: game.name,
                description: "blah blah blah",
                userInstalled: true,
                svg: game.image,
                fileContent: text,
            }), game.type);
            await virtualFS.writeFile("System/Taskbar/", game.name, JSON.stringify({        name: game.name,
                svg: game.image,}), "pinn");
                console.log(await virtualFS.readdir("Apps/"));

        });
    }
}


const GameList: React.FC<GameListProps> = ({ title, sort, bar, games, setSelectedGame }) => {
    const [flex, setFlex] = useState(false);
    const [updatedMenuPosition, setUpdatedMenuPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
    const { menuVisible, menuActions, showMenu, hideMenu } = useContextMenu();

    const handleGameContextMenu = (event: React.MouseEvent<HTMLDivElement>, game: Game) => {
        event.preventDefault();

        // Get the position relative to the window
        const x = event.clientX;
        const y = event.clientY;
    
        // Get the bounding client rect of the parent component
        const rect = document.getElementById("gamecontainer");
        const bounds = rect?.getBoundingClientRect();
    
        if (bounds) {
            // Calculate the relative position within the bounding rectangle
            const relativeX = x - bounds.left;
            const relativeY = y - bounds.top;
    
            // Update the state variable with the adjusted menu position
            setUpdatedMenuPosition({ x: relativeX, y: relativeY });
        }

        showMenu(event, JSON.stringify(game), {
            "Install App": async () => {
                handleAppInstall(game);
                hideMenu();
            }
        });

        event.stopPropagation();
    }

    return (
<div
    style={{
        background: bar
        ? 'linear-gradient(to bottom, rgba(128, 0, 128, 0.8), rgba(128, 0, 128, 0))'
        : 'none', // Or any other background if `bar` is false
        height: '100%', // Ensure it fills the container height
        width: '100%',  // Ensure it fills the container width
        padding: bar ? '8px' : ''
    }}
>
        <h3 className="font-bold text-xl my-2">{ title }</h3>
        <div
        className={`mx-2 ${flex ? 'flex-game' : 'container-game'} overflow-hidden px-2`}
        style={{ width: '100%', overflowX: 'auto', position: 'relative' }}
        id="gamecontainer"
      >
        {games && games
            .filter((game: Game) => (sort === "" || game?.types?.includes(sort)) || sort === "All Games")
            .map((game: Game, index: number) => {            
            
            const isFlash = game.type.includes("html");
                    
            return (
                <div
                    className={`card bg-black img__wrap flex justify-center cursor-pointer ${flex && 'flex-shrink-0'}`}
                    onClick={() => setSelectedGame(game)}
                    key={index}
                >
                    <img src={game.image} className="img__img object-cover image" alt="" loading="lazy" />
                    <div className={`${!isFlash ? "absolute opacity-100 inset-0 transition-opacity p-2 backdrop-blur backdrop-brightness-75" : "img__description_layer "}`}>
                    <h2 className="text-xl font-bold">{game.name}</h2>
                    <p className="text-base flex-grow">{game.description ? `${game.description.substring(0, 100)}...` : "Click to play!"}</p>
                    <div className="absolute grid grid-cols-3 gap-2 h-[30px] bottom-0 bg-transparent text-[8px] font-bold">
                        <span className="bg-gray-800 p-1 rounded-lg flex items-center justify-center"></span>
                        <span className="bg-gray-800 p-1 rounded-lg flex items-center justify-center"></span>
                        <span className="bg-gray-800 p-1 rounded-lg flex items-center justify-center"></span>
                    </div>
                    </div>
                </div>
            )
        })}
        {menuVisible && (
            <ContextMenu menuPosition={updatedMenuPosition} menuActions={menuActions} hideMenu={hideMenu} />
        )}
        </div>
        </div>

     );
}
 
export default GameList;

//(prev: any[]) => [...prev, { title: game.name, description: "Do you want to install this app?", onConfirm:() => handleAppInstall(game), game: game }])