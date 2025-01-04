import '@testing-library/jest-dom'; 
const originalConsoleError = console.error;
console.error = (msg, ...args) => {
    if (msg.includes("Not implemented: window.scrollTo")) {
        return; 
    }
    originalConsoleError(msg, ...args);
};
