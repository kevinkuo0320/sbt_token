import logo from './logo.svg';
import './App.css';
import SBT from "./admin.js"; 
import ButtonAppBar from "./bar.js"; 

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <ButtonAppBar/>
        
       <SBT />
      </header>
    </div>
  );
}

export default App;
