// pages/ProfilePage.js

import Profile from './components/profile';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const auth = localStorage.getItem('auth');

  useEffect(() => {
    if (!auth) {
      return navigate('/login');
    }
  });

  return (
    <div>
      <h2>User Profile</h2>
      <Profile />
    </div>
  );
};

export default ProfilePage;
