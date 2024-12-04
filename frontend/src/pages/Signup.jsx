import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";

import { AuthContext } from "../context/AuthContext";

const Signup = () => {
  const { setIsAuthenticated } = useContext(AuthContext)
  const navigate = useNavigate();

  const name = useField("text", true);
  const username = useField("text", true);
  const password = useField("password", true);
  const phoneNumber = useField("text", true);
  const gender = useField("text", true);
  const dateOfBirth = useField("date", true);
  const membershipStatus = useField("text", true);

  const address = useField("text", true);
  const profilePicture = useField("file", false, "image/*");

  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    await signup({
      username: username.value,
      password: password.value,
      name: name.value,
      phone_number: phoneNumber.value,
      gender: gender.value,
      date_of_birth: dateOfBirth.value,
      membership_status: membershipStatus.value,
      address: address.value,
      profilePicture: profilePicture.value,
    });
    if (!error) {
      const user = JSON.parse(localStorage.getItem("user"))
      if (user) {
        setIsAuthenticated(true)
        navigate("/")
      }
    }
  };

  return (
    <div className="create">
      <h2>Sign Up</h2>
      <form onSubmit={handleFormSubmit}>
        <label>Username:</label>
        <input {...username} />

        <label>Password:</label>
        <input {...password} />

        <label>Name:</label>
        <input {...name} />
        <label>Phone Number:</label>
        <input {...phoneNumber} />
        <label>Gender:</label>
        <input {...gender} />
        <label>Date of Birth:</label>
        <input {...dateOfBirth} />
        <label>Membership Status:</label>
        <input {...membershipStatus} />

        <label>Address:</label>
        <input {...address} />
        <label>Profile Picture:</label>
        <input {...profilePicture} />
        <button>Sign up</button>
      </form>
    </div>
  );
};

export default Signup;
