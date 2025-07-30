const express = require('express')
const bcrypt = require('bcrypt')
const router = express.Router();
const Employee = require('./Schema')
const EmployeeLogin = require('./PasswordSchema')


router.get('/', (req, resp)=>{
    resp.json('In home')
})

// Handling user Registration
router.post('/register', async (req, resp)=>{
    const saltRounds = 10;
    const user = req.body.username 

    try{
        const value = await EmployeeLogin.findOne({username: user});
        // console.log(value);
        if(value != null){
            resp.status(409).end("User already exists");
            return;
        }

        const pass = req.body.password
        const hashedPass = await bcrypt.hash(pass, saltRounds)

        const employeeLogin = EmployeeLogin({
            username: user,
            password: hashedPass
        })

        await employeeLogin.save();
        resp.json("Employee registered")
    }catch(err){
        console.log("Error in saving Employee Details", err);
        resp.status(409).end('Error in saving Employee Details');
    }
})



//Middleware for Authentication
function checkLoggedin(req, resp, next){
    if(!req.session.user){
        resp.end({"error": "Login failure"})
        return;
    }
    next();
}

//Credential check
router.post('/login', async (req, resp)=>{
    const {user, password} = req.body

    const dbUser = await Employee.findOne({username: user})
    const flag = await bcrypt.compare(password, dbUser.password)
    if(!user || !password ||  flag == null){
        resp.status(409).send("Auth failure")
        return
    }

    req.session.username = user
    resp.send("session created")
})


// router.get('/employee', checkLoggedin, async (req, resp)=>{
//     try{
//         value = await Employee.find();
//         console.log(value);
//         return resp.json(value);
//     }
//     catch(err){
//         console.log("/employee ",err);
//         return
//     }
// })

router.put('/employee', async (req, resp)=>{
    try{
        const employee = new Employee({
            username: req.body.username,
            name: req.body.name,
            salary: req.body.salary,
            loginTime: req.body.loginTime,
            logoutTime: req.body.logoutTime
        })
        
        await employee.save();
        resp.json("Saved successfully")
    }
    catch(err){
        console.log(err);
        resp.json("Error occured")
    }
})

module.exports = router