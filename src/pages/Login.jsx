
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '/src/assets/logo.png';

const Login = () => {
  const navigate = useNavigate();
  const [showManagerLogin, setShowManagerLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleEmployeeClick = () => {
    navigate('/employee/pos');
  };

  const handleManagerLogin = (e) => {
    e.preventDefault();
    // Simple mock auth
    if (username === 'admin' && password === 'admin') {
      navigate('/manager/dashboard');
    } else {
      
      alert('Invalid credentials');
    }
  };

  return (
    <div className="flex h-screen bg-[#133b32] text-white overflow-hidden color">
      {/* Left Side - Logo */}
      <div className="w-1/2 flex flex-col items-center justify-center bg-dark relative">
        <div className="bg-[#133b32] w-full h-full absolute top-0 left-0 opacity-50"></div>
        <div className="z-10 flex flex-col items-center">
            {/* Mock Logo Circle */}
            <img src={logo} alt="GoodLand CAI Logo" className="w-40 h-40" />
            <h1 className="text-4xl font-bold text-[#fef08a] ">GoodLand CAI</h1>
        </div>
      </div>

      {/* Right Side - Buttons or Form */}
      <div className="w-1/2 bg-[#fef9c3] text-black flex flex-col items-center justify-center relative">
        {!showManagerLogin ? (
          <div className="flex flex-col space-y-6 w-64">
            <button 
              onClick={handleEmployeeClick}
              className="py-4 bg-white border-2 border-black rounded-lg text-xl font-bold hover:bg-gray-100 transition shadow-md"
            >
              EMPLOYEE
            </button>
            <button 
              onClick={() => setShowManagerLogin(true)}
              className="py-4 bg-white border-2 border-black rounded-lg text-xl font-bold hover:bg-gray-100 transition shadow-md"
            >
              MANAGER
            </button>
          </div>
        ) : (
          <form onSubmit={handleManagerLogin} className="flex flex-col space-y-4 w-80">
            <div>
                <label className="block font-bold mb-1">Username</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-2 border-2 border-gray-400 rounded-lg"
                />
            </div>
            <div>
                <label className="block font-bold mb-1">Password</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2 border-2 border-gray-400 rounded-lg"
                />
            </div>
            <button 
                type="submit"
                className="mt-4 py-2 bg-white border-2 border-black rounded-lg text-lg font-bold hover:bg-gray-100"
            >
                Login
            </button>
            <button 
                type="button"
                onClick={() => setShowManagerLogin(false)}
                className="text-sm text-center mt-2"
            >
                Back to selection
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Login;
