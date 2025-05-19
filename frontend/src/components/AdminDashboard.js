import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [uForm, setU] = useState({ name: '', email: '', password: '', address: '', role: 'user' });
  const [sForm, setS] = useState({ name: '', email: '', address: '', owner_id: '' });
  const [filter, setFilter] = useState('');
  const nav = useNavigate();

  const token = localStorage.getItem('token');
  const hdr = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get('http://localhost:5000/api/admin/dashboard', hdr).then((res) => setStats(res.data));
    axios.get('http://localhost:5000/api/admin/users', hdr).then((res) => setUsers(res.data));
    axios.get('http://localhost:5000/api/admin/stores', hdr).then((res) => setStores(res.data));
  }, []);

  const logout = () => {
    localStorage.clear();
    nav('/login');
  };


  const storeOwnerRatings = {};
  stores.forEach((store) => {
    if (store.owner_id) {
      storeOwnerRatings[store.owner_id] = store.avg_rating;
    }
  });

  const validateForm = ({ name, email, password, address }) => {
    const errors = [];

    if (!name || name.length < 20 || name.length > 60) {
      errors.push("Name must be between 20 and 60 characters.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("Please enter a valid email address.");
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!password || !passwordRegex.test(password)) {
      errors.push("Password must be 8–16 characters, and include at least 1 uppercase and 1 special character.");
    }

    if (!address || address.length > 400) {
      errors.push("Address must be 400 characters or less.");
    }

    return errors;
  };

  const addUser = () => {
    const errors = validateForm(uForm);
    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    axios.post('http://localhost:5000/api/admin/users', uForm, hdr)
      .then(() => {
        alert('User added successfully');
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to add user');
      });
  };

  const addStore = () => {
    const { name, email, address, owner_id } = sForm;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const errors = [];
    if (!name || name.length < 20 || name.length > 60) errors.push('Store name must be 20–60 characters.');
    if (!email || !emailRegex.test(email)) errors.push('Invalid store email.');
    if (!address || address.length > 400) errors.push('Address must be 400 characters or less.');
    if (!owner_id || isNaN(owner_id)) errors.push('Owner ID must be a valid number.');

    if (errors.length) {
      alert(errors.join('\n'));
      return;
    }

    axios.post('http://localhost:5000/api/admin/stores', sForm, hdr)
      .then(() => {
        alert('Store added successfully');
        window.location.reload();
      })
      .catch((err) => {
        console.error(err);
        alert('Failed to add store');
      });
  };

  const filteredUsers = users.filter((u) =>
    u.name.toLowerCase().includes(filter.toLowerCase()) ||
    u.email.toLowerCase().includes(filter.toLowerCase()) ||
    u.address.toLowerCase().includes(filter.toLowerCase()) ||
    u.role.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
      <button onClick={logout} style={{ float: 'right', backgroundColor: '#e74c3c' }}>Logout</button>

      <p><strong>Users:</strong> {stats.totalUsers}</p>
      <p><strong>Stores:</strong> {stats.totalStores}</p>
      <p><strong>Ratings:</strong> {stats.totalRatings}</p>

      <hr />
      <h3>Add User</h3>
      <input placeholder="Name" onChange={(e) => setU({ ...uForm, name: e.target.value })} /><br />
      <input placeholder="Email" onChange={(e) => setU({ ...uForm, email: e.target.value })} /><br />
      <input type="password" placeholder="Password" onChange={(e) => setU({ ...uForm, password: e.target.value })} /><br />
      <input placeholder="Address" onChange={(e) => setU({ ...uForm, address: e.target.value })} /><br />
      <select onChange={(e) => setU({ ...uForm, role: e.target.value })}>
        <option value="user">User</option>
        <option value="store_owner">Store Owner</option>
        <option value="admin">Admin</option>
      </select><br />
      <button onClick={addUser}>Add User</button>

      <hr />
      <h3>All Users</h3>
      <input
        placeholder="Search by name, email, address or role"
        onChange={(e) => setFilter(e.target.value)}
        style={{ width: '300px', marginBottom: '10px' }}
      /><br />
      <table border="1" cellPadding="6">
        <thead>
            <tr>
               <th>ID</th>
               <th>Name</th>
               <th>Email</th>
               <th>Role</th>
               <th>Address</th>
               <th>Rating (if Owner)</th>
            </tr>
        </thead>
        <tbody>
           {filteredUsers.map((u) => (
            <tr key={u.id}>
             <td>{u.id}</td>
             <td>{u.name}</td>
             <td>{u.email}</td>
             <td>{u.role}</td>
             <td>{u.address}</td>
             <td>{u.role === 'store_owner' ? (storeOwnerRatings[u.id] || 'N/A') : '-'}</td>
            </tr>
          ))}
        </tbody>

      </table>

      <hr />
      <h3>Add Store</h3>
      <input placeholder="Store Name" onChange={(e) => setS({ ...sForm, name: e.target.value })} /><br />
      <input placeholder="Store Email" onChange={(e) => setS({ ...sForm, email: e.target.value })} /><br />
      <input placeholder="Store Address" onChange={(e) => setS({ ...sForm, address: e.target.value })} /><br />
      <input type="number" placeholder="Owner ID" onChange={(e) => setS({ ...sForm, owner_id: parseInt(e.target.value) })} /><br />
      <button onClick={addStore}>Add Store</button>

      <hr />
      <h3>All Stores</h3>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Address</th>
            <th>Avg Rating</th>
          </tr>
        </thead>
        <tbody>
          {stores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.avg_rating || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
