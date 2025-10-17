import { useState, useEffect } from "react";
import Navbar from "../component/Navbar.jsx";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
// import { v4 as uuidv4 } from 'uuid';
import Swal from "sweetalert2";

import PasswordService from "../Services/PasswordService.js";




const App = () => {
  const [form, setForm] = useState({ site: "", username: "", password: "" });
  const [passwordArray, setpasswordArray] = useState([]);
  const [type, setType] = useState("password")
  const [icon, seticon] = useState(<FaEye />)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  useEffect(() => {
    const fetchPasswords = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user || !user._id) {
          console.warn("No user in localStorage, abort fetching passwords");
          return;
        }
        const id = user._id;
        console.log(id);

        const res = await PasswordService.getAllPasswords(id);

        // be defensive about response shape
        const payload = res?.data?.data ?? res?.data ?? [];
        setpasswordArray(Array.isArray(payload) ? payload : []);
        console.log("Passwords fetched:", payload);
      } catch (err) {
        console.error("fetchPasswords error:", err);
      }
    };
    fetchPasswords();
  }, []);

  const savePassword = async () => {
    if (!form.site || !form.username || !form.password) return alert("Please fill all fields");
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user._id) return alert("User not found. Please log in again.");
      const createdBy = user._id;
      const data = { ...form, createdBy };
      const res = await PasswordService.createPassword(data);

      // handle different response shapes (res.data or res.data.data)
      const newItem = res?.data?.data ?? res?.data;
      if (!newItem) return console.warn("createPassword returned no item", res);

      setpasswordArray((prev) => [...prev, ...(Array.isArray(newItem) ? newItem : [newItem])]);
      // localStorage.setItem("password", JSON.stringify(passwordArray));
      console.log("Password saved:", newItem);
      setForm({ site: "", username: "", password: "" });
      Swal.fire({ icon: "success", title: "Password Saved", timer: 2000, showConfirmButton: false });
    } catch (err) {
      console.error(err);
    }
  };

  const deletePassword = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This password will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await PasswordService.deletePassword(id);
          console.log(res);

          setpasswordArray(passwordArray.filter((item) => item._id !== id)); // ✅ use _id
          Swal.fire("Deleted!", "Your password has been deleted.", "success");
        } catch (err) {
          console.error(err);
        }
      }
    });
  };

  const editPassword = async (id) => {
    try {
      // find the item first
      const pw = passwordArray.find((item) => item._id === id);
      if (!pw) return;

      // populate form with the item's values
      setForm({ site: pw.site, username: pw.username, password: pw.password });

      // optimistic UI: remove item locally now, but keep a reference to restore on failure
      setpasswordArray((prev) => prev.filter((item) => item._id !== id));

      // delete on backend so item is removed from DB too
      try {
        const res = await PasswordService.deletePassword(id);
        console.log("Deleted on server:", res);
        Swal.fire({ icon: "success", title: "Ready to edit", text: "Item removed from list and loaded into form", timer: 1400, showConfirmButton: false });
      } catch (err) {
        // restore locally if server delete fails
        setpasswordArray((prev) => [pw, ...prev]);
        console.error("Failed to delete on server:", err);
        Swal.fire({ icon: "error", title: "Server delete failed", text: "Couldn't remove item from server. Edit cancelled." });
      }
    } catch (error) {
      console.error(error);
    }
  };


  const resetTable =  () => {
    // setpasswordArray([])

    if (passwordArray.length > 0) {


      Swal.fire({
        title: "Are you sure?",
        text: "Your all the password will be permanently deleted!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          const user = JSON.parse(localStorage.getItem("user"));
          if (!user || !user._id) return alert("User not found. Please log in again.");
          const id = user._id;
          const res = await PasswordService.deleteAllPasswords(id);
          console.log(res);
          localStorage.removeItem("password")
          setpasswordArray([])
          // window.location.reload();

          Swal.fire("Deleted!", "Your password has been deleted.", "success");
        }
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Nothing to delete...',
        text: 'Your password table is empty',
      })
    }
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
            type="email"
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
                passwordArray
                  // .filter(item => item !== undefined && item !== null) // ✅ Undefined items remove karen
                  .map((item) => (
                    <tr
                      key={item._id}
                      className="hover:bg-blue-50 transition"
                    >
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-blue-100 break-all">{item.site}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-blue-100 break-all">{item.username}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-blue-100 break-all">{item.password}</td>
                      <td className="py-2 md:py-3 px-2 md:px-4 border-b border-blue-100 text-center">
                        <div className="flex items-center justify-center gap-4">
                          <button
                            onClick={() => editPassword(item._id)}
                            className="text-blue-600 hover:text-blue-800 text-xl"
                            title="Edit"
                          >
                            <MdEdit />
                          </button>
                          <button
                            onClick={() => deletePassword(item._id)}
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
