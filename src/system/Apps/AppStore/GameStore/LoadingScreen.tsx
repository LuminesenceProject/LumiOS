import React from 'react';
import background from "../../../../assets/logo.jpeg";

const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black text-white">
            <div className="absolute inset-0 z-[-1]">
                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: background }}></div>
            </div>
            <div className="flex flex-col items-center">
                <div className="relative">
                    <div className="w-16 h-16 border-t-4 border-solid rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-xl font-semibold">Loading...</p>
            </div>
        </div>
    );
};

export default LoadingScreen;