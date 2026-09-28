import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import styles from "../styles/DashBoard.module.css"
import { useAuth } from "../useAuth"
import { API_BASE } from "../api"

function DashBoard() {
    const { user: username } = useAuth()


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
    const [taskError, setTaskError] = useState("")
    const navigate = useNavigate()

    const [selectedTask, setSelectedTask] = useState(null)
    const [selectedProgress, setSelectedProgress] = useState("")
    const [isSaving, setIsSaving] = useState(false)

    function displayFloatBox(keyid){
        const task = tasks.find((item) => item._id === keyid)
        setSelectedTask(task)
        setSelectedProgress(task?.progress || "not started")
    }

    async function updateProgress(event){
        event.preventDefault()
        if (!selectedTask) return
        setIsSaving(true)
        try{
            const response = await fetch(`${API_BASE}/user/updateProgress`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ _id: selectedTask._id, selectedText: selectedProgress })
            })
            const data = await response.json()
            if (!response.ok || data.success === false) throw new Error(data.msg || "Unable to update progress")
            setTasks((currentTasks) => currentTasks.map((task) => task._id === selectedTask._id ? { ...task, progress: selectedProgress } : task))
            setSelectedTask(null)
        }
        catch(error){ console.error(error) }
        finally { setIsSaving(false) }
    }

    useEffect(() => {
        getTasks()
            .then((data) => setTasks(data))
            .catch((error) => {
                if (error.message === "UNAUTHORIZED") {
                    navigate('/', { replace: true })
                    return
                }
                setTaskError("Tasks are temporarily unavailable.")
                console.error(error)
            })
    }, [navigate])

    return (
        <>
            {taskError ? <p>{taskError}</p> : null}
            {!taskError && tasks.length === 0 ? <p>No tasks assigned yet.</p> : null}
                {tasks.map((task) => {
                    return (
                        <div key={task._id} className={styles.taskBox} onClick={()=>displayFloatBox(task._id)}>
                            <ul>
                                <li>
                                    Task Name: {task.task}
                                </li>
                                <li>
                                    TaskProgress: {task.progress}
                                </li>
                                <li>
                                    TaskDueDate: {task.dueDate ? task.dueDate.split('T')[0] : "Not set"}
                                </li>

                            </ul>
                        </div>
                    )
            })}




                {selectedTask ? (
                    <div className={styles.dialogBackdrop} onClick={() => setSelectedTask(null)}>
                        <section className={styles.floatBox} role="dialog" aria-modal="true" aria-labelledby="progress-title" onClick={(event) => event.stopPropagation()}>
                            <button type="button" className={styles.closeButton} onClick={() => setSelectedTask(null)} aria-label="Close">×</button>
                            <span className={styles.dialogEyebrow}>Task progress</span>
                            <h4 id="progress-title">{selectedTask.task}</h4>
                            <p>Update the status so your team knows where things stand.</p>
                            <form onSubmit={updateProgress}>
                                <div className={styles.progressOptions}>
                                    {["not started", "in progress", "completed"].map((progress) => (
                                        <label key={progress} className={selectedProgress === progress ? styles.activeProgress : ""}>
                                            <input type="radio" name="progress" value={progress} checked={selectedProgress === progress} onChange={(event) => setSelectedProgress(event.target.value)} />
                                            <span>{progress}</span>
                                        </label>
                                    ))}
                                </div>
                                <button type="submit" className={styles.saveButton} disabled={isSaving}>
                                    {isSaving ? "Saving..." : "Save status"}
                                </button>
                            </form>
                        </section>
                    </div>
                ) : null}

        </>
    )
}


async function getTasks() {
    try {
        const response = await fetch(`${API_BASE}/user/tasks`, {
            method: 'GET',
            credentials: 'include', // <- Important! This tells fetch to send cookies
            headers: {
                'Content-Type': 'application/json',
                // Add other headers here if needed
            },
        })

        const data = await response.json()
        if (response.status === 401 || data?.error === "Login failure") {
            throw new Error("UNAUTHORIZED")
        }
        if (!response.ok || !Array.isArray(data)) {
            throw new Error("TASKS_UNAVAILABLE")
        }
        return data
    }
    catch (e) {
        throw e
    }
}

export default DashBoard