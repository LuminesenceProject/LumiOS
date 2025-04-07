import { useEffect } from "react";
import logo from "../../assets/no-bg-logo.png";

interface EndscreenProps {
    setCanContinue: (prev: boolean) => void;
}

const Endscreen: React.FC<EndscreenProps> = ({ setCanContinue }) => {
    useEffect(() => {
        setCanContinue(true);
    }, []);
    
    return ( 
        <div className="flex flex-col justify-center items-center">
            <img src={logo} alt="logo" className="" />
            <h1 className="text-xl font-semibold">Setup is finished!</h1>
            <p className="text-xs">Thank you for choosing LumiOS.</p>
        </div>
    );
}
 
export default Endscreen;