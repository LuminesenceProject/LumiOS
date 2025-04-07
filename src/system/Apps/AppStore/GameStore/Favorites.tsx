import { useEffect, useState } from "react";
import { Game } from "../../../../utils/types";
import GameList from "./GameList";
import virtualFS from "../../../../utils/VirtualFS";

interface FavoritesProps {
    setSelectedGame: (prev: Game) => void;
}

const Favorites: React.FC<FavoritesProps> = ({ setSelectedGame }) => {
    const [favorites, setFavorites] = useState<Game[]>([]);

    useEffect(() => {
        const fetchFavorites = async () => {
            const starredGames = Object.keys(await virtualFS.readdir("System/AppStore/Favorites/"));
            const link = "https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/Data.json";
            const fetchedGames = await fetch(link);
            const json: Game[] = await fetchedGames.json();

            const sortedFavorites = json.filter(value => starredGames.includes(value.name));
            setFavorites(sortedFavorites);
        };

        fetchFavorites();
    }, []);

    return favorites.length !== 0 && <GameList setSelectedGame={setSelectedGame} title="Favorites" sort="" games={favorites} bar={true}  />;
}
 
export default Favorites;