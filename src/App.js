import logo from './logo.svg';
import './App.css';
import AdminPage from "./AdminPage"; 
import UserPage from "./UserPage"; 
import ButtonAppBar from "./bar.js"; 
import ReactDOM from "react-dom";
import {Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminPage />}  />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/user" element={<UserPage />} />
    </Routes>
    // <div className="App">
    //   <header className="App-header">
    //     <ButtonAppBar/>  
    //    <SBT />
    //   </header>
    // </div>
  );
}

export default App;

