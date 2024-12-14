import React, { useContext, useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Hero from "./components/Hero";
import Login from "./components/Login";
import { Navbar } from "./components/Navbar";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Profile from "./pages/Profile";
import UserProfile from "./components/UserProfile";
import Logout from "./components/Logout";
import { UserContext } from "./context/UserProvider";
import NotFound from "./pages/NotFound";
import Loader from "./components/Loader/Loader";
import Notification from "./components/Notification";

export default function App() {
  const user = useContext(UserContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate an async operation
    setTimeout(() => {
      setLoading(false);
    }, 2000); // Set loading to false after 2 seconds
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />}></Route>
          <Route path="*" element={<NotFound />}></Route>
          <Route path="/signin" element={<Login />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          {user && (
            <>
              <Route path="/profile" element={<Profile />}></Route>
              <Route path="/logout" element={<Logout />}></Route>
              <Route path="/notify" element={<Notification />}></Route>
              <Route path="/user/:userId" element={<UserProfile />} />
            </>
          )}
        </Routes>
      </BrowserRouter>
    </>
  );
}
