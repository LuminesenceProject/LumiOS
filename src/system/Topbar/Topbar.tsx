import React, { useState, useEffect, useRef } from 'react';
import { useTopbar } from './useTopbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface TopbarProps {
    openedApps: string[];
}

/*
const { addMenu, removeMenu } = useTopbar();

useEffect(() => {
    addMenu({
      title: "",
      icon: faMoon,
      dropdown: [
        { label: 'About', onClick: () => {}, icon: faQuestionCircle, gap: true },
        { label: "System", onClick: () => {}, icon: faGear, gap: true },
        { label: "Restart", onClick: () => {}, icon: faRefresh },
        { label: "Logout", onClick: () => {}, icon: faArrowRightToBracket },
      ],
    });

    return () => removeMenu("");
}, []);
*/

const Topbar: React.FC<TopbarProps> = () => {
    const { menus } = useTopbar();
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

    const dropdownRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleMenuClick = (index: number) => {
        setOpenMenuIndex(openMenuIndex === index ? null : index);
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (!dropdownRefs.current.some(ref => ref?.contains(event.target as Node))) {
            setOpenMenuIndex(null);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const getTime = () => {
        const use24hrs = false;
        
        const now = new Date();
        const options: Intl.DateTimeFormatOptions = {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: !use24hrs,
        };
    
        return now.toLocaleString('en-US', options);
    };    

    return (
        <div className="flex left-0 right-0 mx-auto justify-start items-center gap-2 absolute top-0 text-text-base backdrop-blur-lg bg-opacity-80 backdrop-brightness-75 z-10 p-[0.5px] shadow text-sm" id="topbar">
            {menus.map((menu, index) => (
                <div key={`menu-${index}`} className="relative">
                    <button className="px-4 py-1 hover:bg-primary rounded" onClick={() => handleMenuClick(index)}>
                        {menu.icon ? (typeof menu.icon === 'string' && menu.icon.includes("svg") ? (
                            <span className="svg-icon" dangerouslySetInnerHTML={{ __html: menu.icon }} />
                        ) : typeof menu.icon === 'string' && menu?.icon?.toString().includes("https") ? (
                            <img className='svg-icon' src={menu.icon} />
                        ) : (// @ts-ignore
                            <FontAwesomeIcon icon={menu?.icon} />
                        )) : <>{menu.title}</>}
                    </button>
                            <div
                            ref={el => dropdownRefs.current[index] = el}
                            className={`absolute top-full mt-2 bg-primary rounded shadow-lg transition-all -translate-y-10 duration-200 ease`}
                            style={{
                                opacity: openMenuIndex === index ? 1 : 0,
                                transform: `translateY(${openMenuIndex === index ? '0' : '-10%'})`,
                                pointerEvents: openMenuIndex === index ? 'auto' : 'none',
                                background: "#212121",
                            }}
                        >
                            {menu.dropdown.map((item, idx) => (
                                <div key={`${menu.title}-${idx}`}>
                                <div
                                    className="px-4 py-2 hover:bg-primary-light cursor-pointer flex items-center gap-2"
                                    onClick={() => { item.onClick(); setOpenMenuIndex(null); }}
                                >
                                    {item.icon && <FontAwesomeIcon icon={item.icon} />}
                                    <span>{item.label}</span>
                                </div>
                                    {item.gap && <hr style={{ color: "gray", paddingTop: "0.5px", paddingBottom: "0.5px" }} className="w-11/12 text-center mx-auto" />}
                                </div>
                            ))}
                        </div>
                </div>
            ))}
            <div className="px-4 py-1 rounded flex-grow text-right font-bold">
                {getTime().replace(",", "")}
            </div>

        </div>
    );
};

export default Topbar;