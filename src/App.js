import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EducationPlanner from "./components/EducationPlanner";

function App() {
  return (
    <div className="container">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EducationPlanner />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
