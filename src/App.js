import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
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
import SignupScreen from "./components/SignupScreen";
import SpeechStats from "./components/SpeechStats"; // Add import for SpeechStats
import NotFound from "./components/NotFound"; // Import the NotFound component
import ErrorFallback from "./components/ErrorFallback"; // Import the ErrorFallback component
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the app state here
        window.location.href = '/';
      }}
    >
      <Router>
        <Analytics />
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} /> {/* Add the login route */}
          <Route path="/signup" element={<SignupScreen />} /> {/* Add the signup route */}
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
          <Route path="/stats" element={<SpeechStats />} /> {/* Add route for SpeechStats */}
          <Route path="*" element={<NotFound />} /> {/* Catch-all route for 404 errors */}
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;