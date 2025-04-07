import { Game } from "../../../../utils/types";
import { useState } from "react";
import GameDescription from "./GameDescription";
import GamePage from "./GamePage";

interface GameStoreProps {
    setPrompts: (prev: any[]) => void;
}

const GameStore: React.FC<GameStoreProps> = ({ setPrompts }) => {
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [selectedCatagory, setSelectedCatagory] = useState<string | null>(null);

    return ( 
        <>
        {selectedGame ? 
        <GameDescription selectedGame={selectedGame} setSelectedGame={setSelectedGame} setSelectedCatagory={setSelectedCatagory} setPrompts={setPrompts} /> 
        :
        <>
        <GamePage setSelectedGame={setSelectedGame} setPrompts={setPrompts} selectedCatagory={selectedCatagory} setSelectedCatagory={setSelectedCatagory}  />
        </>
        }
        </>
    );
}
 
export default GameStore;