const express=require('express');
const app=express();
const db=require('./database').connectDB;
app.use(express.json());
db();
app.listen(3000,()=>{
    console.log('server is running on port 3000');
});
