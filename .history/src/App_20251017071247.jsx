import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home.jsx'
// import Register from './pages/Register.jsx'
// import Login from './pages/Login.jsx'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  )
}

export default App