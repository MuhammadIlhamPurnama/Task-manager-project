import { BrowserRouter, Routes, Route } from 'react-router';
import LoginPages from './pages/LoginPages';
import DashboardPage from './pages/DashboardPage';
import MainLayout from './layouts/MainLayouts';
import ProjectsPage from './pages/ProjectsPage';
import MembersPage from './pages/MembersPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPages></LoginPages>} />
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="/projects" element={<ProjectsPage />}/>
          <Route path="/members" element={<MembersPage />}/>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}