// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// Mock analytics components that rely on browser-only features
jest.mock(
  '@vercel/analytics/react',
  () => ({
    Analytics: () => null
  }),
  { virtual: true }
);

// Provide default values for client-side environment variables used during module initialization
process.env.REACT_APP_ASSEMBLYAI_API_KEY = process.env.REACT_APP_ASSEMBLYAI_API_KEY || 'test-assemblyai-key';
process.env.REACT_APP_GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY || 'test-gemini-key';
process.env.REACT_APP_SERVER_ENV = process.env.REACT_APP_SERVER_ENV || 'development';
process.env.REACT_APP_API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

// Provide a lightweight mock for the WebGL-focused `ogl` package so Jest can import
jest.mock('ogl', () => {
  const noop = () => {};
  return {
    Renderer: jest.fn().mockImplementation(() => ({
      gl: {},
      setSize: noop,
      render: noop,
      domElement: {}
    })),
    Program: jest.fn(),
    Mesh: jest.fn(),
    Color: jest.fn(),
    Triangle: jest.fn()
  };
});

// Polyfill browser APIs used by the application but missing in JSDOM
class NoopObserver {
  constructor() {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (!window.IntersectionObserver) {
  window.IntersectionObserver = NoopObserver;
}

if (!window.ResizeObserver) {
  window.ResizeObserver = NoopObserver;
}

if (!window.matchMedia) {
  window.matchMedia = () => ({
    matches: false,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false
  });
}

if (!HTMLCanvasElement.prototype.getContext) {
  HTMLCanvasElement.prototype.getContext = () => ({
    fillRect: () => {},
    clearRect: () => {},
    getImageData: () => ({ data: [] }),
    putImageData: () => {},
    createImageData: () => [],
    setTransform: () => {},
    drawImage: () => {},
    save: () => {},
    fillText: () => {},
    restore: () => {},
    beginPath: () => {},
    moveTo: () => {},
    lineTo: () => {},
    closePath: () => {},
    stroke: () => {},
    translate: () => {},
    scale: () => {},
    rotate: () => {},
    arc: () => {},
    quadraticCurveTo: () => {},
    getTransform: () => ({
      a: 1,
      b: 0,
      c: 0,
      d: 1,
      e: 0,
      f: 0
    }),
    setLineDash: () => {},
    measureText: () => ({ width: 0 }),
    lineWidth: 1,
    strokeStyle: '#000',
    fillStyle: '#000',
    globalAlpha: 1
  });
}
