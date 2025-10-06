import { render, screen } from '@testing-library/react';

afterEach(() => {
  jest.clearAllMocks();
});

jest.mock('./components/LandingPage', () => () => 'Learn to speak with confidence');
jest.mock('./components/HomeScreen', () => () => 'Home Screen');
jest.mock('./components/TopicsScreen', () => () => 'Topics Screen');
jest.mock('./components/QuoteScreen', () => () => 'Quote Screen');
jest.mock('./components/ConcreteScreen', () => () => 'Concrete Screen');
jest.mock('./components/PrepScreen', () => () => 'Prep Screen');
jest.mock('./components/SpeechScreen', () => () => 'Speech Screen');
jest.mock('./components/AbstractScreen', () => () => 'Abstract Screen');
jest.mock('./components/CurrentScreen', () => () => 'Current Screen');
jest.mock('./components/ConstructionScreen', () => () => 'Construction Screen');
jest.mock('./components/ExtempScreen', () => () => 'Extemp Screen');
jest.mock('./components/ExtempPrepScreen', () => () => 'Extemp Prep Screen');
jest.mock('./components/ExtempSelectScreen', () => () => 'Extemp Select Screen');
jest.mock('./components/ExtempTopicSelectScreen', () => () => 'Extemp Topic Select Screen');
jest.mock('./components/LoginScreen', () => () => 'Login Screen');
jest.mock('./components/SignupScreen', () => () => 'Signup Screen');
jest.mock('./components/SpeechStats', () => () => 'Speech Stats');
jest.mock('./components/AICoachScreen', () => () => 'AI Coach Screen');
jest.mock('./components/ChatSession', () => () => 'Chat Session');
jest.mock('./components/SettingsPage', () => () => 'Settings Page');
jest.mock('./components/NotFound', () => () => 'Not Found');
jest.mock('./components/ErrorFallback', () => () => 'Error Fallback');
jest.mock('./components/MobileBlocker', () => () => 'Mobile Blocker');

const App = require('./App').default;

test('renders landing page hero text', () => {
  render(<App />);
  expect(screen.getByText(/learn to speak with confidence/i)).toBeInTheDocument();
});
