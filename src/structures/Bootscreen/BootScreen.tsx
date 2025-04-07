import React, { useState, useEffect } from 'react';
import Troubleshoot from './Troubleshoot'; // Import your components
import User from './User';
import Theme from './Theme';

interface BootScreenProps {
    setShowBootScreen: (prev: boolean) => void;
}

const BootScreen: React.FC<BootScreenProps> = ({ setShowBootScreen }) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);

    const options = ['Troubleshooting', 'User', 'Theme', 'Exit'];

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (activeMenu === null) {
                // Handle main menu navigation
                if (event.key === 'ArrowUp') {
                    setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);
                } else if (event.key === 'ArrowDown') {
                    setSelectedIndex((prev) => (prev + 1) % options.length);
                } else if (event.key === 'Enter') {
                    setActiveMenu(options[selectedIndex]);
                }
            } else {
                // Handle submenu navigation
                if (event.key === 'ArrowUp') {
                    setSelectedIndex((prev) => (prev - 1 + options.length + 1) % (options.length + 1));
                } else if (event.key === 'ArrowDown') {
                    setSelectedIndex((prev) => (prev + 1) % (options.length + 1));
                } else if (event.key === 'Enter') {
                    if (selectedIndex === options.length) {
                        setActiveMenu(null); // Go back to main menu
                        setSelectedIndex(0); // Reset selection                        
                    }
                } else if (event.key === 'Escape') {
                    setActiveMenu(null); // Go back to main menu
                    setSelectedIndex(0); // Reset selection
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [selectedIndex, options, activeMenu]);

    const renderMenu = () => {
        switch (activeMenu) {
            case 'Troubleshooting':
                return <Troubleshoot setActiveMenu={setActiveMenu} />;
            case 'User':
                return <User setActiveMenu={setActiveMenu} />;
            case 'Theme':
                return <Theme setActiveMenu={setActiveMenu} />;
            // @ts-ignore
            case 'Exit': setShowBootScreen(false);
            default:
                return null;
        }
    };

    return (
        <div
            className="fixed inset-0 flex items-center justify-center z-50"
            style={{ backgroundColor: 'black', color: 'green', outline: 'none' }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    textAlign: 'center',
                }}
                tabIndex={-1} // Ensure that this div itself is not focusable
            >
                <h3 style={{ color: "green" }} className='text-2xl my-4 font-bold'>BIOS</h3>
                {activeMenu === null ? (
                    options.map((option, index) => (
                        <div
                            key={option}
                            tabIndex={0} // Make div focusable
                            style={{
                                padding: '10px',
                                cursor: 'default',
                                fontWeight: selectedIndex === index ? 'bold' : 'normal',
                                border: selectedIndex === index ? '1px solid green' : 'none',
                                outline: 'none',
                                color: selectedIndex === index ? 'green' : 'inherit', // Highlight color
                            }}
                            onKeyDown={(event) => {
                                if (event.key === 'Enter') {
                                    setActiveMenu(option);
                                }
                            }}
                            onMouseDown={(event) => event.preventDefault()} // Prevent default mouse interactions
                        >
                            {index === selectedIndex ? `[${option}]` : option}
                        </div>
                    ))
                ) : (
                    renderMenu()
                )}
            </div>
        </div>
    );
};

export default BootScreen;