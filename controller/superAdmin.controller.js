"use strict"
const con=require("../DB/connect")
const bcrypt = require("bcrypt")
const jwt=require("jsonwebtoken")
const config = require("../config")


const superAdminFunc=async(data,res)=>{
   Promise.all(
    data.map(async(item)=>{
            if(item.role==3){
               return res.json({ack:0, status:401, message:"Super Admin Alredy Exit !"})
            }else{
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(req.body.password, salt)
            const addSuperAdminObject={
                name:req.body.name,
                email:req.body.email,
                password:password,
                role:3
              }
             const data=con.query("INSERT INTO users SET ?",addSuperAdminObject)
            if(data){
                res.json({ack:1, status:200, message:"Super Admin Add success"})
            }else{
                res.json({ack:1, status:200, message:"Some Tecnical Issue !"})
            }
            }
            })
            )
}
const superAdminAddManagment=async(req,res)=>{
    try{
        const superAdminCheck=con.query('SELECT * FROM users ORDER BY id desc',async function (err, rows) {
           
            if (err) {
                res.json({ack:1, status:200, message:"Some Tecnical Issue !"})
            } else {
                if(rows.length===0){
                    const salt = await bcrypt.genSalt(10)
                    const password = await bcrypt.hash(req.body.password, salt)
                    const addSuperAdminObject={
                        name:req.body.name,
                        email:req.body.email,
                        password:password,
                        role:3
                      }
                     const data=con.query("INSERT INTO users SET ?",addSuperAdminObject)
                    if(data){
                        res.json({ack:1, status:200, message:"Super Admin Add success"})
                    }else{
                        res.json({ack:1, status:200, message:"Some Tecnical Issue !"})
                    }
                }else{
                    await superAdminFunc(rows,res)
                }
            }
          })

    }catch(err){
        console.error(err)
        res.json({ack:0, status:500, message:"Server Error's"})
    }
}
const userGetManagment=async(req,res)=>{
    try{
        if(req.currentUserRole==3){
            con.query("SELECT * FROM users",async(err,result)=>{
                if(err)return res.json({ack:0, status:410, message:"Tecnical issue !"})
                res.json({ack:0, status:200, message:"success",responseData:result})
             })
        }else if(req.currentUserRole==2){
            con.query('SELECT * FROM users WHERE userAssign ="' + req.currentUserId +'"',async(err,result)=>{ 
                if(err) return res.json({ack:0, status:410, message:"Tecnical issue !"})
                res.json({ack:1, status:200, message:"success", responseData:result})
            })
        }else{
            res.json({ack:0, status:415, message:"Tecnical issue !"})
        }
     
    }catch(err){
        res.json({ack:0, status:500, message:"server error's"})
    }
}
const adminManagment=async(req,res)=>{
    try{
       console.log(req.currentUserRole)
        if(req.currentUserRole==3){
            const salt = await bcrypt.genSalt(10)
            const password = await bcrypt.hash(req.body.password, salt)
            const addSuperAdminObject={
                name:req.body.name,
                email:req.body.email,
                password:password,
                role:2
              }
             const data=con.query("INSERT INTO users SET ?",addSuperAdminObject)
             if(data){
                res.json({ack:1, status:200, message:"Admin Add success"})
            }else{
                res.json({ack:1, status:200, message:"Some Tecnical Issue !"})
            }
        }else{
          res.json({ack:0, status:407, message:"Tecnical Issue"})
        }
    }catch(err){
        res.json({ack:0, status:500, message:"Server Error's !"})
    }
}
const loginManagment=async(req,res)=>{
    try{
       const email=req.body.email
       const password=req.body.password
       const emailMatch=con.query('SELECT * FROM users WHERE email ="' + email +'"',async(err,result)=>{
        if(err) return res.json({ack:0, status:400, message:"Tecnical issue !"})
        const data= await bcrypt.compare(password, result[0].password)
        const token = jwt.sign(
            {
              _id: result[0].id,
              role:result[0].role,
              email:result[0].email,
            },
            config.secret,
            {
              expiresIn: '30d',
            }
          )
      if(data)
       return res.json({ack:1, status:200, message:"login success !",token:token})
       res.json({ack:0, status:400, message:"Invalid credentials !"})
       })

    
    }catch(err){
        console.error(err)
        res.json({ack:0, status:500, message:"Server Error's !"})
    }
}
const feedAddManagment=async(req,res)=>{
    try{
        if(req.currentUserRole==3){
            const feedObject={
                name:req.body.name,
                url:req.body.url,
                description:req.body.description
            }
            const data=con.query("INSERT INTO feeds SET ?",feedObject,async(err,result)=>{
                if(err) return res.json({ack:0, status:460, message:"Error's"})
                res.json({ack:1, status:200, message:"Feed Add Success"})
            })  
        }else{
            res.json({ack:0,status:404, message:"Tecnical issue !"})
        }
   
    }catch(err){
        res.json({ack:0, status:500, message:"Server Error's"})
    }
}
const feedGetManagment=async(req,res)=>{
    try{
       if(req.currentUserRole==3){
        con.query('SELECT * FROM feeds WHERE feedAssign ="' + req.currentUserId +'"',async(err,result)=>{
            if(err) return res.json({ack:0, status:400, message:"Tecnical issue's"})
            res.json({ack:1, status:200, message:"success",responseData:result})
          })
       }else if(req.currentUserRole==2){
          con.query('SELECT * FROM feeds WHERE feedAssign ="' + req.currentUserId +'"',async(err,result)=>{
            if(err) return res.json({ack:0, status:400, message:"Tecnical issue's"})
            res.json({ack:1, status:200, message:"success",responseData:result})
          })
       }else{
        res.json({ack:0, status:400, message:"Some occur's issue's !"})
       }
    }catch(err){
        res.json({ack:0, status:500, message:"Server Error's"})
    }
}
const feedUpdateManagment=async(req,res)=>{
    try{
      const id=req.query.id
      const feedObj={
        name:req.body.name,
        url:req.body.url,
        description:req.body.description
      }
      con.query('UPDATE feeds SET ? WHERE id="'+id+'"',feedObj,async(err,result)=>{
        if(err) return res.json({ack:0, status:409, message:"feed not update"})
        res.json({ack:1, status:200, message:"update success"})
      })
    }catch(err){
        console.error(err)
        res.json({ack:0, status:500, message:"server error's"})
    }
}

const feedDeleteManagment=async(req,res)=>{
    try{
        const id=req.query.id
        
        con.query('DELETE FROM feeds WHERE id="'+id+'"',async(err,result)=>{
          if(err) return res.json({ack:0, status:409, message:"feed not Deleted"})
          res.json({ack:1, status:200, message:"deleted success"})
        })
    }catch(err){
        console.error(err)
        res.json({ack:0, status:500, message:"server error's"})
    }
}
const feedAssignManagment=async(req,res)=>{
    try{
        if(req.currentUserRole==3){
            const id=req.query.id
            const feedId=req.query.feedId
            con.query('UPDATE users SET ? WHERE id = ?', [feedId], {feedAssign: id},async(err,result)=>{
                if(err) return res.json({ack:0, status:400, message:"Feed Assign Not success"})
                res.json({ack:1, status:200, message:"Feed Assign success"})
            })
        }else if(req.currentUserRole==2){
            const id=req.query.id
            const feedId=req.query.feedId
            con.query('UPDATE users SET ? WHERE id = ?', [feedId], {feedAssign: id},async(err,result)=>{
                if(err) return res.json({ack:0, status:400, message:"Feed Assign Not success"})
                res.json({ack:1, status:200, message:"Feed Assign success"})
            })
        }else{
            res.json({ack:0, status:405, message:"something is wrong"})
        }
    }catch(err){
        res.json({ack:0, status:500, message:"Server Error's"})
    }
}
const userFeedManagment=async(req,res)=>{
    try{
      if(req.currentUserRole==1){
        con.query('SELECT * FROM feeds WHERE feedAssign ="' + req.currentUserId +'"',async(err,result)=>{
            if(err) return res.json({ack:0, status:400, message:"Tecnical issue's"})
            res.json({ack:1, status:200, message:"success",responseData:result})
          })
      }else{
        res.json({ack:0, status:500, message:"somthing is wrong"})
      }
    }catch(err){
        res.json({ack:0, status:500, message:"Server Error's"})
    }
}
const userManagment=async(req,res)=>{
    try{
     if(req.currentUserRole==2){
        const salt = await bcrypt.genSalt(10)
        const password = await bcrypt.hash(req.body.password, salt)
        const addSuperAdminObject={
            name:req.body.name,
            email:req.body.email,
            password:password,
            userAssign:req.currentUserId,
            role:1
          }
         const data=con.query("INSERT INTO users SET ?",addSuperAdminObject)
         if(data){
            res.json({ack:1, status:200, message:"user's Add success"})
        }else{
            res.json({ack:1, status:200, message:"Some Tecnical Issue !"})
        }
     }else{
        res.json({ack:1, status:400, message:"Tecnical issue !"})
     }
    }catch(err){
        res.json({ack:0, status:500, message:"server error's"})
    }
}
const userdeletecronjob=async(req,res)=>{
    con.query('DELETE FROM users WHERE id="'+1+'"',async(err,result)=>{
        if(err) return res.json({ack:0, status:409, message:"feed not Deleted"})
        res.json({ack:1, status:200, message:"deleted success"})
      })
}
const superAdmin = {
    superAdminAddManagment,
    feedAddManagment,
    adminManagment,
    loginManagment,
    feedUpdateManagment,
    feedDeleteManagment,
    feedGetManagment,
    userManagment,
    userGetManagment,
    feedAssignManagment,
    userFeedManagment,
    userdeletecronjob
}
module.exports = superAdmin