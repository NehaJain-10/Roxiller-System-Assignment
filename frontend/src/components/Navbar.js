

import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav style={{ padding: 10, background: '#f5f5f5' }}>
      <Link to="/">Home</Link> |{' '}
      <Link to="/signup">Signup</Link> |{' '}
      <Link to="/login">Login</Link> |{' '}
      <Link to="/admin">Admin</Link> |{' '}
      <Link to="/user">User</Link> |{' '}
      <Link to="/owner">Owner</Link>
    </nav>
  );
}
