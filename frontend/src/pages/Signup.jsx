import useField from "../hooks/useField";
import useSignup from "../hooks/useSignup";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContextProvider";

const Signup = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const name = useField("text", true);
  const username = useField("text", true);
  const password = useField("password", true);
  const phoneNumber = useField("text", true);
  const gender = useField("text", true);
  const dateOfBirth = useField("date", true);
  const membershipStatus = useField("text", true);
  const address = useField("text", true);
  const profilePictureUrl = useField("text", false);

  const { signup, error } = useSignup("/api/users/signup");

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const success = await signup({
      username: username.value,
      password: password.value,
      name: name.value,
      phone_number: phoneNumber.value,
      gender: gender.value,
      date_of_birth: dateOfBirth.value,
      membership_status: membershipStatus.value,
      address: address.value,
      profile_picture: profilePictureUrl.value,
    });

    if (success) {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user) {
        setIsAuthenticated(true);
        navigate("/");
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
        <select value={gender.value} onChange={gender.onChange} required>
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Others">Others</option>
        </select>
        <label>Date of Birth:</label>
        <input {...dateOfBirth} />
        <label>Membership Status:</label>
        <select value={membershipStatus.value} onChange={membershipStatus.onChange} required>
          <option value="">Select Status</option>
          <option value="member">Member</option>
          <option value="non-member">Non-Member</option>
        </select>

        <label>Address:</label>
        <input {...address} />
        <label>Profile Picture URL:</label>
        <input {...profilePictureUrl} />
        <button>Sign up</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default Signup;