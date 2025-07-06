

import React, { useState } from "react";
import LoginForm from "./components/LoginForm";
import BusinessDashboard from "./components/BusinessDashboard";
import {BusinessDataContext} from "./context/BusinessDataContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  const [businessData, setBusinessData] = useState({});
  const [businessName, setBusinessName] = useState('');
  const [businessLocation, setBusinessLocation] = useState('');
  
  return (
    <BrowserRouter>
      <BusinessDataContext.Provider value={{ 
        businessData, 
        setBusinessData, 
        businessName, 
        setBusinessName, 
        businessLocation, 
        setBusinessLocation 
      }}>
        <Routes>
          <Route path="/login" element={<LoginForm />} />
          <Route path="/" element={<BusinessDashboard />} />
        </Routes>
      </BusinessDataContext.Provider>
    </BrowserRouter>
  );
};

export default App;