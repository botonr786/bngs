const mysql=require("mysql")
const con=mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"",
    database:"bng"
});
con.connect((err)=>{
    if(err){
        console.log("error is connection")
    }else{
        console.log("Database connection Success")
    }
})
module.exports=con;