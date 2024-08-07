import { Button, EditableText, InputGroup, Toaster } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";
import "./App.css";

const AppToaster = Toaster.create({
  position: "top",
});

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/users")
      .then((response) => response.json())
      .then((json) => setUsers(json));
  }, []);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newWebsite, setNewWebsite] = useState("");

  function addUser() {
    const name = newName.trim();
    const email = newEmail.trim();
    const website = newWebsite.trim();

    if (name && email && website) {
      fetch("https://jsonplaceholder.typicode.com/users", {
        method: "POST",
        body: JSON.stringify({
          name,
          email,
          website,
        }),
        headers: {
          "content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setUsers([...users, data]);
          AppToaster.show({
            message: "User registration successful",
            timeout: 3000,
            intent: "success",
          });

          setNewName("");
          setNewEmail("");
          setNewWebsite("");
        });
    }
  }

  function onChangeHandler(id, key, value) {
    setUsers((users) => {
      return users.map((user) => {
        return user.id === id ? { ...user, [key]: value } : user;
      });
    });
  }

  function updateUser(id) {
    const user = users.find((user) => user.id === id);
    fetch(`https://jsonplaceholder.typicode.com/users/10`, {
      method: "PUT",
      body: JSON.stringify(user),
      headers: {
        "content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        AppToaster.show({
          message: "User update successful",
          timeout: 3000,
          intent: "success",
        });
      });
  }

  function deleteUser(id) {
    fetch(`https://jsonplaceholder.typicode.com/users/10`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        setUsers((users) => {
          return users.filter((user) => user.id !== id);
        });

        AppToaster.show({
          message: "User deletion successful",
          timeout: 3000,
          intent: "success",
        });
      });
  }

  return (
    <div className="App">
      <table className="bp4-html-table modifier">
        <thead>
          <th>Id</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Action</th>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>
                <EditableText
                  value={user.email}
                  onChange={(value) => onChangeHandler(user.id, "email", value)}
                />
              </td>
              <td>
                <EditableText
                  value={user.website}
                  onChange={(value) =>
                    onChangeHandler(user.id, "website", value)
                  }
                />
              </td>
              <td>
                <Button intent="primary" onClick={() => updateUser(user.id)}>
                  Update
                </Button> &nbsp;
                <Button intent="danger" onClick={() => deleteUser(user.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <td></td>
          <td>
            <InputGroup
              value={newName}
              placeholder="Enter name!"
              onChange={(e) => {
                setNewName(e.target.value);
              }}
            />
          </td>
          <td>
            <InputGroup
              value={newEmail}
              placeholder="Enter email!"
              onChange={(e) => {
                setNewEmail(e.target.value);
              }}
            />
          </td>
          <td>
            <InputGroup
              value={newWebsite}
              placeholder="Enter website!"
              onChange={(e) => {
                setNewWebsite(e.target.value);
              }}
            />
          </td>
          <td>
            <Button intent="success" onClick={addUser}>
              Add User
            </Button>
          </td>
        </tfoot>
      </table>
    </div>
  );
}

export default App;
