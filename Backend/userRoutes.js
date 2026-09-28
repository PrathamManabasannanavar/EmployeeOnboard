const express = require('express')
const bcrypt = require('bcrypt')
// const Employee = require('./Schema')
const EmpLogin = require('./PasswordSchema')
const EmpProgress = require('./EmpProgressSchema')
// const Employee = require('./EmployeeSchema')

const router = express.Router()


function checkLoggedin(req, resp, next) {
    if (!req.session.username) {
        resp.send({ error: "Login failure" })
        return;
    }
    next();
}


router.get('/', (req, resp) => {
    resp.json('In home of UserRouter')
})

router.get('/session', (req, resp) => {
    if (req.session.username) {
        resp.send({ loggedIn: true, msg: "LoggedIn", user: req.session.username })
        return
    } else {
        resp.send({ loggedIn: false, msg: "Not LoggedIn" })
        return
    }
})


router.post('/register', async (req, resp) => {
    const saltRounds = 10;
    const username = req.body.username
    const name = req.body.name

    try {
        const value = await EmpLogin.findOne({ username: username });
        // console.log(value);
        if (value != null) {
            resp.status(409).send({ success: false, msg: "User already exists" });
            return;
        }

        const pass = req.body.password
        const hashedPass = await bcrypt.hash(pass, saltRounds)

        const employeeLogin = EmpLogin({
            username: username,
            password: hashedPass,
            name: name
        })

        await employeeLogin.save();

        // console.log(name);
        resp.json("Employee registered")

    } catch (err) {
        console.log("Error in saving Employee Details", err);
        resp.status(409).end('Error in saving Employee Details');
    }
})


router.post('/login', async (req, resp) => {
    const { username, password } = req.body
    // console.log(username);
    // console.log(password);

    const dbUser = await EmpLogin.findOne({ username: username })
    // console.log(dbUser);

    if (!dbUser) {
        resp.status(409).send({ success: false, msg: "User Not found" })
        return
    }
    // console.log(dbUser);
    const flag = await bcrypt.compare(password, dbUser.password)

    if (!username || !password || !flag) {
        resp.status(409).send({ success: false, msg: "Auth failure" })
        return
    }

    req.session.username = username
    resp.send({ success: true, msg: "session created" })
})

router.get('/logout', (req, resp) => {
    req.session.destroy((err) => {
        if (!err) {
            console.log("logout Successfull");
            resp.send({ success: true, msg: "Logout Success" })
        } else {
            console.log("logout Unsuccessfull");
            resp.send({ success: false, msg: "Logout Unsuccess" })
        }
    })
})

router.get('/dashboard', checkLoggedin, (req, resp) => {
    resp.json({ 0: "This is DashBoard" })
})

router.get('/username', checkLoggedin, (req, resp) => {
    if (!req.session.username) {
        resp.send({ username: "" })
        return
    }
    resp.send({ username: req.session.username })
})

router.get('/tasks', checkLoggedin, async (req, resp) => {
    try {
        const tasks = await EmpProgress.find({ username: req.session.username })
        // const data = await tasks.json()
        // console.log(tasks);
        resp.status(201).send(tasks)
        // resp.send({0: "hi"})
    }
    catch (e) {
        console.log(e);
        resp.status(509).send({ success: false, error: "Error occured" })
    }
})

router.post('/updateProgress', checkLoggedin, async (req, resp) => {
    const { _id, selectedText } = req.body

    // console.log("IN update progress", _id, selectedText);
    try {
        await EmpProgress.updateOne(
            { _id: _id },
            { $set: { progress: selectedText } }
        )
        resp.status(201).send({ success: true, msg: "Progress Updated" })
        return
    }
    catch (e) {
        resp.status(409).send({ success: false, msg: "Progress not Updated" })
        console.log(e);
        return
    }

})


module.exports = router