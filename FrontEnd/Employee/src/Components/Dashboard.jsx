import { useState, useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom';
import styles from "../styles/DashBoard.module.css"

function DashBoard() {
    const [username, setUsername] = useState("")
    // const [hideBox, setHideBox] = useState(true)

    const navigate = useNavigate()

    useEffect(() => {
        async function getUsername() {
            try {
                const response = await fetch('http://localhost:10000/user/username', {
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

                setUsername(data.username)
            }
            catch (e) {
                console.log(e);
            }

        }

        getUsername()

    }, [])


    return (
        <div className={styles.parent}>
            <div className={styles.welcomeTxt}>
                Welcome back {username}!
            </div>

            <div className={styles.content}>
                <section className={styles.Tasks}>
                    <h3>
                        Tasks to Complete
                    </h3>
                    <div className={styles.TaskCoverBox}>
                        <Task/>
                    </div>
                </section>

               <section className={styles.Tasks}>
                    <h3>
                        Video materials
                    </h3>
                    <div className={styles.videoBox}>
                        <iframe src="https://www.youtube.com/embed/0zF06TOKKOE" title="Project Management 101: Beginner's Guide" allowFullScreen></iframe>
                        <iframe src="https://www.youtube.com/embed/Z3usMyZ5eXA" title="Project Management for Beginners (2024)" allowFullScreen></iframe>
                        <iframe src="https://www.youtube.com/embed/zucvmY6VpTI" title="Guided Tour of PM Tools & Software" allowFullScreen></iframe>
                        <iframe src="https://www.youtube.com/embed/K1B-y7R9Jl8" title="Project Management Tools & Techniques" allowFullScreen></iframe>
                    </div>
                </section>
            </div>   
        </div>
    )
}

function Task() {
    const [tasks, setTasks] = useState([])

    // for floating box
    const floatingBox = useRef(null)
    // useEffect(()=>{
    //     const ele = floatingBox.current
    //     // ele.innerHTML = "changed"
    //     console.log(ele);
    // }, [])

    async function displayFloatBox(keyid){
        floatingBox.current.style.display="block"

        console.log(keyid);
        
        const btns = document.getElementsByClassName('radioBtn')
        let selectedText = ""
        for(let btn of btns){
            if(btn.checked){
                selectedText = btn.value
            }
        }

        if(selectedText != ""){
            try{
                const response = await fetch('http://localhost:10000/user/updateProgress', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include', //for cookies
                    body: JSON.stringify({
                        _id: keyid,
                        selectedText: selectedText
                    })
                })

                const data = await response.json()
                console.log(data);
                window.location.reload()
            }
            catch(e){
                console.log(e);
            }
        }
    }



    //start of logic
    try {
        useEffect(() => {
            getTasks()
                .then((data) => setTasks(data))
                .catch(err => console.log(err))
        }, [])

        return (
            <>
                {tasks.map((task) => {
                    return (
                        <div key={task._id} className={styles.taskBox} onClick={()=>displayFloatBox(task._id)}>
                            <ul key={task._id}>
                                <li>
                                    Task Name: {task.task}
                                </li>
                                <li>
                                    TaskProgress: {task.progress}
                                </li>
                                <li>
                                    TaskDueDate: {task.dueDate.split('T')[0]}
                                </li>

                            </ul>
                        </div>
                    )
                })}




                {/* floating box */}
                <div ref={floatingBox} className={styles.floatBox}>
                    <form>
                        <div>
                            <label htmlFor="">Not Started</label>
                            <input type="radio" name="progress" value="not started" id="notStarted" className="radioBtn"/>                      
                        </div>

                        <div>
                            <label htmlFor="">In Progress</label>
                            <input type="radio" name="progress" value="in progress" id="inProgress" className="radioBtn"/>
                        </div>

                        <div>
                            <label htmlFor="">Completed</label>
                            <input type="radio" name="progress" value="completed" id="completed" className="radioBtn"/>
                        </div>
                    </form>
                </div>

            </>
        )

    }
    catch (e) {
        console.log(e);
    }
}


async function getTasks() {
    try {
        const response = await fetch('http://localhost:10000/user/tasks', {
            method: 'GET',
            credentials: 'include', // <- Important! This tells fetch to send cookies
            headers: {
                'Content-Type': 'application/json',
                // Add other headers here if needed
            },
        })

        const tasks = await response.json()
        console.log(tasks);
        return tasks
    }
    catch (e) {
        console.log(e);
        return e;
    }
}

export default DashBoard