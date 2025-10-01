import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

const API_URL = "https://jsonplaceholder.typicode.com/users";

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false); // 🔎 search term
  const [error, setError] = useState(null); // ⏳ loading state
  const [search, setSearch] = useState(""); // ❌ error state

  // Fetch users on load
  // ✅ Method 1: Using Axios with .then()
  // Axios automatically parses JSON → use res.data directly
  useEffect(() => {
    setLoading(true);
    setError(null);

    axios
      .get(API_URL)
      .then((res) => {
        console.log(res);
        setUsers(res.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to get users!");
      })
      .finally(() => setLoading(false));
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

  // useEffect(() => {
  //   setUsers(
  //     users.filter(
  //       (user) =>
  //         user.name.toLowerCase().includes(search.toLowerCase()) ||
  //         user.email.toLowerCase().includes(search.toLowerCase())
  //     )
  //   );
  // }, [search, users]);

  // 🔎 Filter users by search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  // Add new user
  async function addUser(user) {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(API_URL, user);
      const newId = users.length ? Math.max(...users.map((u) => u.id)) + 1 : 1;
      const newUser = { ...res.data, id: newId };
      console.log(newUser);
      setUsers([...users, newUser]);
    } catch (err) {
      console.error(err);
      setError("Failed to add user!");
    } finally {
      setLoading(false);
    }
  }

  // Update user
  async function updateUser(id, updatedUser) {
    try {
      setLoading(true);
      setError(null);
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
      setError("Failed to update user!");
    } finally {
      setLoading(false);
    }
  }

  // Delete user
  async function deleteUser(id) {
    try {
      setLoading(true);
      setError(null);
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
    } catch (err) {
      console.error(err);
      setError("Failed to delete user!");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>User Manager</h1>

      {/* Search box */}
      <input
        type="text"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ marginBottom: "20px", padding: "5px" }}
      />

      {/* User form */}
      <UserForm
        editingUser={editingUser}
        addUser={addUser}
        updateUser={updateUser}
      />

      {/* Loading/Error Messages */}
      {loading && <p>⏳ Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* User list */}
      {!loading && !error && (
        <UserList
          users={filteredUsers}
          setEditingUser={setEditingUser}
          deleteUser={deleteUser}
        />
      )}
    </div>
  );
}

export default App;
