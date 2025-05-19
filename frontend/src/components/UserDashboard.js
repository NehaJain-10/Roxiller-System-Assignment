import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [userRatings, setUserRatings] = useState({});
  const [search, setSearch] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const nav = useNavigate();

  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const hdr = { headers: { Authorization: `Bearer ${token}` } };

  useEffect(() => {
    axios.get('http://localhost:5000/api/stores', hdr).then((res) => setStores(res.data));

    axios.get(`http://localhost:5000/api/stores/ratings/user/${user.id}`, hdr).then((res) => {
      const ratingsMap = {};
      res.data.forEach((r) => {
        ratingsMap[r.store_id] = r.rating;
      });
      setUserRatings(ratingsMap);
    });
  }, []);

  const handleRate = (storeId, rating) => {
    axios
      .post('http://localhost:5000/api/stores/rate', {
        userId: user.id,
        storeId,
        rating,
      }, hdr)
      .then(() => {
        alert('Rating submitted!');
        setUserRatings({ ...userRatings, [storeId]: parseInt(rating) });
      })
      .catch((err) => {
        console.error(err);
        alert('Error submitting rating');
      });
  };

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
      .put('http://localhost:5000/api/auth/update-password', {
        userId: user.id,
        password,
      }, hdr)
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

  const filteredStores = stores.filter(
    (store) =>
      store.name.toLowerCase().includes(search.toLowerCase()) ||
      store.address.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container">
      <h2>User Dashboard</h2>
      <button onClick={logout} style={{ float: 'right', backgroundColor: '#e74c3c' }}>
        Logout
      </button>

      <h3>Update Password</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={updatePassword}>Update Password</button>

      <hr />
      <h3>Search Stores</h3>
      <input
        type="text"
        placeholder="Search by store name or address"
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '300px', marginBottom: '10px' }}
      />

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Store Name</th>
            <th>Address</th>
            <th>Avg Rating</th>
            <th>Your Rating</th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
              <td>{s.address}</td>
              <td>{s.avg_rating || 'N/A'}</td>
              <td>
                <select
                  value={userRatings[s.id] || ''}
                  onChange={(e) => handleRate(s.id, e.target.value)}
                >
                  <option value="">Rate</option>
                  {[1, 2, 3, 4, 5].map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
