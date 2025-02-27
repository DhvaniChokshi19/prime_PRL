import React from "react";
import Header from "./pages/HomePage/Header";
import Searchbox from "./pages/HomePage/Searchbox";
import Keyfeatures from "./pages/HomePage/Keyfeatures";
import Benefits from "./pages/HomePage/Benefits";
import Footer from "./pages/HomePage/Footer"; 
import Profiles from "./pages/Searchdisplay/profiles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footers from "./pages/Searchdisplay/Footers";
import Headers from "./pages/ProfilePage/Headers";
import Mainprofile from "./pages/ProfilePage/mainprofile";
import Loginbox from "./pages/LoginPage/Loginbox";


// Home page component
const Home = () => {
  return (
    <>
      <Header />
      <Searchbox />
      {/* <Keyfeatures /> */}
      {/* <Benefits /> */}
      {/* <Footer /> */}
    </>
  );
};
const SearchDisplay = () => {
return (
  <>
  <Header></Header>
  <Profiles></Profiles>
  <Footers></Footers>
  </>
)
}
const ProfileP = () => {
  return(
    <>
    <Headers></Headers>
    <Mainprofile></Mainprofile>
    </>
  )
}
const LoginP = () =>{
  return(
    <>
    <Header></Header>
    <Loginbox></Loginbox>
    </>
  )
}
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchDisplay />} />
        <Route path="/profile" element={<ProfileP />} />
        <Route path="/Login"element={<LoginP />} />
      </Routes>
    </Router>
  );
}

export default App;