import { useState } from "react";

export const useContextMenu = () => {
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [menuActions, setMenuActions] = useState<{ [key: string]: () => void }>({});
  const [dropDownActions, setDropDownActions] = useState<{ [key: string]: () => void }>({});

  const showMenu = (event: React.MouseEvent<HTMLDivElement>, item: string, actions: { [key: string]: () => void }, dropdowns?: { [key: string]: () => void }) => {
    event.preventDefault();
    setSelectedItem(item);
    setMenuActions(actions);
    setDropDownActions(dropdowns || dropDownActions)
    setMenuVisible(true);
    setMenuPosition({ x: event.clientX, y: event.clientY });
  };

  const hideMenu = () => {
    setMenuVisible(false);
    setSelectedItem(null);
    setMenuActions({});
    setDropDownActions({});
  };

  return {
    menuPosition,
    menuVisible,
    selectedItem,
    menuActions,
    dropDownActions,
    showMenu,
    hideMenu,
  };
};