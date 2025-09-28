import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdDelete } from "react-icons/md";





const App = () => {
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const [type, setType] = useState("password")
  const [icon, seticon] = useState(<FaEye  />)
  useEffect(() => {
    let password = localStorage.getItem("password");
    if (password) {
      setpasswordArray(JSON.parse(password));
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const savePassword = () => {
   
    const uid=  '_' + Math.random().toString(36).substr(2, 9);
  
    setpasswordArray([...passwordArray, { ...form, id:uid} ]);
    localStorage.setItem("password",JSON.stringify([...passwordArray,{ ...form, id:uid}]))
    console.log([...passwordArray, form]);
  };
const resetTable=()=>{
  // setpasswordArray([])
  localStorage.removeItem("password")
  window.location.reload();

  
}

const showPassword = () => {
  if (type === "password") {
    setType("text");
    seticon(<FaEye />);
  } else {
    setType("password");
    seticon(<FaEyeSlash />);
  }
}

const deletePassword = (id) => {
  const updatedArray = passwordArray.filter((item) => item.id !== id); // Filter out the item with the given id
  setpasswordArray(updatedArray); // Update the state with the filtered array
  localStorage.setItem("password", JSON.stringify(updatedArray)); // Update localStorage
};



  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen overflow-x-hidden py-8">
        <h1 className="text-blue-900 text-4xl font-extrabold text-center mb-8 drop-shadow-lg">Password Manager</h1>
        <div className="flex flex-col items-center gap-4 mb-8">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Website Name"
            className="rounded-xl border-2 outline-none border-blue-500 p-3 w-full max-w-md shadow focus:border-blue-700 transition"
            type="text"
            name="site"
          />
          <input
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="rounded-xl border-2 outline-none border-blue-500 p-3 w-full max-w-md shadow focus:border-blue-700 transition"
            type="text"
            name="username"
          />
          <div className="relative w-full max-w-md">
            <input
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="rounded-xl border-2 outline-none border-blue-500 p-3 w-full shadow focus:border-blue-700 transition"
              type={type}
              name="password"
            />
            <span
              onClick={showPassword}
              className="absolute right-3 top-3 cursor-pointer text-blue-700 hover:text-blue-900 text-xl"
            >
              {icon}
            </span>
          </div>
          <div className="flex gap-4 mt-2">
            <button
              onClick={savePassword}
              className="px-6 py-2 rounded-md bg-blue-700 text-white font-semibold shadow hover:bg-blue-900 transition"
            >
              Add Password
            </button>
            <button
              className="px-6 py-2 rounded-md bg-red-500 text-white font-semibold shadow hover:bg-red-700 transition"
              onClick={resetTable}
            >
              Reset All
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
          {passwordArray &&
            passwordArray.map((item, index) => (
              <div
                key={item.id}
                className="bg-white rounded-xl shadow-lg p-6 flex flex-col gap-2 border border-blue-100 hover:scale-105 transition"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold text-blue-800">{item.site}</span>
                  <button
                    onClick={() => deletePassword(item.id)}
                    className="text-red-600 hover:text-red-800 text-xl"
                    title="Delete"
                  >
                    <MdDelete />
                  </button>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Username:</span>
                  <span className="ml-2 text-gray-900">{item.username}</span>
                </div>
                <div>
                  <span className="text-gray-700 font-medium">Password:</span>
                  <span className="ml-2 text-gray-900">{item.password}</span>
                </div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default App;
