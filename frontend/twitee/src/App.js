import { BrowserRouter, Link, Route, Switch, HashRouter } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Scheduler from './Components/Scheduler';
import Createaccount from './Components/Createaccount';

function App() {
  return (
    // <BrowserRouter>
    //   <div className="mainContainer">
    //     <Navbar />
    //     {/* <Createaccount/> */}
    //     <Routes>
    //       <Route path="/login" component = {<Createaccount/>}/> 
            
    //       <Route path = "/dashboard" component = {<Scheduler/>}/> 
    //     </Routes>
    //   </div>
    // </BrowserRouter>

    <HashRouter>
      <div className="mainContainer">
        <Navbar></Navbar>
        <Switch>
          <Route exact path="/login"><Createaccount/> </Route>
          <Route exact path="/dashboard"><Scheduler/></Route>
        </Switch>
      </div>
    </HashRouter>
  );
}

export default App;