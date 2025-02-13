import React from "react";
import Header from "./pages/HomePage/Header";
import Searchbox from "./pages/HomePage/Searchbox";
import Keyfeatures from "./pages/HomePage/Keyfeatures";
import Benefits from "./pages/HomePage/Benefits";
import Footer from "./pages/HomePage/Footer"; 
import Profiles from "./pages/Searchdisplay/profiles";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


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
  </>
)
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<SearchDisplay />} />
      </Routes>
    </Router>
  );
}

export default App;