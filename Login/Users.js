import baseTheme from "../../util/themes/baseTheme";
import { applyTheme } from "../../util/themes/themeUtil";
import apps from "../apps/Apps.json";

const Users = [];

const createUser = async (name, password, admin, firstLogin, autoLogin) => {
  const newUser = {
    name,
    password,
    admin,
    firstLogin,
    autoLogin,
  };

  // This is for the pinned and shortcutted apps.
  // Its easier to not redo the installed apps or built in ones.
  const installedApps = JSON.parse(localStorage.getItem(newUser.name + "installedApps")) || [];
  const pinnedApps = [...apps.filter(app => app.pinned), ...installedApps.filter(app => app.pinned)];
  const shortcuttedApps = [...apps.filter(app => app.shortcut), ...installedApps.filter(app => app.shortcut)];

  localStorage.setItem(newUser.name + "-pinned-apps", JSON.stringify(pinnedApps));
  localStorage.setItem(newUser.name + "-shortcutted-apps", JSON.stringify(shortcuttedApps));

  Users.push(newUser);

  saveUsersToLocalStorage();
  applyTheme(baseTheme);

  return newUser;
};

const deleteUser = (name) => {
  const index = Users.findIndex((user) => user.name === name);

  if (index !== -1) {
    Users.splice(index, 1);
    saveUsersToLocalStorage();
    return true; // User successfully deleted
  }

  return false; // User not found
};

const login = (name, password) => {
  const user = Users.find((u) => u.name === name && u.password === password);
  sessionStorage.setItem("loggedIn", JSON.stringify(user));

  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
    // check for onload script
    if (localStorage.getItem(user.name + "-onload-script")) {
      try {
        eval(localStorage.getItem(user.name + "-onload-script"))
      } catch (error) {
        window.alert(`Could not eval user script! Following error occured: ${error.message}`);
      }
    }
    
    return true; // Login successful
  }

  return false; // Invalid credentials
};

const changePassword = (name, password, newPassword) => {
  const user = Users.find((u) => u.name === name && u.password === password);

  if (user) {
    user.password = newPassword;
    saveUsersToLocalStorage();
    return true;
  }

  return false;
};

const handleAutoLogin = (name) => {
  const user = Users.find((u) => u.name === name);

  if (user) {
    user.autoLogin = !user.autoLogin;
    localStorage.setItem("currentUser", JSON.stringify(user));
    saveUsersToLocalStorage();
  }
};

// Function to save Users array to local storage
const saveUsersToLocalStorage = () => {
  localStorage.setItem('users', JSON.stringify(Users));
};

// Function to load Users array from local storage
const loadUsersFromLocalStorage = () => {
  const usersString = localStorage.getItem('users');

  if (usersString) {
    Users.push(...JSON.parse(usersString));
  }
};

loadUsersFromLocalStorage();

export { createUser, deleteUser, changePassword, login, handleAutoLogin, Users };