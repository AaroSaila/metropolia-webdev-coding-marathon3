import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider"; // Correct import

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const Login = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const username = useField("text");
  const password = useField("password");

  const { login, error } = useLogin(`${API_BASE_URL}/api/users/login`);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const user = await login({ username: username.value, password: password.value });

    if (user) {
      setIsAuthenticated(true);
      navigate("/");
    }
  };

  return (
    <div className="create">
      <h2>Login</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Username:</label>
        <input {...username} />
        <label>Password:</label>
        <input {...password} />
        <button type="submit">Log in</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Login;
