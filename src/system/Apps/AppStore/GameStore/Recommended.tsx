import { useState, useEffect } from "react";
import GameList from "./GameList";

interface RecommendedProps {
    exclude: string;
    setPrompts: (prev: any[]) => void;
    setSelectedGame: (prev: Game) => void;
}

const Recommended: React.FC<RecommendedProps> = ({ exclude, setPrompts, setSelectedGame }) => {
  const [data, setData] = useState([]);
  const [starred, setStarred] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    // Calculate recommendations when starred and recent games change.
    const calculateRecommendations = () => {
      // Calculate a score for each game based on the number of common types.
      const gamesWithScores = games.map((game) => {
        const commonTypes = game.types.filter((type) => starred.some((starredGame) => starredGame.types.includes(type)) || recent.some((recentGame) => recentGame.types.includes(type)));
        
        // Increase the score for games that have similar types to 'exclude'.
        const scoreMultiplier = type => (type === exclude ? 2 : 1);
        const score = commonTypes.reduce((totalScore, type) => totalScore + scoreMultiplier(type), 0);
        
        return { ...game, score };
      });

      // Exclude games based on the 'exclude' parameter.
      const filteredGames = gamesWithScores.filter((game) => game.types.includes(exclude));

      // Sort games by score in descending order.
      filteredGames.sort((a, b) => b.score - a.score);

      // Take the top 10 recommended games.
      const top10RecommendedGames = filteredGames.slice(0, 10);

      // Set the recommended games in the component state.
      setData(top10RecommendedGames);
    };

    calculateRecommendations();
  }, [starred, recent, exclude]);

  return (
    <div className="px-4">
      {exclude ? (
        <GameList games={data} title={`Because you love ${exclude} games`} setPrompts={setPrompts} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Recommended;