import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { isAuthenticated, logout } = useContext(AuthContext)
  const navigate = useNavigate();

  const handleClick = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="navbar">
      <Link to="/">
        <h1>React Jobs</h1>
      </Link>
      <div className="links">
        <div>
          {isAuthenticated ?
            <><Link to="/add-job">Add Job</Link>
              <button onClick={handleClick}>Log Out</button></> :
            <><Link to="/login">Log In</Link>
              <Link to="/signup">Sign Up</Link>
            </>
          }
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
