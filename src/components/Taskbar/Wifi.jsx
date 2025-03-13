import { faWifi, faWifiStrong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

const Wifi = () => {
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        window.addEventListener("online", function() {
            setConnected(true);
        })
    }, [])

    return ( 
        <>
            {connected ? 
            <>
                <FontAwesomeIcon icon={faWifiStrong} className="invert" />
            </> 
            : 
            <>
                <FontAwesomeIcon icon={faWifi} className="invert" />
            </>}
        </>
     );
}
 
export default Wifi;