import { useState } from "react";
import "./AuthModal.css";
import axios from 'axios';

function AuthModal({ type, onClose, setUser }) {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let res;
      if (type === "signup") {
        res = await axios.post("http://localhost:5000/api/auth/register", {
          email,
          name,
          password,
          confirmPassword
        });
        alert("Account created!");
      } else {
        res = await axios.post("http://localhost:5000/api/auth/login", {
          email,
          password,
        });
        alert("Logged in!");
      }
      localStorage.setItem("user", JSON.stringify(res.data.user.name));
      setUser(res.data.user.name);
      // localStorage.setItem("token", res.data.token);
      console.log("User:", res.data.user.name);

      onClose();
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong.");
      console.error(error);
    }
  };


return ( 
  <div className="auth-modal-overlay">
    <div className="auth-modal">
      <button className="close-button" onClick={onClose}>×</button>
      <h2>{type === "signup" ? "Sign Up" : "Log In"}</h2>
      <form onSubmit={handleSubmit}>
        {type === "signup" && (
          <>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {type === "signup" && (
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button type="submit">{type === "signup" ? "Sign Up" : "Log In"}</button>
      </form>
    </div>
  </div>
);

}

export default AuthModal;