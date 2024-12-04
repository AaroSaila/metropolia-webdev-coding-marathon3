import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";

import AuthContextProvider from "./context/AuthContextProvider";
import { AuthContext } from "./context/AuthContext"

// pages & components
import Navbar from "./components/Navbar";
import Home from "./pages/HomePage";
import AddJobPage from "./pages/AddJobPage";
import JobPage from "./pages/JobPage";
import EditJobPage from "./pages/EditJobPage";
import NotFoundPage from "./pages/NotFoundPage";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

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
              <Route path="/add-job" element={<PrivateRoute component={AddJobPage} />} />
              <Route path="/edit-job/:id" element={<PrivateRoute component={EditJobPage} />} />
              <Route path="/signup" element={<PublicRoute component={Signup} />} />
              <Route path="/login" element={<PublicRoute component={Login} />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </div>
        </BrowserRouter>
      </div>
    </AuthContextProvider>
  );
};

const PrivateRoute = ({ component: Component }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return isAuthenticated ? <Component /> : <Navigate to="/login" />;
};

const PublicRoute = ({ component: Component }) => {
  const { isAuthenticated } = useContext(AuthContext);
  return !isAuthenticated ? <Component /> : <Navigate to="/" />;
};

export default App;
