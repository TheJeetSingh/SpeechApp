import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import TopicsScreen from "./components/TopicsScreen";
import QuoteScreen from "./components/QuoteScreen";
import ConcreteScreen from "./components/ConcreteScreen";
import PrepScreen from "./components/PrepScreen";
import SpeechScreen from "./components/SpeechScreen";
import AbstractScreen from "./components/AbstractScreen";
import CurrentScreen from "./components/CurrentScreen";
import ConstructionScreen from "./components/ConstructionScreen";
import BetaDev from "./components/BetaDev";
import ExtempScreen from "./components/ExtempScreen";
import ExtempPrepScreen from "./components/ExtempPrepScreen";
import LoginScreen from "./components/LoginScreen"; // Import the new LoginScreen
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <Analytics />
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/login" element={<LoginScreen />} /> {/* Add the login route */}
        <Route path="/topics" element={<TopicsScreen />} />
        <Route path="/quote" element={<QuoteScreen />} />
        <Route path="/concrete" element={<ConcreteScreen />} />
        <Route path="/abstract" element={<AbstractScreen />} />
        <Route path="/prep/:topic" element={<PrepScreen />} />
        <Route path="/speech" element={<SpeechScreen />} />
        <Route path="/current" element={<CurrentScreen />} />
        <Route path="/construction" element={<ConstructionScreen />} />
        <Route path="/beta" element={<BetaDev />} />
        <Route path="/extemp" element={<ExtempScreen />} />
        <Route path="/extempPrep" element={<ExtempPrepScreen />} />
      </Routes>
    </Router>
  );
}

export default App;