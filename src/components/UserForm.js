import { useEffect, useState } from "react";

function UserForm({ editingUser, addUser, updateUser }) {
  const [formData, setFormData] = useState({ name: "", email: "" });

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
  );
}

export default UserForm;
