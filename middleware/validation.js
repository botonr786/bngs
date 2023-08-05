var jwt = require("jsonwebtoken")
const con=require("../DB/connect")

const {
    ObjectID
} = require("bson")
const config=require("../config")

const verifyToken = async (req, res, next) => {
    try {
        var token = req?.headers?.authorization?.split(" ")[1]
        // console.log('app issue ',req.headers)
        const decode = jwt.verify(token, config.secret)
        const decodedToken = jwt.decode(token, {
            complete: true
        })
        const currentUser = decodedToken.payload
   
        con.query('SELECT * FROM users WHERE id="'+currentUser._id+'"',async(err,result)=>{
            if(err) return res.json({ack:0, status:405, message:"Invalid Users"})
            req.currentUserId=result[0].id
            req.currentUser = result[0]
            req.currentUserRole = result[0]?.role
            next()
        })
    } catch (error) {
        console.error(error)
        res.json(logError(600))
    }
}

const superAdminAuthCheck = async (req, res, next) => {
    // console.log(req.headers)
    try {
        var token = req.headers.authorization.split(" ")[1]
        const isAdmin = await adminModel.findOne({ _id: ObjectID(token) })
        if (!isAdmin) return res.json(logError(600))
        req.currentUserId = token
        next()
        // return decode
    } catch (err) {
        res.json(logError(600))
    }
}

module.exports = {
    verifyToken,
    superAdminAuthCheck,
}