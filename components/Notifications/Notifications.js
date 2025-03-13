let notifications = [];
let updateCallback = null;

const pushNotification = (name, description, func) => {
    const newNotification = {
        name,
        description,
        func,
    };

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));

    if (currentUser && !(JSON.parse(localStorage.getItem(currentUser.name + "advancedSettings"))?.questionPrompts || false)) {
        notifications.push(newNotification);
    };

    if (updateCallback) {
        updateCallback([...notifications]);
    }
};

const removeNotification = (name) => {
    notifications = notifications.filter((notification) => notification.name !== name);
    if (updateCallback) {
        updateCallback([...notifications]);
    }
};

const clearNotifications = () => {
    notifications.length = 0;
    if (updateCallback) {
        updateCallback([]);
    }
};

const setNotificationsUpdateCallback = (callback) => {
    updateCallback = callback;
};

export { notifications, pushNotification, removeNotification, clearNotifications, setNotificationsUpdateCallback };