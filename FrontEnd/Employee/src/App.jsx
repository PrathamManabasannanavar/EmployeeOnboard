import {BrowserRouter as Router, Route, Routes, Link} from "react-router-dom"
import LoginPage from "./Components/LoginPage"
import NavBar from "./Components/NavBar"
import SpaceBox from "./Components/SpaceBox"
import Signup from "./Components/register"
import DashBoard from "./Components/dashboard"
import AdminPanel from "./Components/AdminPanel"
import AssignProjects from "./Components/AssignProjects"


function App() {
  
  return (
    <Router>
      <NavBar/>
      <SpaceBox/>

      <Routes>
        <Route path="/" element={<LoginPage/>}/>
        <Route path="/signup" element={<Signup/>}/>
        <Route path="/dashboard" element={<DashBoard/>}/>
        <Route path="/admin" element={<AdminPanel/>}/>
        <Route path="/assignprojects" element={<AssignProjects/>}/>
      </Routes>
    </Router>
  )
}

export default App
