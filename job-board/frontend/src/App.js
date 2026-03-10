import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Home from "./Home";
import AddJob from "./AddJob";
import Login from "./Login";
import Signup from "./Signup";
import { useState } from "react";
import JobDetail from "./JobDetail";
import Apply from "./Apply";
import logo from "./images/logo.png";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
  };

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        <img src={logo} alt="Job Board Logo" className="logo"/>

        <nav>
          <Link to="/">Home</Link> |{" "}

          {isLoggedIn && (
            <>
              <Link to="/add">Add Job</Link> |{" "}
            </>
          )}

          {!isLoggedIn ? (
            <>
              <Link to="/login">Login</Link> |{" "}
              <Link to="/signup">Signup</Link>
            </>
          ) : (
            <button onClick={logout}>Logout</button>
          )}
        </nav>

        <hr />

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/add" element={<AddJob />} />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/job/:id" element={<JobDetail />} />
          <Route path="/apply/:id" element={<Apply />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
