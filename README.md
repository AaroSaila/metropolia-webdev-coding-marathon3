# Coding Marathon 3  

- **Group #:**  Group 3
- Link to the backend:   
  - [Code for API V1 (without authentication)](https://github.com/AaroSaila/metropolia-webdev-coding-marathon3/tree/api-v1/backend)  
  - [Code for API V2 (with authentication)](https://github.com/AaroSaila/metropolia-webdev-coding-marathon3/tree/api-v2/backend)    
  - [Backend Tests for API V1](https://github.com/AaroSaila/metropolia-webdev-coding-marathon3/tree/api-v1-test/backend/tests)
  - [Backend Tests for API v2](https://github.com/AaroSaila/metropolia-webdev-coding-marathon3/tree/api-v2-test/backend/tests)  
- Link to the frontend:    
  - [Code for the final frontend](https://github.com/AaroSaila/metropolia-webdev-coding-marathon3/tree/frontend-auth-backend-v2/frontend)    
- URLs for the deployed APIs and Frontend:
  - URL for Frontend with API V2: [JobSearch WebSite](https://metropolia-webdev-coding-marathon3-2.onrender.com/)
  - URL for API V1: [API for V1 deployed on Render, example URL to get all jobs](https://metropolia-webdev-coding-marathon3.onrender.com/api/jobs)  
  - URL for API V2: [API for V2 deployed on Render, example URL to get all users](https://metropolia-webdev-coding-marathon3-1.onrender.com/api/users)

---

# Self-Assessment and Improvements

## Backend Improvements

## Example 1: Improving Login User Functionality

Initially, our `loginUser` endpoint was functional but lacked robustness in handling the body of the request. Here's the original implementation:

```javascript
export const loginUser = async (req, res) => {
    const { username, password } = req.query;

    const user = await User.findOne({username});

    if (user === null) {
        return res.status(400).json({error: `No user with username ${username}`});
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
        return res.status(401).json({error: "Incorrect password"});
    }

    const token = jwt.sign(JSON.stringify(user), process.env.SECRET);

    return res.status(200).json({ msg: "User logged in", token });
}
```

This version worked, but it relied on query parameters instead of the request body, which is not standard for login functionality. To address this, we refactored the code to improve usability and adhere to RESTful practices:

### Refactored Implementation

```javascript
export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    const user = await User.findOne({username});

    if (user === null) {
        return res.status(400).json({error: `No user with username ${username}`});
    }

    const passwordIsCorrect = await bcrypt.compare(password, user.password);

    if (!passwordIsCorrect) {
        return res.status(401).json({error: "Incorrect password"});
    }

    const token = jwt.sign(JSON.stringify(user), process.env.SECRET);

    return res.status(200).json({ msg: "User logged in", token });
}
```

### Key Improvements
1. **Standard Practice**: Switched from query parameters to request body for passing credentials.
2. **Improved Security**: Reduces exposure of sensitive data in the URL.
3. **Ease of Use**: Simplifies integration with modern frontends and standard HTTP clients.

---

## Example 2: Adding CORS Middleware

Initially, our backend did not support cross-origin requests, which limited its usability in development and cross-platform integrations. Here's the original setup:

### Initial Setup

```javascript
import dotenv from "dotenv";
import express from "express";
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";
import { unknownEndpoint, errorHandler } from "./middleware/customMiddleware.js";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();
const app = express();

// Middlewares
app.use(express.json());

connectDB();

// Use the jobRouter for all "/jobs" routes
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
```

### Issue
Without the `cors` middleware, our application rejected requests from different origins, which was problematic for development environments with separate frontends.

### Refactored Implementation

```javascript
import dotenv from "dotenv";
import express from "express";
import jobRouter from "./routes/jobRouter.js";
import userRouter from "./routes/userRouter.js";
import { unknownEndpoint, errorHandler } from "./middleware/customMiddleware.js";
import connectDB from "./config/db.js";
import cors from "cors";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

connectDB();

// Use the jobRouter for all "/jobs" routes
app.use("/api/jobs", jobRouter);
app.use("/api/users", userRouter);

app.use(unknownEndpoint);
app.use(errorHandler);

export default app;
```

### Key Improvements
1. **CORS Support**: Added the `cors` middleware to allow cross-origin requests.
2. **Enhanced Compatibility**: Enabled seamless interaction between frontend and backend during development.
3. **Future-Proofing**: Prepared the backend for cross-platform integrations.

---

These improvements demonstrate a commitment to enhancing code quality, adherence to best practices, and readiness for production environments.

---

## Frontend Improvements

## Example 1: Refactoring Authentication in App Component

Initially, our `App` component handled authentication state directly using `useState` and localStorage. Here's the original implementation:

### Initial Setup

```javascript
const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user && user.token ? true : false;
  });

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/jobs/:id" element={<JobPage isAuthenticated={isAuthenticated} />} />
            <Route path="/jobs/add-job" element={isAuthenticated ? <AddJobPage /> : <Navigate to="/signup" />} />
            <Route path="/edit-job/:id" element={isAuthenticated ? <EditJobPage /> : <Navigate to="/signup" />} />
            <Route
              path="/signup"
              element={isAuthenticated ? <Navigate to="/" /> : <Signup setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route
              path="/login"
              element={isAuthenticated ? <Navigate to="/" /> : <Login setIsAuthenticated={setIsAuthenticated} />}
            />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </BrowserRouter>
    </div>
  );
};
```

While functional, this approach tightly coupled authentication logic to the `App` component, making it harder to manage and reuse.

### Refactored Implementation

```javascript
const App = () => {
  return (
    <AuthContextProvider>
      <div className="App">
        <BrowserRouter>
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/jobs/:id" element={<JobPage />} />
              <Route path="/add-job" element={<PrivateRoute element={<AddJobPage />} />} />
              <Route path="/edit-job/:id" element={<PrivateRoute element={<EditJobPage />} />} />
              <Route path="/signup" element={<PublicRoute element={<Signup />} />} />
              <Route path="/login" element={<PublicRoute element={<Login />} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </AuthContextProvider>
  );
};

const PrivateRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? element : <Navigate to="/login" />;
};

const PublicRoute = ({ element }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return !isAuthenticated ? element : <Navigate to="/" />;
};

export default App;
```

### Key Improvements
1. **Centralized State**: Moved authentication logic to a context (`AuthContextProvider`), improving separation of concerns.
2. **Reusable Routes**: Introduced `PrivateRoute` and `PublicRoute` components to handle conditional rendering based on authentication state.
3. **Scalability**: Simplified the `App` component, making it easier to scale.

---

## Example 2: Enhancing Login Component

Initially, the `Login` component directly managed authentication using a parent callback. Here's the original setup:

### Initial Setup

```javascript
import useField from "../hooks/useField";
import useLogin from "../hooks/useLogin";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const email = useField("email");
  const password = useField("password");

  const { login, error } = useLogin("/api/users/login");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await login({ email: email.value, password: password.value });
    if (!error) {
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
```

While functional, this approach lacked flexibility and relied on parent components to manage authentication state.

### Refactored Implementation

```javascript
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
```

### Key Improvements
1. **Context Integration**: Used `AuthContext` for setting the authentication state.
2. **Dynamic Configuration**: Leveraged environment variables for the API base URL, improving flexibility.
3. **Enhanced Feedback**: Added error messages for failed login attempts, improving the user experience.

---

These changes showcase a move toward scalable, maintainable, and user-friendly frontend code.

---

## Contributions

| Member Name            | Tasks Completed                               | Contribution (%) |
|------------------------|-----------------------------------------------|------------------|
| Aaro                   | Backend                                       | 25%              |
| Valtteri               | Backend                                       | 25%              |
| Liu                    | Frontend                                      | 25%              |
| Oleg                   | Frontend                                      | 25%              |

