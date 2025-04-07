import { useEffect, useState } from "react";
import { Game } from "../../utils/types";

interface AppsProps {
    setCanContinue: (prev: boolean) => void;
}

const Apps: React.FC<AppsProps> = ({ setCanContinue }) => {
    const [games, setGames] = useState<Game[]>([]);

    useEffect(() => {
        const fetchGames = async () => {
            const link = "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Data.json";
            const fetchedGames = await fetch(link);
            const json: Game[] = await fetchedGames.json();
            
            setGames(json.slice(0, 5));
        };

        fetchGames();
        setCanContinue(true);
    }, []);

    return ( 
        <div className="flex flex-col w-full text-center px-10">
            <h3 className="my-2 font-bold text-xl">Find the game for you, by visiting our app store.</h3>
            <div
            className={`mr-0 ml-2 flex-game overflow-hidden flex-grow w-full`}
            style={{ width: '100%', overflowX: 'auto', position: 'relative' }}
            >            
            {games && games.map((game: Game, index: number) => {            
                    
                    const isFlash = game.type.includes("html");
                            
                    return (
                        <div
                            className={`card bg-black img__wrap flex justify-center cursor-pointer `}
                            key={index}
                        >
                            <img src={game.image} className="img__img object-cover image" alt="" loading="lazy" />
                            <div className={`${!isFlash ? "absolute opacity-100 inset-0 transition-opacity p-2 backdrop-blur backdrop-brightness-75" : "img__description_layer "}`}>
                            <h2 className="text-xl font-bold">{game.name}</h2>
                            <p className="text-base flex-grow">{game.description ? game.description.substring(0, 100) : "Click to play!"}</p>
                            <div className="absolute grid grid-cols-3 gap-2 h-[30px] bottom-0 bg-transparent text-[8px] font-bold">
                                <span className="bg-gray-800 p-1 rounded-lg flex items-center justify-center"></span>
                                <span className="bg-gray-800 p-1 rounded-lg flex items-center justify-center"></span>
                                <span className="bg-gray-800 p-1 rounded-lg flex items-center justify-center"></span>
                            </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>

    );
}
 
export default Apps;