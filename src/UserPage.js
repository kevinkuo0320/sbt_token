import logo from './logo.svg';
import './App.css';
import User from "./user.js"; 
import ButtonAppBar from "./bar.js"; 

function UserPage() {
  return (
    <div className="App">
      <header className="App-header">
        <ButtonAppBar/>  
       <User />
      </header>
    </div>
  );
}

export default UserPage;

