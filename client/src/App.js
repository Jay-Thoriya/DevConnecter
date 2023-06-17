import { BrowserRouter as Router, Route , Routes} from "react-router-dom";
import './App.css';
import Home from "./components/layout/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/layout/Navbar";

const App = () => {
  return (
    <>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" Component={Home}/>
            <Route exact path="/register" Component={Register}/>
            <Route exact path="/login" Component={Login}/>
      </Routes>
    </Router>
    </>
  );
}
export default App;
