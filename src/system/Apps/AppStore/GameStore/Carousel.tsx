import { useState, useEffect } from "react";
import { Game } from "../../../../utils/types";

interface CarouselProps {
  randomGames: Array<Game>;
  setSelectedGame: (prev: Game) => void;
}

const Carousel: React.FC<CarouselProps> = ({ setSelectedGame, randomGames }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  useEffect(() => {
    // Preload images in the background
    const preloadImages = () => {
      const imagePromises = randomGames.map((game: Game) => {
        return new Promise((resolve) => {
          const img = new Image();
          img.onload = resolve;
          img.src = game.image;
        });
      });

      Promise.all(imagePromises).then(() => {
        setIsImagesLoaded(true);
      });
    };

    if (randomGames.length > 0) {
      preloadImages();
    }
  }, [randomGames]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) =>
        prevIndex === randomGames.length - 1 ? 0 : prevIndex + 1
      );
    }, 8000);
  
    return () => clearInterval(interval);
  }, [randomGames]);

  const handleDotClick = (index: number) => {
    setActiveIndex(index);
  };

  const handlePrev = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === 0 ? randomGames.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) =>
      prevIndex === randomGames.length - 1 ? 0 : prevIndex + 1
    );
  };

  if (!isImagesLoaded) {
    return null; // Render nothing until images are loaded
  }

  return (
    <div className="relative h-[400px] group z-0 w-5/6" style={{ color: "white" }}>
      <button
        className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded z-30 hover:bg-opacity-70"
        onClick={handlePrev}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
      </button>
      <button
        className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded z-30 hover:bg-opacity-70"
        onClick={handleNext}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </button>
      <div className="relative h-full overflow-hidden">
        {randomGames.map((game: Game, index) => (
          <div
            key={index}
            className={`absolute inset-0 transform transition-transform duration-500 rounded-lg ${
              index === activeIndex ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <img
              className="w-full h-full object-cover rounded-lg blur-lg brightness-75 shadow"
              src={game.image}
              alt="Carousel Image"
            />
            <div className="absolute inset-0 bg-black opacity-50"></div>
            <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
              <h3 className="text-4xl font-bold">{game.name}</h3>
              <p className="text-lg px-8"></p>
              <button className="mt-4 p-2 rounded bg-gradient-to-br from-purple-400 to-purple-500" onClick={() => setSelectedGame(game)}>
                Play Now!
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="absolute bottom-0 left-0 right-0 flex justify-center mb-4 z-30">
        {randomGames.map((_, index) => (
          <button
            key={index}
            className={`h-2 w-2 mx-1 rounded-full ${
              index === activeIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
            onClick={() => handleDotClick(index)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Carousel;