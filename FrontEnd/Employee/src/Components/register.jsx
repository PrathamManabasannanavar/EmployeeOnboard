// import { useState } from "react"
import styles from "../styles/register.module.css"
import PropTypes from "prop-types"
import { Link } from 'react-router-dom'

function Signup() {
    // const [username, setUsername] = useState("")
    // const [password, setPassword] = useState("")

    const wrongPassword = ()=>{
        alert('Password doesn\'t match\nRe-enter the password')
        return
    }

    const submitUserDetails = async (event) => {
        event.preventDefault()
        if(document.getElementById('password').value != document.getElementById('repassword').value){
            wrongPassword()
            return;
        }
            

        try{
            console.log("In try inregister");
            const response = await fetch('http://localhost:10000/user/register', {
                method: 'POST',  // Specify that this is a POST request
                headers: {
                    'Content-Type': 'application/json',  // The body will contain JSON data
                },
                body: JSON.stringify({
                    username: document.getElementById('username').value,
                    password: document.getElementById('password').value,
                    name: document.getElementById('name').value,
                }),
            })

            const data = await response.json()
            console.log(data);
            if(data.success == false){
                alert('Username already\nplease try different User name')
            }else{
                alert('Employee registered')
            }
        }catch(e){
            console.log(e);
        }
    }

    return (
        <div className={styles.parent}>
            <div>
                <form className={styles.formBox}>
                    <div>
                        <label htmlFor="">Enter the Username</label>
                        <input type="text" className={styles.inputText} id="username"/>
                    </div>

                    <div>
                        <label htmlFor="">Enter your name</label>
                        <input type="text" className={styles.inputText} id="name"/>
                    </div>

                    <div>
                        <label htmlFor="">Enter the Password</label>
                        <input type="password" className={styles.inputText} id="password" />
                    </div>

                    <div>
                        <label htmlFor="">Re-enter the Password</label>
                        <input type="password" className={styles.inputText} id="repassword" />
                    </div>

                    <div>
                        <button onClick={()=>submitUserDetails(event)} id={styles.button}>
                            Submit
                        </button>
                    </div>
                    <div>
                        <Link to="/" id={styles.loginText}>Login</Link>
                    </div>
                </form>
            </div>
        </div>
    )
}

// function InputBox({label, inputType, cname}){
//     return(
// <div>
//     <label htmlFor="">{label}</label>
//     <input type={inputType} className="inputBox" onClick={cname}/>
// </div>
//     )
// }

// InputBox.propTypes = {
//     label: PropTypes.string.isRequired,
//     inputType: PropTypes.string.isRequired,
//     cname: PropTypes.string
// } 


export default Signup