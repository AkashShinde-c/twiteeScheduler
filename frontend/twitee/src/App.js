import logo from './logo.svg';
import './App.css';
import Navbar from './Components/Navbar';
import Scheduler from './Components/Scheduler';

function App() {
  return (
    <div className="mainContainer">
       <Navbar/>
       <Scheduler/>
    </div>
  );
}

export default App;
