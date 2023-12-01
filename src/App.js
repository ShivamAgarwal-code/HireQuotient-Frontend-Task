// Import necessary libraries and components
import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, FormControl,Pagination } from 'react-bootstrap';

const App = () => {
  const [users, setUsers] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedName, setEditedName] = useState('');
  const [editedEmail, setEditedEmail] = useState('');
  const [editedRole, setEditedRole] = useState('');

  const pageSize = 10;

  useEffect(() => {
    // Fetch data from the API
    const fetchData = async () => {
      try {
        const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleEdit = (id, name, email, role) => {
    setEditingUserId(id);
    setEditedName(name);
    setEditedEmail(email);
    setEditedRole(role);
  };

  const handleSave = (id) => {
    // Find the user in the array and update the data
    const updatedUsers = users.map((user) =>
      user.id === id
        ? { ...user, name: editedName, email: editedEmail, role: editedRole }
        : user
    );
    setUsers(updatedUsers);

    // Reset the editing state
    setEditingUserId(null);
    setEditedName('');
    setEditedEmail('');
    setEditedRole('');
  };

  const filteredUsers = users.filter((user) =>
    Object.values(user).some((value) =>
      value.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const totalPages = Math.ceil(filteredUsers.length / pageSize);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleSelectAll = () => {
    setSelectedRows(selectedRows.length === pageSize ? [] : [...paginatedUsers]);
  };

  const handleDelete = (id) => {
    setUsers(users.filter((user) => user.id !== id));
  };

  const handleDeleteSelected = () => {
    setUsers(users.filter((user) => !selectedRows.includes(user)));
    setSelectedRows([]);
  };

  return (
    <div className="container mt-4">
      <InputGroup className="mb-3">
        <FormControl
          placeholder="Search..."
          aria-label="Search"
          aria-describedby="basic-addon2"
          value={searchTerm}
          onChange={handleSearch}
        />
      </InputGroup>

      <Table bordered hover responsive>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selectedRows.length === pageSize}
                onChange={handleSelectAll}
              />
            </th>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user.id}>
              <td>
                <input
                  type="checkbox"
                  checked={selectedRows.includes(user)}
                  onChange={() => {
                    const newSelectedRows = selectedRows.includes(user)
                      ? selectedRows.filter((selectedUser) => selectedUser !== user)
                      : [...selectedRows, user];
                    setSelectedRows(newSelectedRows);
                  }}
                />
              </td>
              <td>{user.id}</td>
              <td>
                {editingUserId === user.id ? (
                  <FormControl
                    type="text"
                    value={editedName}
                    onChange={(e) => setEditedName(e.target.value)}
                  />
                ) : (
                  user.name
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <FormControl
                    type="text"
                    value={editedEmail}
                    onChange={(e) => setEditedEmail(e.target.value)}
                  />
                ) : (
                  user.email
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <FormControl
                    type="text"
                    value={editedRole}
                    onChange={(e) => setEditedRole(e.target.value)}
                  />
                ) : (
                  user.role
                )}
              </td>
              <td>
                {editingUserId === user.id ? (
                  <Button variant="success" size="sm" onClick={() => handleSave(user.id)}>
                    <i className="fas fa-check"></i>
                  </Button>
                ) : (
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleEdit(user.id, user.name, user.email, user.role)}
                  >
                    <i className="fas fa-edit"></i>
                  </Button>
                )}
                {' '}
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  <i className="fas fa-trash-alt"></i>
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Pagination className="mt-3">
  <Pagination.First
    disabled={currentPage === 1}
    onClick={() => handlePageChange(1)}
  />
  <Pagination.Prev
    disabled={currentPage === 1}
    onClick={() => handlePageChange(currentPage - 1)}
  />

  {[...Array(totalPages)].map((_, index) => (
    <Pagination.Item
      key={index + 1}
      active={currentPage === index + 1}
      onClick={() => handlePageChange(index + 1)}
    >
      {index + 1}
    </Pagination.Item>
  ))}

  <Pagination.Next
    disabled={currentPage === totalPages}
    onClick={() => handlePageChange(currentPage + 1)}
  />
  <Pagination.Last
    disabled={currentPage === totalPages}
    onClick={() => handlePageChange(totalPages)}
  />
</Pagination>


      <div className="text-center mt-3">
        <Button variant="danger" onClick={handleDeleteSelected}>
          Delete Selected
        </Button>
      </div>
    </div>
  );
};

export default App;

