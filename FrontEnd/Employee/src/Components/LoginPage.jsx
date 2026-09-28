import { useState } from "react";
import logincss from "../styles/LoginPage.module.css"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../useAuth"

function LoginPage(){
    const navigate = useNavigate()
    const { refreshSession } = useAuth()
    const [user, setUser] = useState("user");
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    async function submitUserDetails(event){
        event.preventDefault()
        setError("")
        setIsSubmitting(true)
        try{
            const response = await fetch(`https://employeeonboard.onrender.com/${user}/login`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                credentials: 'include', // <-- Required to send session cookie
                body: JSON.stringify({ username: username, password: password })
            });
    
            const data = await response.json()
            if(data.success !== true){
                setError(data.msg || "Those credentials could not be verified.")
                return
            }
            const session = await refreshSession()
            if (session.loggedIn !== true) {
                setError("Login succeeded, but the session cookie was not saved. Check the backend CORS and cookie settings.")
                return
            }
            navigate(user === "admin" ? "/admin" : "/dashboard")
        }
        catch(e){
            setError("Unable to connect right now. Please try again.")
            console.error(e)
        }
        finally { setIsSubmitting(false) }
    }

    return(
        <div className={logincss.parent}>
            <div className={logincss.main}>
                <div className={logincss.account} role="group" aria-label="Account type">
                    <label className={user === "user" ? logincss.selectedAccount : ""} htmlFor="user">
                        <input type="radio" name="account" id="user" value="user" checked={user === "user"} onChange={()=>setUser("user")}/>
                        Employee
                    </label>
                    <label className={user === "admin" ? logincss.selectedAccount : ""} htmlFor="admin">
                        <input type="radio" name="account" id="admin" value="admin" checked={user === "admin"} onChange={()=>setUser("admin")}/>
                        Admin
                    </label>
                </div>
                <form onSubmit={submitUserDetails}>
                    <label htmlFor="username">Username</label>
                    <input type="text" placeholder="Enter your username" id="username" value={username} onChange={(event)=>setUsername(event.target.value)} autoComplete="username" required />
                    <label htmlFor="password">Password</label>
                    <input type="password" placeholder="Enter your password" id="password" value={password} onChange={(event)=>setPassword(event.target.value)} autoComplete="current-password" required />
                    {error ? <p className={logincss.error} role="alert">{error}</p> : null}
                    <button type="submit" disabled={isSubmitting} className={logincss.submitBtn}>
                        {isSubmitting ? "Signing in..." : "Sign in"}
                    </button>
                </form>
                {user === "user" ? (
                    <span className={logincss.register}>
                        New here? <Link to="/signup">Create an account</Link>
                    </span>
                ) : null}
            </div>
        </div>
    )
}

export default LoginPage