import React, { useState } from 'react';
import email_icon from '../Assets/person.png';
import password_icon from '../Assets/password.png';
import './Register.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [values, setValues] = useState({
    username: '',
    password: '',
    email: ''
  });
  const navigate = useNavigate();

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await axios.post("https://yuva-res.onrender.com/register", values);
      console.log(res.data);
      alert('Registration successful');
      navigate('/login');
    } catch (error) {
      console.log(error.response);
      if (error.response && error.response.status === 400) {
        alert('Registration failed. User may already exist.');
      } else {
        alert('An error occurred. Please try again later.');
      }
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div className="text">Register</div>
        <div className="underline"></div>
      </div>
      <form className="inputs" onSubmit={handleSubmit}>
        <div className="input">
          <img src={email_icon} alt="User Icon" />
          <input type="text" placeholder="USERNAME" name="username" onChange={handleChange} required />
        </div>
        <div className="input">
          <img src={email_icon} alt="Email Icon" />
          <input type="email" placeholder="EMAIL" name="email" onChange={handleChange} required />
        </div>
        <div className="input">
          <img src={password_icon} alt="Password Icon" />
          <input type="password" placeholder="PASSWORD" name="password" onChange={handleChange} required />
        </div>
        <div className="submit-container">
          <button className="submit" type="submit">Register</button>
        </div>
      </form>
      <div className="forgot-password">Already have an account? <a href='/login'>Login here!</a></div>
    </div>
  );
};

export default Register;
