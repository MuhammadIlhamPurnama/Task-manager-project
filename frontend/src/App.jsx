import { BrowserRouter, Routes, Route } from 'react-router';
import LoginPages from './pages/LoginPages';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<h1>Home</h1>} />
        <Route path="/login" element={<LoginPages></LoginPages>} />
      </Routes>
    </BrowserRouter>
  );
}