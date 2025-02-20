import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomeScreen from "./components/HomeScreen";
import TopicsScreen from "./components/TopicsScreen";
import QuoteScreen from "./components/QuoteScreen";
import ConcreteScreen from "./components/ConcreteScreen"; // Ensure this is the correct path for concrete
import PrepScreen from "./components/PrepScreen";
import SpeechScreen from "./components/SpeechScreen";
import SpeechStats from "./components/SpeechStats";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/topics" element={<TopicsScreen />} />
        <Route path="/quote" element={<QuoteScreen />} /> {/* Ensure this is correct */}
        <Route path="/concrete" element={<ConcreteScreen />} /> {/* Ensure this is correct */}
        <Route path="/prep/:topic" element={<PrepScreen />} />
        <Route path="/speech" element={<SpeechScreen />} />
        <Route path="/speech-stats" element={<SpeechStats />} />
      </Routes>
    </Router>
  );
}

export default App;
