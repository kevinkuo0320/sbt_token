import '../App.css';
import User from "../component/user.js"; 
import ButtonAppBar from "../component/bar.js"; 

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

