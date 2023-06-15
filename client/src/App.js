import { BrowserRouter as Router, Route , Routes , Switch} from "react-router-dom";
import './App.css';
import Home from "./components/layout/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";

const App = () => {
  return (
    <>
    <Router>
      <Routes>
        <Route path="/" Component={Home}/>
        <section>
          <Switch>
            <Route exact path="/register" Component={Register}/>
            <Route exact path="/login" Component={Login}/>
          </Switch>
        </section>
      </Routes>
    </Router>
    </>
  );
}
export default App;
