import {HashRouter as Router, Navigate, Route, Routes} from "react-router-dom"
import { AuthProvider } from "./auth"
import { useAuth } from "./useAuth"
import LoginPage from "./Components/LoginPage"
import NavBar from "./Components/NavBar"
import Signup from "./Components/register"
import DashBoard from "./Components/Dashboard"
import AdminPanel from "./Components/AdminPanel"
import AssignProjects from "./Components/AssignProjects"

function ProtectedRoute({ children, adminOnly = false }) {
  const { loading, loggedIn, user } = useAuth()

  if (loading) return <div className="route-status">Checking your session...</div>
  if (!loggedIn) return <Navigate to="/" replace />
  if (adminOnly && user !== "admin") return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  
  return (
    <Router>
      <AuthProvider>
        <NavBar/>
        <main className="app-main">
          <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/signup" element={<Signup/>}/>
            <Route path="/dashboard" element={<ProtectedRoute><DashBoard/></ProtectedRoute>}/>
            <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel/></ProtectedRoute>}/>
            <Route path="/assignprojects" element={<ProtectedRoute adminOnly><AssignProjects/></ProtectedRoute>}/>
            <Route path="*" element={<Navigate to="/" replace />}/>
          </Routes>
        </main>
      </AuthProvider>
    </Router>
  )
}

export default App
