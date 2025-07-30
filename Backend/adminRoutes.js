const express = require('express')
const AdminLogin = require('./AdminSchema')
const bcrypt = require('bcrypt')
const EmpProgress = require('./EmpProgressSchema')
const EmpLogins = require('./PasswordSchema')
const TaskSchema = require('./TaskSchema')

const router = express.Router()

async function checkLoggedin(req, resp, next){
    const user = await AdminLogin.findOne({username: req.session.username})
    if(!req.session.username || !user){
        resp.send({error: "Login failure"})
        return;
    }
    next();
}

router.post('/login', async (req, resp)=>{
    const {username, password} = req.body
    // console.log(username);
    // console.log(password);

    const dbUser = await AdminLogin.findOne({username: username})
    // console.log(dbUser);

    if(!dbUser){
        resp.status(409).send({success: false, msg: "User Not found"})
        return
    }
    // console.log(dbUser);
    const flag = await bcrypt.compare(password, dbUser.password)
    
    if(!username || !password ||  !flag){
        resp.status(409).send({success: false, msg: "Auth failure"})
        return
    }

    req.session.username = username
    resp.send({success: true, msg:"session created"})
})


router.post('/register', async (req, resp)=>{
    const saltRounds = 10;
    const username = req.body.username 

    try{
        const value = await AdminLogin.findOne({username: username});
        // console.log(value);
        if(value != null){
            resp.status(409).send({success: false, msg:"User already exists"});
            return;
        }

        const pass = req.body.password
        const hashedPass = await bcrypt.hash(pass, saltRounds)

        const employeeLogin = AdminLogin({
            username: username,
            password: hashedPass
        })

        await employeeLogin.save();
        resp.json("Employee registered")
    }catch(err){
        console.log("Error in saving Employee Details", err);
        resp.status(409).end('Error in saving Employee Details');
    }
})


router.get('/logout', checkLoggedin, (req, resp)=>{
    req.session.destroy((err)=>{
        if(!err){
            console.log("logout Successfull");
            resp.send({success: true, msg: "Logout Success"})
        }else{
            console.log("logout Unsuccessfull");
            resp.send({success: false, msg: "Logout Unsuccess"})
        }
    })
})


router.get('/tasks', checkLoggedin, async (req, resp)=>{
    try{
        const tasks = await TaskSchema.find({})
        resp.status(201).json(tasks)
        return
    }
    catch(e){
        console.log(e);
    }
})

//Add the task in tasksSchema colletions
router.put('/tasks', checkLoggedin, async (req, resp)=>{
    try{

        const {id, name, description} = req.body
        // console.log(name);
        const tasks = TaskSchema({
            id: id,
            Name: name,
            description: description
        })

        await tasks.save()
        resp.status(201).send({success: true, msg: "Task Registered"})
    }
    catch(e){
        console.log(e);
        resp.status(201).send({success: false, msg: "Task Not Registered"})
    }

})


//Task assigned to the employee
router.get('/employeeAssigned', checkLoggedin, async (req, resp)=>{
    try{
        const tasks = await EmpProgress.find({})
        resp.status(201).json(tasks)
        return
    }
    catch(e){
        console.log(e);
    }
})

//get all the employees list
router.get('/employees', checkLoggedin, async (req, resp)=>{
    try{
        const employees = await EmpLogins.find({}).select('-password')
        resp.status(201).json(employees)
        return
    }
    catch(e){
        console.log(e);
    }
})

router.post('/assignProject', checkLoggedin, async (req, resp)=>{
    const {empusername, projid, duedate} = req.body
    
    if(!empusername){
        resp.status(409).send({success: false, msg: "Username cannnot be null"})
        return
    }
    if(!projid){
        resp.status(409).send({success: false, msg: "Projid cannnot be null"})
        return
    }

    try{
        const taskData = await TaskSchema.findOne({id: parseInt(projid)})
        const empData = await EmpLogins.findOne({username: empusername})
        // console.log(taskData);
        // console.log(empData);
        // console.log(req.body);
        // console.log(parseInt(projid));
        if(!taskData || !empData){
            resp.status(409).send({success: false, msg: "Employee or task Undefined"})
            return
        }

        const empprogress = EmpProgress({
            username: empusername,
            task: taskData.Name,
            dueDate: duedate,
            taskId: taskData.id
        })

        await empprogress.save()
        resp.status(409).send({success: true, msg: "Entry Insertion Successful"})
    }catch(e){
        console.log(e);
        resp.status(409).send({success: false, msg: "DB error"})
    }

})

router.post('/removeProject', checkLoggedin, async (req, resp)=>{
    const {empusername, projid} = req.body
    if(!empusername){
        resp.status(409).send({success: false, msg: "Username cannnot be null"})
        return
    }
    if(!projid){
        resp.status(409).send({success: false, msg: "Projid cannnot be null"})
        return
    }

    console.log(empusername, projid);
    try{
        const flag = await EmpProgress.deleteMany({taskId: projid, username: empusername})
        console.log("Deleted the user", flag);
        resp.status(201).send({success: true, msg: "Task deleted"})
    }
    catch(e){
        console.log(e);
        resp.status(201).send({success: false, msg: "Task Not deleted"})
    }

})

module.exports = router