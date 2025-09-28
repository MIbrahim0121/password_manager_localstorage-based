import React, { useState, useEffect } from "react";
import Navbar from "./component/Navbar";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';




const App = () => {
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const [type, setType] = useState("password")
  const [icon, seticon] = useState(<FaEye />)
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

    // const uid=  '_' + Math.random().toString(36).substring(2, 9);

    setpasswordArray([...passwordArray, { ...form, id: uuidv4() }]);
    localStorage.setItem("password", JSON.stringify([...passwordArray, { ...form, id: uuidv4() }]))
    setForm({ site: "", username: "", password: "" });
    console.log([...passwordArray, form]);
  };

  const deletePassword = (id) => {
    const updatedArray = passwordArray.filter((item) => item.id !== id); // Filter out the item with the given id
    setpasswordArray(updatedArray); // Update the state with the filtered array
    localStorage.setItem("password", JSON.stringify(updatedArray)); // Update localStorage

    // setpasswordArray([...passwordArray,{...form,id:uuidv4()}])
    // localStorage.setItem("password", JSON.stringify([...passwordArray,{...form,id:uuidv4()}]))
  };

  const editPassword=(id)=>{
    // setForm(passwordArray.filter((item)=>{item.id===id}))
    setForm({...form,id:id})
  }

  const resetTable = () => {
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

  return (
    <>
      <Navbar />
      <div className="bg-gradient-to-br from-blue-100 via-blue-200 to-blue-300 min-h-screen overflow-x-hidden py-8">
        <h1 className="text-blue-900 text-3xl md:text-4xl font-extrabold text-center mb-8 drop-shadow-lg">Password Manager</h1>
        <div className="flex flex-col items-center gap-4 mb-8 px-2">
          <input
            value={form.site}
            onChange={handleChange}
            placeholder="Website Name"
            className="rounded-xl border-2 outline-none border-blue-500 p-3 w-full max-w-md shadow focus:border-blue-700 transition text-sm md:text-base"
            type="text"
            name="site"
          />
          <input
            value={form.username}
            onChange={handleChange}
            placeholder="Username"
            className="rounded-xl border-2 outline-none border-blue-500 p-3 w-full max-w-md shadow focus:border-blue-700 transition text-sm md:text-base"
            type="text"
            name="username"
          />
          <div className="relative w-full max-w-md">
            <input
              value={form.password}
              onChange={handleChange}
              placeholder="Password"
              className="rounded-xl border-2 outline-none border-blue-500 p-3 w-full shadow focus:border-blue-700 transition text-sm md:text-base"
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
          <div className="flex flex-col md:flex-row gap-4 mt-2 w-full max-w-md">
            <button
              onClick={savePassword}
              className="px-6 py-2 rounded-md bg-blue-700 text-white font-semibold shadow hover:bg-blue-900 transition w-full md:w-auto"
            >
              Add Password
            </button>
            <button
              className="px-6 py-2 rounded-md bg-red-500 text-white font-semibold shadow hover:bg-red-700 transition w-full md:w-auto"
              onClick={resetTable}
            >
              Reset All
            </button>
          </div>
        </div>

        <div className="overflow-x-auto px-2 md:px-4">
          <table className="min-w-full bg-white rounded-xl shadow-lg border border-blue-200 text-xs md:text-base">
            <thead>
              <tr className="bg-blue-100">
                <th className="py-2 md:py-3 px-2 md:px-4 text-left font-semibold text-blue-800 rounded-tl-xl">Website</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left font-semibold text-blue-800">Username</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-left font-semibold text-blue-800">Password</th>
                <th className="py-2 md:py-3 px-2 md:px-4 text-center font-semibold text-blue-800 rounded-tr-xl">Actions</th>
              </tr>
            </thead>
         <tbody>
  {passwordArray && passwordArray.length > 0 ? (
    passwordArray.map((item) => (
      <tr
        key={item.id}
        className="hover:bg-blue-50 transition"
      >
        <td className="py-2 md:py-3 px-2 md:px-4 border-b border-blue-100 break-all">{item.site}</td>
        <td className="py-2 md:py-3 px-2 md:px-4 border-b border-blue-100 break-all">{item.username}</td>
        <td className="py-2 md:py-3 px-2 md:px-4 border-b border-blue-100 break-all">{item.password}</td>
        <td className="py-2 md:py-3 px-2 md:px-4 border-b border-blue-100 text-center">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => editPassword(item.id)}
              className="text-blue-600 hover:text-blue-800 text-xl"
              title="Edit"
            >
              <MdEdit />
            </button>
            <button
              onClick={() => deletePassword(item.id)}
              className="text-red-600 hover:text-red-800 text-xl"
              title="Delete"
            >
              <MdDelete />
            </button>
          </div>
        </td>
      </tr>
    ))
  ) : (
    <tr>
      <td
        colSpan="4"
        className="py-4 text-center text-gray-500"
      >
        No saved passwords found
      </td>
    </tr>
  )}
</tbody>

          </table>
        </div>

      </div>
    </>
  );
};

export default App;
