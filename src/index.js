import React, { createContext, useContext } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login";
import { NextUIProvider } from "@nextui-org/react";
import "./index.css";

// Firebase configuration
import { initializeApp } from "firebase/app";
import config from "./firebase_config";
import FirebaseContext from "./pages/context/FirebaseContext";
import User from "./pages/user";
import Admin from "./pages/admin";
import Driver from "./pages/driver";
import Home from "./pages/home";
const firebase = initializeApp(config);

const App = () => {
  return (
    <FirebaseContext.Provider value={firebase}>
      <BrowserRouter>
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="user" element={<User />} />
          <Route path="admin" element={<Admin />} />
          <Route path="driver" element={<Driver />} />
          <Route path="home" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </FirebaseContext.Provider>
  );
};

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <NextUIProvider>
      <App />
    </NextUIProvider>
  </React.StrictMode>
);
