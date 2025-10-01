import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "" });

  // Fetch users on load
  // ✅ Method 1: Using Axios with .then()
  // Axios automatically parses JSON → use res.data directly
  useEffect(() => {
    axios
      .get(API_URL)
      .then((res) => {
        console.log(res);
        setUsers(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  // ✅ Method 2: Using Fetch with .then()
  // Fetch needs manual JSON parsing with res.json()
  // useEffect(() => {
  //   fetch(API_URL)
  //     .then((res) => {
  //       console.log("res", res);
  //       return res.json(); // returns a Promise → must be awaited/then'd
  //     })
  //     .then((data) => {
  //       console.log("data", data);
  //       setUsers(data);
  //     })
  //     .catch((err) => console.error(err));
  // }, []);

  // ✅ Method 3: Using Fetch with async/await
  // Cleaner async syntax but still requires manual res.json()
  // useEffect(() => {
  //   async function getUsers() {
  //     const res = await fetch(API_URL);
  //     console.log("res", res);
  //     const data = await res.json(); // must await here
  //     console.log("data", data);
  //     setUsers(data);
  //   }
  //   getUsers();
  // }, []);

  // ✅ Method 4: Using Axios with async/await
  // Axios auto-parses JSON → access res.data directly (no res.json needed)
  // useEffect(() => {
  //   async function getUsers() {
  //     const res = await axios.get(API_URL);
  //     console.log("res", res);
  //     const data = await res.data;  // no need for await/res.json()
  //     console.log("data", data);
  //     setUsers(data);
  //   }
  //   getUsers();
  // }, []);

  // Add new user
  async function addUser(user) {
    try {
      const res = await axios.post(API_URL, user);
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser = { ...res.data, id: newId };
      console.log(newUser);
      setUsers([...users, newUser]);
    } catch (err) {
      console.error(err);
    }
  }

  // Update user
  async function updateUser(id, updatedUser) {
    try {
      if (id <= 10) {
        const res = await axios.put(`${API_URL}/${id}`, updatedUser);
        console.log("updatedUser", res.data);
        setUsers(
          users.map((user) => {
            if (user.id === id) {
              return res.data;
            }
            return user;
          })
        );
      } else {
        setUsers(
          users.map((user) => {
            if (user.id === id) {
              return { ...user, ...updatedUser };
            }
            return user;
          })
        );
      }

      setEditingUser(null);
    } catch (err) {
      console.error(err);
    }
  }

  // Delete user
  async function deleteUser(id) {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
    }
  }

  useEffect(() => {
    if (editingUser) {
      setFormData({ name: editingUser.name, email: editingUser.email });
    }
  }, [editingUser]);

  function handleChange(e) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!formData.name || !formData.email) return;

    if (editingUser) {
      updateUser(editingUser.id, formData);
    } else {
      addUser(formData);
    }

    setFormData({ name: "", email: "" });
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Manager</h1>

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={formData.name}
          onChange={handleChange}
          style={{ marginLeft: "10px" }}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          style={{ marginLeft: "5px" }}
        />
        <button type="submit" style={{ marginLeft: "10px" }}>
          {editingUser ? "Update" : "Add"} User
        </button>
      </form>

      <ul>
        {users.map((user) => (
          <li key={user.id} style={{ marginBottom: "10px" }}>
            {user.name} - {user.email}
            <button
              onClick={() => setEditingUser(user)}
              style={{ marginLeft: "10px" }}
            >
              Edit
            </button>
            <button
              onClick={() => deleteUser(user.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
