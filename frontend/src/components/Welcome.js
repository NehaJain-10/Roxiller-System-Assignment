

import { useNavigate } from 'react-router-dom';

export default function Welcome() {
  const nav = useNavigate();
  return (
    <div className="container">
      <h1>Welcome to Task of Roxiller System</h1>
      <button onClick={() => nav('/signup')}>Sign Up</button>{' '}
      <button onClick={() => nav('/login')}>Log In</button>
    </div>
  );
}
