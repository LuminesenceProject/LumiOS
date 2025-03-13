import { useState } from "react";
import { Users, createUser, login } from "./Users";
import { importSettings } from "../../util/ImportExport";
import Battery from "../Taskbar/Battery";
import Wifi from "../Taskbar/Wifi";
import Button from "../../util/Button";

const Login = ({ setIsLoggedIn, openBootScreen }) => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [password, setPassword] = useState("");
  const [newUsername, setNewUsername] = useState("");
  const [error, setError] = useState("");
  const [showSignUp, setShowSignUp] = useState(false);
  const [showDate, setShowDate] = useState(true);
  const [admin, setAdmin] = useState(false);
  const [selectedJSONFile, setSelectedJSONFile] = useState(null);
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];

  const handleLogin = (user) => {
    setSelectedUser(user);
    setShowSignUp(false);
  };

  const handleCreateUser = (e) => {
    createUser(newUsername, password, admin, true, false)
    .then(() => {
      tryLogin(e, newUsername);
    }).catch((error) => {
      console.error(error, "could not create user");
      window.location.reload();
    });
  };

  const handleSignUp = () => {
    setSelectedUser(null);
    setShowSignUp(true);
    setShowDate(false);
  };

  const tryLogin = (event, user) => {
    event.preventDefault();
  
    if (!password) {
      return;
    }
  
    if (login(user, password)) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      setError("Incorrect Password");
    }
  };

  const handleDateClick = () => {
    setShowDate(false);
  };

  const handleImport = () => {
    if (selectedJSONFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const importedJson = e.target.result;
        importSettings(importedJson);
      };

      reader.readAsText(selectedJSONFile);
    } else {
      alert('Please select a JSON file.');
    }
  };

  const handleJSONFileChange = (event) => {
    setSelectedJSONFile(event.target.files[0]);
  };

  return (
    <div
      className="flex flex-col h-screen relative"
      style={{color: "white"}}
      onClick={() => {
        if (showDate) {
          handleDateClick();
        }
      }}
    >
      <div className="w-full h-full fixed bg-blur" />
        {/* Time and Date Panel */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-2/3 pointer-events-none text-center transition-opacity ${
            showDate ? 'opacity-100 pointer-events-auto' : 'opacity-0'
          }`}
        >
          <div className="text-4xl font-extrabold">
            {new Date().toLocaleTimeString()}
          </div>
          <div className="text-lg text-white mt-2">
            {`${weekday[new Date().getDay()]}, ${month[new Date().getMonth()]} ${new Date().getDate()} `}
          </div>
        </div>
        {/* User Selection Panel */}
        <div
          className={`absolute bottom-0 left-0 flex flex-col p-4 space-y-2 pointer-events-none transition-opacity ${
            !showDate ? 'opacity-100 pointer-events-auto' : 'opacity-0'
          }`}
        >
          {Users.map((user, index) => (
            <Button
              key={index}
              onClick={() => handleLogin(user)}
            >
              {user.name}
            </Button>
          ))}
          <Button
            onClick={handleSignUp}
          >
            Sign Up
          </Button>
          {Users.length < 1 && <input type="file" onChange={handleJSONFileChange} className="z-20 button-main"/>}
          {Users.length < 1 && <Button type="file" onClick={handleImport} className="z-20">Import</Button>}
        </div>

        {/* Selected User Login Panel */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none transition-opacity ${
            !showDate && selectedUser ? 'opacity-100 pointer-events-auto' : 'opacity-0'
          }`}
        >
          <h3 className="font-bold text-2xl text-white mb-4">
            {selectedUser?.name}
          </h3>
          <form
            className="flex flex-col items-center gap-2"
            onSubmit={(e) => tryLogin(e, selectedUser.name)}
          >
          {error && (
            <p
              key={error}
              className="text-sm font-extralight p-1 shake"
            >
              {error}
            </p>
          )}
            <div className="relative"> 
              <input
              style={{ color: "black" }}
              className="peer w-full h-full font-sans font-normal outline outline-0 focus:outline-0 disabled:border-0 transition-all placeholder-shown:border border focus:border-2 border-t-0 focus:border-t-0 text-sm px-3 py-2.5 rounded-[7px]"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="true"
              placeholder="" />
              <label
              style={{ color: "black" }}
              className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate leading-tight peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-0 before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-0 after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-0 after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-0 peer-placeholder-shown:leading-[3.75] !text-white">Password
              </label>
            </div>
            <Button type="submit">Submit</Button>
          </form>
          <p className="text-sm text-white mt-2">This app uses cookies.</p>
        </div>

        {/* Sign-Up Panel */}
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center transition-opacity ${
            !showDate && showSignUp && !selectedUser ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <h1 className="text-2xl font-bold text-white mb-4">Lumi OS</h1>
            <form onSubmit={handleCreateUser} className="flex flex-col items-center gap-2">
              <div className="relative"> 
                <input
                style={{ color: "black" }}
                className="peer w-full h-full font-sans font-normal outline outline-0 focus:outline-0 disabled:border-0 transition-all placeholder-shown:border border focus:border-2 border-t-0 focus:border-t-0 text-sm px-3 py-2.5 rounded-[7px]"
                type="new-password"
                onChange={(e) => setNewUsername(e.target.value)}
                placeholder="" />
                <label
                style={{ color: "black" }}
                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate leading-tight peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-0 before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-0 after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-0 after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-0 peer-placeholder-shown:leading-[3.75] !text-white">Username
                </label>
              </div>
              <div className="relative"> 
                <input
                style={{ color: "black" }}
                className="peer w-full h-full font-sans font-normal outline outline-0 focus:outline-0 disabled:border-0 transition-all placeholder-shown:border border focus:border-2 border-t-0 focus:border-t-0 text-sm px-3 py-2.5 rounded-[7px]"
                type="new-password"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="" />
                <label
                style={{ color: "black" }}
                className="flex w-full h-full select-none pointer-events-none absolute left-0 font-normal !overflow-visible truncate leading-tight peer-focus:leading-tight transition-all -top-1.5 peer-placeholder-shown:text-sm text-[11px] peer-focus:text-[11px] before:content[' '] before:block before:box-border before:w-2.5 before:h-1.5 before:mt-[6.5px] before:mr-1 peer-placeholder-shown:before:border-0 before:rounded-tl-md before:border-t peer-focus:before:border-t-2 before:border-l peer-focus:before:border-l-2 before:pointer-events-none before:transition-all peer-disabled:before:border-0 after:content[' '] after:block after:flex-grow after:box-border after:w-2.5 after:h-1.5 after:mt-[6.5px] after:ml-1 peer-placeholder-shown:after:border-0 after:rounded-tr-md after:border-t peer-focus:after:border-t-2 after:border-r peer-focus:after:border-r-2 after:pointer-events-none after:transition-all peer-disabled:after:border-0 peer-placeholder-shown:leading-[3.75] !text-white">Password
                </label>
              </div>
              <div className="inline-flex items-center">
                <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
                  <input 
                    type="checkbox"
                    onChange={() => {
                      if (Users.length < 1) {
                        setAdmin(!admin);
                      }
                    }}
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"/>
                  <span
                    className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                      stroke="currentColor" strokeWidth="1">
                      <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"></path>
                    </svg>
                  </span>
                </label>
                <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="check">
                  Admin - { admin.toString() }
                </label>
              </div> 
              <div className="inline-flex items-center">
                <label className="relative flex items-center p-3 rounded-full cursor-pointer" htmlFor="check">
                  <input 
                    type="checkbox"
                    required
                    className="before:content[''] peer relative h-5 w-5 cursor-pointer appearance-none rounded-md border transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:opacity-0 before:transition-opacity hover:before:opacity-10"/>
                  <span
                    className="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor"
                      stroke="currentColor" strokeWidth="1">
                      <path fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"></path>
                    </svg>
                  </span>
                </label>
                <label className="mt-px font-light text-gray-700 cursor-pointer select-none" htmlFor="check">
                  I agree to the terms and conditions.
                </label>
              </div> 
              <Button type="submit">Create Account</Button>
            </form>
        </div>
        <p className="absolute bottom-0 flex w-full justify-center text-sm text-white py-2">Terms can be found at this <a className="pl-1" style={{color: "lightblue"}} href="https://raw.githubusercontent.com/LuminesenceProject/LumiOS/main/LICENSE" target="_blank">link.</a></p>
        <div className="group absolute bottom-0 right-0 flex flex-row justify-center items-center gap-2 p-4 invert">
          <Wifi />
          <Battery />
          <div className="absolute -translate-y-16 bg-primary-light origin-bottom duration-200 scale-0 group-hover:scale-100 rounded p-2 invert">
            <Button className="w-full h-full" onClick={openBootScreen}>
              Boot Screen
            </Button>
          </div>
        </div>
    </div>
  );
};

export default Login;