import { BrowserRouter as Router, Route , Routes} from "react-router-dom";
import './App.css';
import Home from "./components/layout/Home";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/layout/Navbar";
// Redux
import { Provider } from "react-redux";
import store from "./store";
const App = () => {
  return (
    <>
    <Provider store={store}>
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" Component={Home}/>
            <Route exact path="/register" Component={Register}/>
            <Route exact path="/login" Component={Login}/>
      </Routes>
    </Router>
    </Provider>
    </>
  );
}
export default App;
