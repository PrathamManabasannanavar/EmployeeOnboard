import { useState, useEffect } from "react"
import styles from "../styles/AssignProjects.module.css"
import { useNavigate } from "react-router-dom"



function AssignProjects() {
    const [operation, setOperation] = useState("add")
    const navigate = useNavigate()

    useEffect(() => {
        async function getUsername() {
            try {
                const response = await fetch('https://employeeonboard.onrender.com/user/username', {
                    method: 'GET',
                    credentials: 'include', // <- Important! This tells fetch to send cookies
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })

                const data = await response.json()
                if (!data.username) {
                    navigate('/')
                    alert('User not loggedin')
                }

            }
            catch (e) {
                console.log(e);
            }

        }

        getUsername()
    }, [])


        async function updateDetails(e) {
            e.preventDefault()
            console.log("update called");
            console.log(operation);

            if (operation == "add") {
                const response = await fetch('https://employeeonboard.onrender.com/admin/assignProject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // tells server you're sending JSON
                    },
                    body: JSON.stringify({
                        empusername: document.getElementById('empid').value,
                        projid: document.getElementById('projid').value,
                        duedate: document.getElementById('duedate').value
                    }),
                    credentials: 'include'
                })
                // .then(()=>console.log("fetched data"))
                // .catch((e)=>console.log("error in fetching data", e))
                if (response) {
                    const data = await response.json()
                    alert(data.msg)
                    console.log(data);
                }
            }
            else{
                const response = await fetch('https://employeeonboard.onrender.com/admin/removeProject', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' // tells server you're sending JSON
                    },
                    body: JSON.stringify({
                        empusername: document.getElementById('empid').value,
                        projid: document.getElementById('projid').value,
                        // duedate: document.getElementById('duedate').value
                    }), 
                    credentials: 'include'
                })
                // .then(()=>console.log("fetched data"))
                // .catch((e)=>console.log("error in fetching data", e))

                
                if (response) {
                    const data = await response.json()
                    alert(data.msg)
                    console.log(data);
                }
            }
        }


        return (
            <div className={styles.parent}>
                <div className={styles.main}>
                    <form className={styles.formTag}>
                        <div className={styles.container}>
                            <label htmlFor="empid">Enter the employee ID:</label>
                            <input type="text" name="empid" id="empid" />
                        </div>

                        <div className={styles.container}>
                            <label htmlFor="projid">Enter the Project ID:</label>
                            <input type="text" name="projid" id="projid" />
                        </div>
                        { (operation != "add") ? "" : (
                        <div className={styles.container}>
                            <label htmlFor="duedate">Enter the Due Date:</label>
                            <input type="text" name="duedate" id="duedate" />
                        </div>
                        )}

                        <div className={styles.container}>
                            <label htmlFor="">Operation: </label>
                            <select onChange={(e) => setOperation(e.target.value)}>
                                <option value="add">add</option>
                                <option value="delete">delete</option>
                            </select>
                        </div>
                        <div className={styles.container}>
                            <button className={styles.submitBtn} onClick={updateDetails}>
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    }

export default AssignProjects