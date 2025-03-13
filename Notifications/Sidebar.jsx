import React, { useEffect, useRef, useState } from "react";
import { notifications, removeNotification, clearNotifications, setNotificationsUpdateCallback } from "./Notifications";

const Sidebar = ({ shown, setShown }) => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const position = localStorage.getItem(currentUser.name + "position") || "south";
    const [sidebarNotifications, setSidebarNotifications] = useState(notifications);

    const sidebarRef = useRef(null);

    useEffect(() => {
        setNotificationsUpdateCallback((updatedNotifications) => {
            setSidebarNotifications(updatedNotifications);
        });

        const handleOutsideClick = (e) => {
            if (sidebarRef.current && !sidebarRef.current.contains(e.target)) {
                setShown(false);
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, [setShown]);

    return (
        <div
            ref={sidebarRef}
            style={{
                position: 'absolute',
                backdropFilter: "blur(20px) brightness(90%)",
                color: 'white',
            }}
            className={`flex flex-col gap-5 absolute ${
                position === "east" ? "right-24" : "right-0"
            } 
            ${shown ? "opacity-100" : "opacity-0 pointer-events-none"} scale-0 ease-in-out duration-100 origin-right ${shown && "scale-100"}
            w-1/4 h-full overflow-y-scroll p-5 shadow-lg backdrop-blur-lg bg-opacity-80 backdrop-brightness-75 flex flex-col z-20`}
        >
            <h2 className={`font-bold text-2xl ${position === "north" && "pt-20"}`}>Notifications</h2>
            {sidebarNotifications.map((notification) => (
                <div className="flex flex-col gap-2" key={notification.name}>
                    <h3 className="text-xl font-bold">{notification.name}</h3>
                    <p>{notification.description}</p>
                    <div className="flex flex-row justify-between items-center text-text-base">
                      {notification.func && (
                        <button className="bg-primary hover:bg-primary-light transition-colors duration-200 px-4 py-2 rounded" onClick={notification.func}>
                          Do now.
                        </button>
                      )}
                      <button className="bg-primary hover:bg-primary-light transition-colors duration-200 px-4 py-2 rounded" onClick={() => removeNotification(notification.name)}>
                          Dismiss
                      </button>
                    </div>
                </div>
            ))}
            {sidebarNotifications.length > 0 && (
                <button className="shadow-lg hover:scale-105 transition-transform duration-200" onClick={clearNotifications}>Clear All</button>
            )}
            {sidebarNotifications == 0 && (
              <p className="text-sm font-light">You have no new notifications.</p>
            )}
        </div>
    );
};

export default Sidebar;