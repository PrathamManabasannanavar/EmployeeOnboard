import navstyle from "../styles/NavBar.module.css"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../useAuth"
// import devImg from "../assets/developer_4661320.png"

function NavBar(){
    const { loggedIn, user, refreshSession } = useAuth()
    const navigate = useNavigate()

    const logoutUser = async ()=>{
        try{
            const response = await fetch('https://employeeonboard.onrender.com/user/logout', {
                method: 'GET',
                credentials: 'include',  // Important! This sends the cookies along with the request
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const {success} = await response.json()

            if(success === true){
                await refreshSession()
                navigate('/')
            }
        }
        catch(err){
            console.error(err)
        }
    }

    // const logoutBox = (
    //     <Link to="logout" onClick={logoutUser}>
    //         Logout
    //     </Link>
    // )

    return(
        <div className={navstyle.parent}>
            <div className={navstyle.title}>
                <h4>
                    Employee Onboard
                </h4>
            </div>
            <div className={navstyle.componentBox}>
                {!loggedIn ? <Link to="/" className={navstyle.items}>Login</Link> : null}
                { loggedIn && user !== "admin" ? (
                    <Link to="/dashboard" className={navstyle.items}>Home</Link>
                ) : loggedIn ? (
                    <>
                    <Link to="/admin" className={navstyle.items}>Home</Link>
                    <Link to="/assignprojects" className={navstyle.items}>Update</Link>
                    </>
                ) : null}
                {loggedIn ? <button type="button" onClick={logoutUser} className={navstyle.items}>Logout</button> : null}
            </div>
        </div>
    )
}

export default NavBar;