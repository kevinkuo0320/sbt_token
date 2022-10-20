import '../App.css';
import SBT from "../component/admin.js"; 
import ButtonAppBar from "../component/bar.js"; 

function AdminPage() {
  return (
    <div className="App">
      <header className="App-header">
        <ButtonAppBar/>  
       <SBT />
      </header>
    </div>
  );
}

export default AdminPage;

