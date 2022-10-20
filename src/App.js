import './App.css';
import AdminPage from "./pages/AdminPage"; 
import UserPage from "./pages/UserPage"; 
import ButtonAppBar from "./component/bar.js"; 
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

