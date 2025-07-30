import {useEffect, useState} from "react";
import navstyle from "../styles/NavBar.module.css"
import {Link, useNavigate} from "react-router-dom"
// import devImg from "../assets/developer_4661320.png"

function NavBar(){
    const [login, setLogin] = useState(false)
    const [user, setUser] = useState("")
    const navigate = useNavigate()

    const connectBackend = async ()=>{
        try{
            const response = await fetch('https://employeeonboard.onrender.com/user/session', {
                method: 'GET',
                credentials: 'include',  // Important! This sends the cookies along with the request
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const {loggedIn, msg, user} = await response.json()
            
            console.log(loggedIn);
            console.log(msg);
            console.log(user);
            setUser(user)
            setLogin(loggedIn)
        }catch(e){
            console.log(e);
        }
        
    }
    
    useEffect(()=>{
        connectBackend()
        console.log("Connect Backend");
    }, [])



    const logoutUser = async ()=>{
        try{
            const response = await fetch('https://employeeonboard.onrender.com/user/logout', {
                method: 'GET',
                credentials: 'include',  // Important! This sends the cookies along with the request
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            const {success, msg} = await response.json()
            console.log(msg);

            if(success == true){
                alert("logged out")
                setLogin(false)
                navigate('/')
            }
            else{
                alert("logout Unsuccessful")
            }
        }
        catch(err){
            console.log(err);
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
                {
                    (!login) ? (
                        <Link to="/" className={navstyle.items}>Login</Link>
                    ) : ""

                }
                { (user != "admin") ? (
                    <Link to="/dashboard" className={navstyle.items}>Home</Link>
                ) : (
                    <>
                    <Link to="/admin" className={navstyle.items}>Home</Link>
                    <Link to="/assignProjects" className={navstyle.items}>update</Link>
                    </>
                )}
                {/* <Link to="/support" className={navstyle.items}>Support</Link> */}
                {/* {(login == true) ? logoutBox : (<div></div>)} */}
                {(login) ? (
                    <div onClick={logoutUser} className={navstyle.items}>Logout</div>
                ): (null)
                }
            </div>
        </div>
    )
}

export default NavBar;