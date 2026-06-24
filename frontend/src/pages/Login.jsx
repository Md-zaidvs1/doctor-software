import React from 'react';

const Login = () => {
  return (
    <div className="login-container">
      <h1>Plant2Tree Doctor Software</h1>
      <h3>Clinic Management System</h3>
      
      <form>
        <button type="submit">Login</button>
      </form>

      <p>Logging in...</p>
      <p>Login failed. Please check your email and password.</p>

      <footer>Plant2Tree Doctor Software © 2026</footer>
    </div>
  );
};

export default Login;