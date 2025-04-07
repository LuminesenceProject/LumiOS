import { useState, useEffect } from 'react';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

interface DropdownItem {
    label: string;
    icon?: IconDefinition;
    gap?: boolean;
    onClick: () => void;
}

interface Menu {
    title: string;
    icon?: IconDefinition | string;
    dropdown: DropdownItem[];
}

let globalMenus: Menu[] = [];
let listeners: Function[] = [];

const setGlobalMenus = (menus: Menu[]) => {
    globalMenus = menus;
    listeners.forEach(listener => listener(globalMenus));
};

export const addMenu = (menu: Menu) => {
    if (globalMenus.some(value => value.title === menu.title)) return;

    setGlobalMenus([...globalMenus, menu]);
};

export const removeMenu = (title: string) => {
    setGlobalMenus(globalMenus.filter(value => value.title !== title));
}

export const useTopbar = () => {
    const [menus, setMenus] = useState<Menu[]>(globalMenus);

    useEffect(() => {
        const listener = (newMenus: Menu[]) => {
            setMenus(newMenus);
        };
        listeners.push(listener);
        return () => {
            listeners = listeners.filter(l => l !== listener);
        };
    }, []);

    return { menus, addMenu, removeMenu };
};