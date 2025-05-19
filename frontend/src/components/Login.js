import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [f, setF] = useState({ email: '', password: '' });
  const [err, setErr] = useState('');
  const nav = useNavigate();

  const sub = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', f);
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.user.role === 'admin') nav('/admin');
      if (data.user.role === 'user') nav('/user');
      if (data.user.role === 'store_owner') nav('/owner');
    } catch (e) {
      setErr(e.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="container">
      <h2>Login</h2>
      <form onSubmit={sub}>
        {err && <p style={{ color: 'red' }}>{err}</p>}
        <input
          type="email"
          placeholder="Email"
          onChange={(e) => setF({ ...f, email: e.target.value })}
        /><br />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setF({ ...f, password: e.target.value })}
        /><br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}
