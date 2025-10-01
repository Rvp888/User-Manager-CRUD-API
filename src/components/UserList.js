import UserItem from "./UserItem";

function UserList({ users, setEditingUser, deleteUser }) {
  return (
    <ul>
      {users.map((user) => (
        <UserItem
          user={user}
          setEditingUser={setEditingUser}
          deleteUser={deleteUser}
        />
      ))}
    </ul>
  );
}

export default UserList;
