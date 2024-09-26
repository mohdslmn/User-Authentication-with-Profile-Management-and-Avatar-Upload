import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Signup from './components/Signup';
import Login from './components/Login';
import Profile from './components/Profile';

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('userId') !== null;
  };

  return (
  
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/profile" element={isAuthenticated() ? <Profile /> : <Navigate to="/profile" />} />
        </Routes>
      </div>
    </Router>

  );
}

export default App;