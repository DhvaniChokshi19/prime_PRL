import React from "react";
import Header from "./pages/HomePage/Header";
import Searchbox from "./pages/HomePage/Searchbox";
import Keyfeatures from "./pages/HomePage/Keyfeatures";
import Benefits from "./pages/HomePage/Benefits";
import Footer from "./pages/HomePage/Footer"; 

function App() {
  return (
    <>
      <Header /> <Searchbox />
      <Keyfeatures />
      <Benefits />
      <Footer />
    </>
  );
}

export default App;
