// src/App.jsx
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import  SimonGame from "./pages/Homepage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<SimonGame />} />
      </Routes>
    </Router>
  );
}

export default App;