import { useEffect } from "react";
import logo from "../../assets/no-bg-logo.png";

interface WelcomeProps {
    setCanContinue: (prev: boolean) => void;
}

const Welcome: React.FC<WelcomeProps> = ({ setCanContinue }) => {
    useEffect(() => {
        setTimeout(() => {
            setCanContinue(true);
        }, 2000);
    }, []);

    return ( 
        <div className="flex flex-col justify-center items-center">
            <img src={logo} alt="logo" className="" />
            <h1 className="text-xl font-semibold">Welcome to LumiOS</h1>
            <h4 className="mb-4">All settings can be changed later.</h4>
            <p className="text-xs text-end" style={{ color: "gray" }}>By continuing, you agree to our <a href="https://github.com/LuminesenceProject/LumiOS" className="cursor-pointer" style={{ color: "lightblue" }}>terms and conditions.</a></p>
        </div>
    );
}
 
export default Welcome;