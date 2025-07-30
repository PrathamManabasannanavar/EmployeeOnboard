import { useEffect, useState } from "react"
import styles from "../styles/AdminPanel.module.css"
import { useNavigate } from "react-router-dom"

function AdminPanel() {

    const [tasks, setTasks] = useState([])
    const [employees, setEmployees] = useState([])
    const [employeeAssigned, setEmployeeAssigned] = useState([])
    // const [clickedEmp, setClickedEmp] = useState(false)

    const navigate = useNavigate()

    // for user login check
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
            }
            catch (e) {
                console.log(e);
            }

        }

        getUsername()

    }, [])



    useEffect(() => {

        async function getEmployees() {
            const response = await fetch('http://localhost:10000/admin/employees', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()
            console.log(data);
            setEmployees(data)
        }


        async function getTasks() {
            const response = await fetch('http://localhost:10000/admin/tasks', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()
            setTasks(data)
            console.log(tasks);
        }

        //Employee assigned
        async function getEmpAssigned() {
            const response = await fetch('http://localhost:10000/admin/employeeAssigned', {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()
            console.log(data);
            setEmployeeAssigned(data)
        }

        getTasks()
        getEmployees()
        getEmpAssigned()

        
    }, [])
    
    return (
        <div className={styles.parent}>

            <section className={styles.taskSection}>
                <h3>
                    Task List
                </h3>
                <div className={styles.taskContent}>
                    {
                        tasks.map((task) => {
                            return (
                                <div key={task._id} className={styles.taskBox}>
                                    <div>
                                        Task ID: {task.id}
                                    </div>
                                    <div>
                                        Task Name: {task.Name}
                                    </div>

                                    <div>
                                        Description: {task.description}
                                    </div>
                                </div>

                            )
                        })
                    }

                </div>
            </section>


            <section className={styles.empSection}>
                <h3>
                    Employees List
                </h3>
                <div className={styles.empContent}>

                    {(employees == []) ? "" : (
                        employees.map((employee) => {
                            return (
                                <div key={employee._id} className={styles.empBox}>
                                    <div>
                                        Username: {employee.username}
                                    </div>
                                    <div>
                                        Name: {employee.name}
                                    </div>

                                    {/* <div>
                                            Salary: {employee.salary}
                                        </div> */}

                                    <div>
                                        <div>
                                            Projects Assigned:
                                        </div>
                                        {
                                            <EmployeeBox username={employee.username} tasks={employeeAssigned} key={employee.username} />
                                        }
                                    </div>

                                </div>

                            )
                        })
                    )
                    }

                </div>
            </section>


            {/* for the float Box */}
            {/* {(!clickedEmp) ? "" : (
                <FloatBox />
            )} */}
        </div>
    )
}


// function FloatBox({ username, tasks, empTasks }) {

//     const assignedTasks = empTasks.filter((task) => task.username == username)
//     const assignedTasksSet = new Set(assignedTasks.map(task => task.taskId))

//     return (
//         <div className={styles.floatBox}>
//             <div className={styles.floatFormBox}>
//                 <form>
//                     {
//                         tasks.map((task) => {
//                             return (
//                                 <div key={task.id}>
//                                     <label htmlFor={`checkBox-${task.id}`}>
//                                         {task.task}
//                                     </label>

//                                     {
//                                         assignedTasksSet.has(task.id) ? (
//                                             <input type="checkbox" name="checkBox" id={`checkBox-${task.id}`} defaultChecked />
//                                         ) : (
//                                             <input type="checkbox" name="checkBox" id={`checkBox-${task.id}`} />
//                                         )
//                                     }
//                                 </div>
//                             );
//                         })
//                     }

//                 </form>
//             </div>
//         </div>
//     )
// }


function EmployeeBox({ username, tasks }) {
    const taskAssignedToUser = tasks.filter(task => task.username == username)
    console.log(taskAssignedToUser);

    return (
        <div className={styles.EmpBox}>
            {(taskAssignedToUser.length == 0) ? <div>None</div> : (
                taskAssignedToUser.map((task, index) => {
                    return (
                        <div key={index}>
                            {index + 1}. {task.task} - {task.progress}
                        </div>
                    )
                })

            )
            }
        </div>
    )
}

export default AdminPanel