import React ,{useState} from "react";
import Searchbox from "./pages/HomePage/Searchbox";
import Keyfeatures from "./pages/HomePage/Keyfeatures";
import Benefits from "./pages/HomePage/Benefits";
import Footer from "./pages/HomePage/Footer"; 
import Profiles from "./pages/Searchdisplay/profiles";
import {Navigate, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Footers from "./pages/Searchdisplay/Footers";
import Headers from "./pages/ProfilePage/Headers";
import Mainprofile from "./pages/ProfilePage/mainprofile";
import Loginbox from "./pages/LoginPage/Loginbox";
import Publication from "./pages/HomePage/Publication";
import Header from './pages/HomePage/Header';
import Persons from "./pages/HomePage/persons";

// Home page component
const Home = () => {
  return (
    <>
     <Header />
      <Searchbox />
      <Keyfeatures />
      <Benefits />
      <Footer />
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
    <Loginbox  />
    </>
  )
}
const PublicationP=()=>{
  return(
    <>
    <Header></Header>
    <Publication></Publication>
    </>
  )
}
const PersonsP=()=>{
  return(
    <>
    <Header></Header>
    <Persons></Persons></>
  )
}

function App() {
 

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchDisplay />} />
        <Route path="/profile/:profileId" element={<ProfileP />} />
        <Route 
          path="/login" 
          element={<LoginP/>} 
        />
        <Route path="/Publication"element={<PublicationP />}/>
        <Route path='/Person'element={<PersonsP/>}/>
        
      </Routes>
    </Router>
  );
}

export default App;