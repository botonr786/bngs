const express = require('express')
const router = express.Router()
const {verifyToken}=require("../middleware/validation")
const {
    superAdminAddManagment,
    loginManagment,
    adminManagment,
    feedAddManagment,
    feedUpdateManagment,
    feedDeleteManagment,
    userManagment,
    userGetManagment,
    feedGetManagment,
    feedAssignManagment,
    userFeedManagment
} = require("../controller/superAdmin.controller")
router.post("/AddSuperAdmin",superAdminAddManagment)
router.post("/login",loginManagment)
router.post("/adminAdd",verifyToken,adminManagment)
router.post("/userAdd",verifyToken,userManagment)
router.get("/userGet",verifyToken,userGetManagment)
router.post("/feedAdd",verifyToken,feedAddManagment)
router.post("/feedGet",verifyToken,feedGetManagment)
router.patch("/feedUpdate",verifyToken,feedUpdateManagment)
router.delete("/feedDelete",verifyToken,feedDeleteManagment)
router.patch("/assignFeeds",verifyToken,feedAssignManagment)
router.get("/userFeeds",verifyToken,userFeedManagment)
module.exports = router
{/* <h1>hello</h1> */}