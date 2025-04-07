import { useEffect, useState } from "react";
import { Game } from "../../../../utils/types";
import RainbowButtonGrid from "./RainbowButtonGrid";
import GameList from "./GameList";
import Button from "../../../../structures/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Carousel from "./Carousel";
import Favorites from "./Favorites";
import Recents from "./Recents";
import RandomGame from "./RandomGame";

interface GamePageProps {
    selectedCatagory: string | null;
    setPrompts: (prev: any[]) => void;
    setSelectedGame: (prev: Game) => void;
    setSelectedCatagory: (prev: string | null) => void;
}

const GamePage: React.FC<GamePageProps> = ({ selectedCatagory, setPrompts, setSelectedGame, setSelectedCatagory }) => {
    const [games, setGames] = useState<Game[]>([]);
    const [randomGames, setRandomGames] = useState<Array<Game>>([]);

    useEffect(() => {
        const generateRandomGames = () => {
            const newRandomGames: Array<Game> = [];
            const allGames = [...games];

            while (newRandomGames.length < 5 && allGames.length > 0) {
                const randomIndex = Math.floor(Math.random() * allGames.length);
                const randomGame = allGames.splice(randomIndex, 1)[0];
                newRandomGames.push(randomGame);
            }

            setRandomGames(newRandomGames);
        };
        

        if (games.length > 0) {
            generateRandomGames();
        }
    }, [games]);

    useEffect(() => {
        const fetchGames = async () => {
            const link = "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Data.json";
            const fetchedGames = await fetch(link);
            const json: Game[] = await fetchedGames.json();
            
            setGames(json);
        }

        fetchGames();
    }, []);

    return ( 
    <div className="z-0 overflow-hidden">
    {selectedCatagory ? <>
        <div className="flex justify-between items-center my-2 px-4">
            <h3 className="font-bold text-xl pr-4">{ selectedCatagory }</h3>
            <Button onClick={() => setSelectedCatagory(null)}>Back <FontAwesomeIcon icon={faChevronLeft} /></Button>
        </div>
        <GameList title={""} games={games} sort={selectedCatagory} setSelectedGame={setSelectedGame} />
    </> :
        <div className="flex flex-col justify-center">
            <center className=" items-center p-2 items-center">
                <Carousel setSelectedGame={setSelectedGame} randomGames={randomGames} />
            </center>
            <Favorites setSelectedGame={setSelectedGame} />
            <Recents setSelectedGame={setSelectedGame} />
            <RainbowButtonGrid setSelectedCatagory={setSelectedCatagory} />
            <RandomGame games={games} setSelectedGame={setSelectedGame} />
            <Button className="my-10 w-fit self-center bg-secondary" onClick={() => setSelectedCatagory("All Games")}>All Games</Button>
        </div>
        }
    </div>
    );
}
 
export default GamePage;