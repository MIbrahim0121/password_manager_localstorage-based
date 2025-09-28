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
   
    const uid=  '_' + Math.random().toString(36).substring(2, 9);
  
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
        <div className="overflow-x-auto px-4">
  <table className="min-w-full bg-white rounded-xl shadow-lg border border-blue-200">
    <thead>
      <tr className="bg-blue-100">
        <th className="py-3 px-4 text-left font-semibold text-blue-800 rounded-tl-xl">Website</th>
        <th className="py-3 px-4 text-left font-semibold text-blue-800">Username</th>
        <th className="py-3 px-4 text-left font-semibold text-blue-800">Password</th>
        <th className="py-3 px-4 text-center font-semibold text-blue-800 rounded-tr-xl">Actions</th>
      </tr>
    </thead>
    <tbody>
      {passwordArray &&
        passwordArray.map((item, index) => (
          <tr
            key={item.id}
            className="hover:bg-blue-50 transition"
          >
            <td className="py-3 px-4 border-b border-blue-100">{item.site}</td>
            <td className="py-3 px-4 border-b border-blue-100">{item.username}</td>
            <td className="py-3 px-4 border-b border-blue-100">{item.password}</td>
            <td className="py-3 px-4 border-b border-blue-100 text-center">
              <button
                onClick={() => deletePassword(item.id)}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 text-xl"
                title="Delete"
              >
                <MdDelete />
                <MdDelete />
              </button>
            </td>
          </tr>
        ))}
    </tbody>
  </table>
</div>
      </div>
    </>
  );
};

export default App;
