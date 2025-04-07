import { useEffect, useRef, useState } from "react";
import { Game } from "../../../../utils/types";
import Button from "../../../../structures/Button";

interface RandomGameProps {
    games: Array<Game>;
    setSelectedGame: (game: Game) => void;
}

const RandomGame: React.FC<RandomGameProps> = ({ games, setSelectedGame }) => {
    const [randomButton, setRandomButton] = useState(true);
    const [randomGame, setRandomGame] = useState<Game>();
    const [isCycling, setIsCycling] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        startCycling();
    }, []);

    useEffect(() => {
        if (isCycling) {
            startCycling();
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isCycling]);

    const startCycling = () => {
        intervalRef.current = setInterval(() => {
            const randomItem = games[Math.floor(Math.random() * games.length)];
            setRandomGame(randomItem);
        }, 100); // Change image every 200ms

        setTimeout(() => {
            setIsCycling(false); // Stop cycling after 2 seconds
            setRandomButton(false); // Make button visible
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }, 2000); // Duration of cycling
    };

    const handleRandomGameClick = () => {
        if (isCycling) {
            setIsCycling(false);
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        } else {
            setIsCycling(true);
            setRandomButton(true); // Reset button state
        }
    };

    return (
        <div className="h-full gap-10 flex flex-col justify-center items-center basis-full text-center z-10 my-4">
            <div className="relative group group-hover:visible w-fit max-w-full min-w-[50%] h-[500px] bg-contain object-contain z-20"> 
                <div className="absolute z-20 w-full h-full px-5 flex flex-col justify-center items-center backdrop-blur rounded">
                <h3 className="text-3xl font-bold justify-start items-start top-0 absolute py-4">Find your next game!</h3>
                    <h3 className="text-2xl font-bold">{randomGame?.name}</h3>
                    <div className="flex flex-row gap-2 items-center justify-center my-2">
                        <Button onClick={() => setSelectedGame(randomGame)}>Play Now</Button>
                        <Button
                            onClick={handleRandomGameClick}
                            className="transition ease-in hover:bg-blue-400 hover:scale-105"
                        >
                            {isCycling ? "Stop" : "Random Game"}
                        </Button>
                    </div>
                </div>
                <img
                    className="w-full h-full bg-black brightness-50 rounded-lg object-contain"
                    src={randomGame?.image}
                    alt=""
                />
            </div>
        </div>
    );
};

export default RandomGame;