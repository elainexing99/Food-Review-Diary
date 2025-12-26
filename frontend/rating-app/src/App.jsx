
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Camera from './pages/Camera.jsx';

import './App.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="new-entry" element={<Camera />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}


