import { useState } from "react";
import Button from "../Button";
import virtualFS from "../../utils/VirtualFS";

interface UserProps {
    setSignedIn: (prev: boolean) => void;
    setCanContinue: (prev: boolean) => void;
}

const User: React.FC<UserProps> = ({ setCanContinue, setSignedIn }) => {
    const [website, setWebsite] = useState<string>("https://google.com");
    const [panic, setPanic] = useState<string>("\\");
    const [title, setTitle] = useState<string>("Lumi OS v10");
    const [favicon, setFavicon] = useState<string>("https://avatars.githubusercontent.com/u/101959214?v=4");
    const [login, setLogin] = useState<boolean>(true);

    const handlePanicSettings = async () => {
        await virtualFS.initialize();
        await virtualFS.deleteFile("System/", "Panic");

        await virtualFS.writeFile("System/", "Panic", JSON.stringify({
            key: panic,
            website,
            title,
            favicon,
        }), "sys");

        if (!login) {
            await virtualFS.deleteFile("System/", "Autologin");

            await virtualFS.writeFile("System/", "Autologin", JSON.stringify(login), "sys");

            setSignedIn(false);
        }

        setCanContinue(true);
    };

    interface Cloak {
        name: string;
        link: string;
    }

    const handleCloakChange = (cloak: string) => {
        const parsed: Cloak = JSON.parse(cloak);

        setTitle(parsed.name);
        setFavicon(parsed.link);
    };

    // Built in cloaks
    const cloaks: Cloak[] = [
        {
            name: "Google",
            link: "https://google.com/favicon.ico",
        },
        {
            name: "Canvas",
            link: "https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico",
        },
        {
            name: "Desmos | Graphing Calculator",
            link: "https://www.desmos.com/assets/img/apps/graphing/favicon.ico",
        },
        {
            name: "My Drive - Google Drive",
            link: "https://ssl.gstatic.com/docs/doclist/images/drive_2022q3_32dp.png",
        },
        {
            name: "Classroom",
            link: "https://ssl.gstatic.com/classroom/ic_product_classroom_144.png"
        },
        {
            name: "New Tab",
            link: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABRklEQVR42mKgOqjq75ds7510YNL0uV9nAGqniqwKYiCIHIIjcAK22BGQLRdgBWvc3fnWk/FJhrkPO1xPgGvqPfLfJMHhT1yqurvS48bPaJhjD2efgidnVwa2yv59xecvEvi0UWCXq9t0ItfP2MMZ7nwIpkA8F1n8uLxZHM6yrBH7FIl2gFXDHYsErkn2hyKLHtcKrFntk58uVQJ+kSdQnmjhID4cwLLa8+K0BXsfNWCqBOsFdo2Yldv43DBrkxd30cjnNyYBhK0SQGkI9pG4Mu40D5b374DRCAyhHqXVfTmOwivivMkJxBz5wnHCtBfGgNFC+ChWKWRf3hsQIlyEoIv4IYEo5wkgtBLRekY9DE4Uin4Keae6hydGnljPmE8kRcCine6827AMsJ1IuW9ibnlQpXLBCR/WC875m2BP+VSu3c/0m+8V08OBngc0pxcAAAAASUVORK5CYII="
        },
        {
            name: "Google Docs",
            link: "https://ssl.gstatic.com/docs/documents/images/kix-favicon-2023q4.ico",
        },
        {
            name: "Edpuzzle",
            link: "https://edpuzzle.imgix.net/favicons/favicon-32.png",
        },
        {
            name: "Dashboard | Khan Academy",
            link: "https://cdn.kastatic.org/images/favicon.ico?logo",
        },
        {
            name: "Latest | Quizlet",
            link: "https://assets.quizlet.com/a/j/dist/app/i/logo/2021/q-twilight.e27821d9baad165.png",
        }
    ];

    return ( 
        <div className="flex flex-col gap-2 justify-start items-start text-left">
            <h3 className="font-semibold text-lg">Cloak Settings</h3>
            <hr className="w-full border-t border-gray-500 my-2"/>
            <div className="flex flex-row gap-2 items-center justify-center">
                <h4>Panic Site</h4>
                <input onChange={(e) => setWebsite(e.target.value)} className="input-main" placeholder="https://google.com" />
            </div>
            <hr className="w-11/12 border-t border-gray-500 my-2" style={{ color: "gray" }} />
            <div className="flex flex-row gap-2 items-center justify-center">
                <h4>Panic Key</h4>
                <input onChange={(e) => setPanic(e.target.value)} className="input-main" placeholder="\" />
            </div>
            <hr className="w-11/12 border-t border-gray-500 my-2" style={{ color: "gray" }} />
            <div className="flex flex-row gap-2 items-center justify-center">
                <h4>Title</h4>
                <input onChange={(e) => setTitle(e.target.value)} className="input-main" placeholder="Lumi OS v10" />
            </div>
            <div className="flex flex-row gap-2 items-center justify-center">
                <h4>Favicon</h4>
                <input onChange={(e) => setFavicon(e.target.value)} className="input-main" placeholder="https://avatars.githubusercontent.com/u/101959214?v=4" />
            </div>
            <p className="text-sm" style={{ color: "gray" }}>Built in cloaks.</p>
            <select onChange={(e) => handleCloakChange(e.target.value)} className="bg-secondary cursor-pointer px-2 py-1 shadow-sm hover:bg-primary-light duration-100 ease-in-out transition-colors rounded text-text-base">
                {cloaks.map((cloak, index) => (
                    <option value={JSON.stringify(cloak)} key={index}>{ cloak.name }</option>
                ))}
            </select>
            <hr className="w-11/12 border-t border-gray-500 my-2" style={{ color: "gray" }} />
            <div className="flex flex-row gap-2 items-center justify-center">
                <h4>Autologin</h4>
                <select onChange={(e) => setLogin(e.target.value === "true")} className="bg-secondary cursor-pointer px-2 py-1 shadow-sm hover:bg-primary-light duration-100 ease-in-out transition-colors rounded text-text-base">
                    <option value="true">Enabled</option>
                    <option value="false">Disabled</option>
                </select>            
            </div>
            <p className="text-xs font-light" style={{ color: "gray" }}>Autologin is enabled by default.</p>
            <Button onClick={handlePanicSettings}>Save Settings</Button>
        </div>
    );
}
 
export default User;