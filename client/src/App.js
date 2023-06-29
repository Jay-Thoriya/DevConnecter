import { BrowserRouter as Router, Route , Routes} from "react-router-dom";
import './App.css';
import Home from "./components/layout/Home";
import React ,  { useEffect } from "react";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import Navbar from "./components/layout/Navbar";
import setAuthToken from "./utils/setAuthToken";
import { loadUser } from "./action/auth";
// Redux
import { Provider } from "react-redux";
import store from "./store";


if(localStorage.token){
  setAuthToken(localStorage.token);
}

const App = () => {

  useEffect(()=>{
    store.dispatch(loadUser())
  }, []);

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
