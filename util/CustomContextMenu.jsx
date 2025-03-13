import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

const CustomContextMenu = ({ menuState, onItemClick }) => {
  const { visible, position, items } = menuState;

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
        {items.map((item, index) => (
          <div
            key={index}
            className="hover:scale-105 transition-transform duration-200 cursor-pointer p-2 rounded"
            onClick={() => onItemClick(item.action)}
          >
            {item.icon && <FontAwesomeIcon icon={item.icon} />}
            {item.label}
          </div>
        ))}
      </div>
    )
  );
};

export default CustomContextMenu;