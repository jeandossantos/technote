import { Route, Routes } from 'react-router-dom';

import Layout from './components/Layout.jsx';
import Public from './components/Public.jsx';
import Login from './features/auth/Login.jsx';
import DashLayout from './components/DashLayout.jsx';
import Welcome from './features/auth/Welcome.jsx';
import UsersList from './features/users/UsersList.jsx';
import NotesList from './features/notes/NotesList.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route path="dash" element={<DashLayout />}>
          <Route index element={<Welcome />} />

          <Route path="notes">
            <Route index element={<NotesList />} />
          </Route>

          <Route path="users">
            <Route index element={<UsersList />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}
