import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function StoreOwnerDashboard() {
  const [data, setData] = useState(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hdr = { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } };
  const nav = useNavigate();

  useEffect(() => {
    if (user.id)
      axios
        .get(`http://localhost:5000/api/stores/owner/${user.id}`, hdr)
        .then((r) => setData(r.data))
        .catch(() => setData({ store: null, users: [] }));
  }, [user.id]);

  const validatePassword = (pwd) => {
    const regex = /^(?=.*[A-Z])(?=.*[!@#$%^&*]).{8,16}$/;
    if (!pwd || !regex.test(pwd)) {
      return "Password must be 8–16 characters, include at least 1 uppercase and 1 special character.";
    }
    return null;
  };

  const updatePassword = () => {
    const validationMsg = validatePassword(password);
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    axios
      .put('http://localhost:5000/api/auth/update-password', { userId: user.id, password }, hdr)
      .then(() => {
        alert('Password updated successfully!');
        setPassword('');
        setError('');
      })
      .catch(() => setError('Failed to update password'));
  };

  const logout = () => {
    localStorage.clear();
    nav('/login');
  };

  if (!data) return <p>Loading…</p>;
  if (!data.store) return <p>No store assigned</p>;

  return (
    <div className="container">
      <h2>Store Owner Dashboard</h2>
      <button onClick={logout} style={{ float: 'right', backgroundColor: '#e74c3c' }}>
        Logout
      </button>

      <h3>Your Store</h3>
      <p><strong>Name:</strong> {data.store.name}</p>
      <p><strong>Address:</strong> {data.store.address}</p>
      <p><strong>Average Rating:</strong> {data.store.avg_rating || 'N/A'}</p>

      <hr />
      <h3>Ratings Received</h3>
      {data.users.length === 0 ? (
        <p>No ratings yet</p>
      ) : (
        <table border="1" cellPadding="6">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.users.map((u, i) => (
              <tr key={i}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <hr />
      <h3>Update Password</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={updatePassword}>Update Password</button>
    </div>
  );
}
