import { useState } from "react";
import logincss from "../styles/LoginPage.module.css"
import {Link, useNavigate} from "react-router-dom"
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

function LoginPage(){
    const navigate = useNavigate()
    const [user, setUser] = useState("user");

    async function submitUserDetails(){
        const username = document.getElementById('username').value
        const password = document.getElementById('password').value

        // console.log(username);
        // console.log(password);
        try{
            const response = await fetch(`http://localhost:10000/${user}/login`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json'
                },
                credentials: 'include', // <-- Required to send session cookie
                body: JSON.stringify({ username: username, password: password })
            });
    
            const data = await response.json();
            // const data = response
            console.log(data);

            if(data.success == true){
                alert('Logged In')

                if(user == "admin"){
                    navigate('/admin')
                    window.location.reload()
                    return
                }
                console.log(data);
                navigate('/dashboard')
            }else{
                alert("Auth failure")
            }
            
            window.location.reload()
        }
        catch(e){
            console.log(e);
        }
    }

    return(
        <div className={logincss.parent}>
            <div className={logincss.account}>
                <div>
                    <label htmlFor="user">User</label>
                    <input type="radio" name="account" id="user" value="user" defaultChecked onClick={()=>setUser("user")}/>
                </div>

                <div>
                    <label htmlFor="admin">Admin</label>
                    <input type="radio" name="account" id="admin" value="admin" onClick={()=>setUser("admin")}/>
                </div>
            </div>
            <div className={logincss.main}>
                <div>
                    <label htmlFor="">Username</label>
                    <input type="text" placeholder="Username" id="username"/>
                </div>
                <div>
                    <label htmlFor="">Password</label>
                    <input type="password" placeholder="password" id="password"/>
                </div>
                <div>
                    <input type="submit" placeholder="password" onClick={submitUserDetails} className={logincss.submitBtn}/>
                </div>
                {(user == "user") ? (
                    <span className={logincss.register}>
                        <Link to="/signup">Register</Link>
                    </span>
                ) : ""
                }
            </div>
        </div>
    )
}

export default LoginPage