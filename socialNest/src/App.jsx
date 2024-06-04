import Hero from "./components/Hero";
import Login from "./components/Login";
import { Navbar } from "./components/Navbar";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./components/Signin";
import Signup from "./components/Signup";
import Profile from "./pages/Profile";
import UserProfile from "./components/UserProfile";
export default function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Hero />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/signin" element={<Signin />}></Route>
          <Route path="/signup" element={<Signup />}></Route>
          <Route path="/profile" element={<Profile />}></Route>
          <Route path="/user/:userId" element={<UserProfile />}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}