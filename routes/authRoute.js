import express from "express";
import { registerControler,loginControler,testController,forgotPasswordControler, updateProfileController, getOrdersController, allOrdersController, orderStatusController, allUsersController } from "../controllers/authController.js";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";


// Create a router object
const router = express.Router();

// Register || Method post
router.post("/register", registerControler);

//Login || POST
router.post("/login", loginControler)

//Forgot password || POST
router.post('/forgot-password',forgotPasswordControler)

//test Route
router.get("/test",requireSignIn,isAdmin, testController)

//protected User Route auth
router.get('/user-auth',requireSignIn,(req,res)=>{ 
    res.status(200).send({ok:true})
})
//protected Admin Route auth
router.get('/admin-auth',requireSignIn,isAdmin,(req,res)=>{
    res.status(200).send({ok:true})
})

//update user profile
router.put("/profile",requireSignIn,updateProfileController)

//orders
router.get("/orders",requireSignIn,getOrdersController )
//All orders for Admin
router.get("/all-orders", requireSignIn,isAdmin,allOrdersController)
//Order status
router.put("/order-status/:orderId", requireSignIn,isAdmin,orderStatusController)
//All users for Admin
router.get("/all-users", requireSignIn,isAdmin,allUsersController)
export default router;
