import React, { useState } from "react";
import Navbar from "./component/Navbar";
import Home from "./component/Home";
import About from "./component/About";
import NoteState from "./context/notes/NoteState";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import Alert from "./component/Alert";
import Login from "./component/Login";
import Signup from "./component/Signup";

function App() {

  const [alert, setAlert] = useState(null)

  const showAlert = (message, type) => {
    setAlert({
      msg: message,
      type: type
    })
    setTimeout(() => {
      setAlert(null)
    }, 1500);
  }


  return (
    <>
      <NoteState>

        <Router>
          <Navbar />

          <Alert alert={alert} />
          <div className="container">

            <Routes>
              <Route exact path='/' element={<Home showAlert={showAlert} />} />
              <Route exact path='/about' element={<About />} />
              <Route exact path='/login' element={<Login showAlert={showAlert} />} />
              <Route exact path='/signup' element={<Signup showAlert={showAlert} />} />
            </Routes>

          </div>
        </Router>

      </NoteState>


    </>
  );
}
export default App;
