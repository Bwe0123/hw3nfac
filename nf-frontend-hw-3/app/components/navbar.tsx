"use client"
"use client"
import React, { useState, useEffect } from 'react';
import RegistrationForm from './RegistrationForm';
import LoginForm from './LoginForm';

const Navbar = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [showRegistration, setShowRegistration] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  const handleSearchChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value);
  };

  const handleRegistrationToggle = () => {
    setShowRegistration(!showRegistration);
    setShowLogin(false);
  };

  const handleLoginToggle = () => {
    setShowLogin(!showLogin);
    setShowRegistration(false);
  };

  const handleRegister = (username, email, password) => {
    const newUser = { username, email, password };
    localStorage.setItem('user', JSON.stringify(newUser));
    setUser(newUser);
    setShowRegistration(false);
  };

  const handleLogin = (username, password) => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser && storedUser.username === username && storedUser.password === password) {
      setUser(storedUser);
      setShowLogin(false);
    } else {
      alert('Invalid username or password');
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <>
      <div className="bg-gray-200 w-full fixed top-0 z-10">
        <div className="navbar h-16 md:h-24 flex flex-wrap justify-between items-center p-4">
          <div className="ml-2 text-black text-xl md:text-3xl">n!posts</div>
          <div className="flex-1 flex justify-center items-center mt-4 md:mt-0">
            <input
              type="text"
              value={query}
              onChange={handleSearchChange}
              placeholder="Search..."
              className="w-full max-w-md p-2 border border-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex md:space-x-8 items-center mt-4 md:mt-0">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <img src="https://via.placeholder.com/40" alt="User icon" className="rounded-full" />
                  <span className="text-black text-lg">{user.username}</span>
                </div>
                <button onClick={handleLogout} className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700">Logout</button>
              </div>
            ) : (
              <>
                <button onClick={handleLoginToggle} className="bg-black text-white py-2 px-4 rounded hover:bg-blue-700">Login</button>
                <button onClick={handleRegistrationToggle} className="bg-black text-white py-2 px-4 rounded hover:bg-green-700">Register</button>
              </>
            )}
            <button className="bg-black text-white py-2 px-4 rounded hover:bg-green-700">Add</button>
          </div>
        </div>
      </div>
      {showRegistration && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <RegistrationForm onRegister={handleRegister} />
            <button onClick={handleRegistrationToggle} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Close</button>
          </div>
        </div>
      )}
      {showLogin && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg">
            <LoginForm onLogin={handleLogin} />
            <button onClick={handleLoginToggle} className="mt-4 bg-red-500 text-white py-2 px-4 rounded">Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
