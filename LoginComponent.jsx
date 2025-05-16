import React, { useState } from 'react';
import axios from 'axios';

const LoginComponent = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [message, setMessage] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/login', form);
      localStorage.setItem('token', res.data.accessToken);
      setMessage('Login successful!');
      setIsLoggedIn(true);
    } catch (err) {
      setMessage('Login failed. Invalid email or password.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setMessage('Logged out.');
    setForm({ email: '', password: '' });
  };

  return (
    <div className="p-4 max-w-sm mx-auto border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">{isLoggedIn ? 'Welcome' : 'Login'}</h2>

      {!isLoggedIn ? (
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="block mb-1 font-semibold">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <div className="mb-3">
            <label className="block mb-1 font-semibold">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Login
          </button>
        </form>
      ) : (
        <div>
          <p className="mb-4">You are now logged in.</p>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white py-2 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}

      {message && <p className="mt-4 text-center text-sm text-gray-700">{message}</p>}
    </div>
  );
};

export default LoginComponent;
