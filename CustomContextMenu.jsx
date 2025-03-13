// CustomContextMenu.js
import { faPaintBrush, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const CustomContextMenu = ({ visible, position, onItemClick }) => {
  return (
    visible && (
<div
    className="absolute text-text-base p-2 rounded backdrop-opacity-80 shadow z-40"
    style={{
        position: 'absolute',
        top: position.y,
        left: position.x,
        backdropFilter: "blur(20px)",
        color: 'white',
    }}
    >
    <div className="hover:scale-105 transition-transform duration-200 cursor-pointer p-2 rounded" onClick={() => onItemClick('ChangeSize32')}>
        Small Icons
    </div>
    <div className="hover:scale-105 transition-transform duration-200 cursor-pointer p-2 rounded" onClick={() => onItemClick('ChangeSize36')}>
        Medium Icons
    </div>
    <div className="hover:scale-105 transition-transform duration-200 cursor-pointer p-2 rounded" onClick={() => onItemClick('ChangeSize48')}>
        Large Icons
    </div>
    <div className="hover:scale-105 transition-transform duration-200 cursor-pointer p-2 rounded" onClick={() => onItemClick('Personalize')}>
        <FontAwesomeIcon icon={faPaintBrush} />
        Personalize
    </div>
    <div className="hover:scale-105 transition-transform duration-200 cursor-pointer p-2 rounded" onClick={() => onItemClick('Terminal')}>
        <FontAwesomeIcon icon={faTerminal} />
        Terminal
    </div>
    {/* Add more context menu items as needed */}
</div>
    )
  );
};

export default CustomContextMenu;