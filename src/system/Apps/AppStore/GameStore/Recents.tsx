import { useEffect, useState } from "react";
import { Game } from "../../../../utils/types";
import GameList from "./GameList";
import virtualFS from "../../../../utils/VirtualFS";

interface RecentProps {
    setSelectedGame: (prev: Game) => void;
}

const Recents: React.FC<RecentProps> = ({ setSelectedGame }) => {
    const [recents, setRecents] = useState<Game[]>([]);

    useEffect(() => {
        const fetchRecents = async () => {
            const recentGames = Object.keys(await virtualFS.readdir("System/AppStore/Recents/"));
            const link = "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Data.json";
            const fetchedGames = await fetch(link);
            const json: Game[] = await fetchedGames.json();

            const sortedFavorites = json.filter(value => recentGames.includes(value.name));
            setRecents(sortedFavorites);
        };

        fetchRecents();
    }, []);

    return recents.length !== 0 && <GameList setSelectedGame={setSelectedGame} title="Recents" sort="" games={recents} bar={true}  />;
}
 
export default Recents;