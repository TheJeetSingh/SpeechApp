import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import LandingPage from "./components/LandingPage";
import HomeScreen from "./components/HomeScreen";
import TopicsScreen from "./components/TopicsScreen";
import QuoteScreen from "./components/QuoteScreen";
import ConcreteScreen from "./components/ConcreteScreen";
import PrepScreen from "./components/PrepScreen";
import SpeechScreen from "./components/SpeechScreen";
import AbstractScreen from "./components/AbstractScreen";
import CurrentScreen from "./components/CurrentScreen";
import ConstructionScreen from "./components/ConstructionScreen";
import ExtempScreen from "./components/ExtempScreen";
import ExtempPrepScreen from "./components/ExtempPrepScreen";
import ExtempSelectScreen from "./components/ExtempSelectScreen";
import ExtempTopicSelectScreen from "./components/ExtempTopicSelectScreen";
import LoginScreen from "./components/LoginScreen";
import SignupScreen from "./components/SignupScreen";
import SpeechStats from "./components/SpeechStats";
import AICoachScreen from "./components/AICoachScreen";
import ChatSession from "./components/ChatSession";
import SettingsPage from "./components/SettingsPage";
import NotFound from "./components/NotFound";
import ErrorFallback from "./components/ErrorFallback";
import MobileBlocker from "./components/MobileBlocker";
import { Analytics } from "@vercel/analytics/react";

function App() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if the device is mobile
    const checkMobile = () => {
      const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
      const isMobileDevice = mobileRegex.test(navigator.userAgent);
      const isSmallScreen = window.innerWidth < 768; // Consider screens smaller than 768px as mobile
      
      // Check if user has chosen to override mobile restriction
      const hasOverride = localStorage.getItem('articulate_mobile_override') === 'true';
      
      setIsMobile((isMobileDevice || isSmallScreen) && !hasOverride);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // If it's a mobile device, show the mobile blocker
  if (isMobile) {
    return <MobileBlocker />;
  }

  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => {
        // Reset the app state here
        window.location.href = '/home';
      }}
    >
      <Router>
        <Analytics />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<HomeScreen />} />
          <Route path="/login" element={<LoginScreen />} />
          <Route path="/signup" element={<SignupScreen />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/topics" element={<TopicsScreen />} />
          <Route path="/quote" element={<QuoteScreen />} />
          <Route path="/concrete" element={<ConcreteScreen />} />
          <Route path="/abstract" element={<AbstractScreen />} />
          <Route path="/prep/:topic" element={<PrepScreen />} />
          <Route path="/speech" element={<SpeechScreen />} />
          <Route path="/current" element={<CurrentScreen />} />
          <Route path="/construction" element={<ConstructionScreen />} />
          <Route path="/extemp" element={<ExtempSelectScreen />} />
          <Route path="/extempTopicSelect" element={<ExtempTopicSelectScreen />} />
          <Route path="/extempPrep" element={<ExtempPrepScreen />} />
          <Route path="/stats" element={<SpeechStats />} />
          <Route path="/ai-coach" element={<AICoachScreen />} />
          <Route path="/chat-session" element={<ChatSession />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </ErrorBoundary>
  );
}

export default App;