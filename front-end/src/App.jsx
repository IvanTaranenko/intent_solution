import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import RequestIndex from './pages/Requests/Index.jsx';

function App() {
  return (
    <>
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/list-of-requests" element={<RequestIndex />} />
            </Routes>
        </Router>
    </>
  )
}

export default App
