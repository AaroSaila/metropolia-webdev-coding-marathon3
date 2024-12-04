import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext)

  const navigate = useNavigate();
  const email = useField("email");
  const password = useField("password");

  const { login, error } = useLogin("/api/users/login");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await login({ email: email.value, password: password.value });
    if (!error) {
      console.log("success");
      setIsAuthenticated(true);
      navigate("/");
    }
  };


  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
      <label>Email address:</label>
        <input {...email} />
        <label>Password:</label>
        <input {...password} />
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Login;
