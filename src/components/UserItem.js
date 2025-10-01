function UserItem({ user, setEditingUser, deleteUser }) {
  return (
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
  );
}

export default UserItem;
