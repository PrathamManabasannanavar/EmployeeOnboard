require('dotenv').config()
const mongoose = require('mongoose')

async function connectDB(){
    try{
        const con = await mongoose.connect(process.env.MONGO_URI, {
            // useNewUrlParser: true, 
            // useUnifiedTopology: true,
        })

        con.connection.on('error', ()=>{
            console.log("Error");
        })
        con.connection.on('connected', ()=>{
            console.log("Connected");
        })
        con.connection.on('disconnected', ()=>{
            console.log("Disconnected");
        })

    }catch(err){
        console.log("Error occured", err)
    }

}

connectDB()