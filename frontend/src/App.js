
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './styles.css';
import Welcome from './components/Welcome';
import Navbar from './components/Navbar';
import Signup from './components/Signup';
import Login from './components/Login';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashboard';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';

export default function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/owner" element={<StoreOwnerDashboard />} />
      </Routes>
    </Router>
  );
}

