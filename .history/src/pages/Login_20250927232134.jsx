import { useState } from 'react';
import AuthService from '../Services/AuthServices';
import { NavLink, useNavigate } from 'react-router-dom';
const Login = () => {
  
    // const [name , setName] = useState('');
    const [email , setEmail] = useState('');
    const [password , setPassword] = useState('');

  const [message, setMessage] = useState('');
const navigate = useNavigate();

 

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const data = { email, password};
        const res = await AuthService.LoginUser(data);
         localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));
        console.log(res);
        setMessage('Login successful!');
        navigate('/home');

    } catch (err) {
      alert("Login Failed");
      console.error("Login error:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
         
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={email}
              onChange={(e)=>{setEmail(e.target.value)}}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e)=>{setPassword(e.target.value)}}
              required
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
          >
            Login
          </button>
          <p>if you dont have an account please <NavLink to="/" className="text-blue-500">Register</NavLink></p>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-red-500">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Login;