import userModel from "../models/userModel.js"
import orderModel from "../models/orderModel.js"
import { comparePassword, hashPassword } from "../utils/authUtils.js"
import JWT from "jsonwebtoken"

//Register
export const registerControler = async (req, res) => {
    try {
        const { name, email, password, phone, address, answer } = req.body
        //validation
        if (!name) {
            return res.send({ message: "Name is Required" })
        }
        if (!email) {
            return res.send({ message: "Email is Required" })
        }
        if (!password) {
            return res.send({ message: "password is Required" })
        }
        if (!address) {
            return res.send({ message: "Address is Required" })
        }
        if (!phone) {
            return res.send({ message: "Phone number is Required" })
        }
        if (!answer) {
            return res.send({ message: "Answer is Required" })
        }
        const existingUser = await userModel.findOne({ email })
        //existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: "User already exist please login"
            })
        }
        //register user
        const hashedPassword = await hashPassword(password)

        //save
        const user = await new userModel({ name, email, phone, address, answer, password: hashedPassword }).save()
        res.status(201).send({
            success: true,
            message: "User Register Successfully",
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Error in Registration",
            error
        })
    }
}

//Login
export const loginControler = async (req, res) => {
    try {
        const { email, password } = req.body
        //validation
        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: "Invalid Email or Password"
            })
        }
        //check user
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Email is not registered"
            })
        }
        const match = await comparePassword(password, user.password)
        if (!match) {
            return res.status(200).send({
                success: false,
                message: "Invalid Password"

            })
        }
        //WebToken
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "5d",
        })
        res.status(200).send({
            success: true,
            message: "Login Successfull",
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            message: "Login Error",
            error
        })

    }

}
//Forgot passwrod 
export const forgotPasswordControler = async (req, res) => {
    try {
        const { email, answer, newPassword } = req.body;
        if (!email) {
            res.status(400).send({ message: "Email is required" })
        }
        if (!answer) {
            res.status(400).send({ message: "Answer is required" })
        }
        if (!newPassword) {
            res.status(400).send({ message: "New Password is required" })
        }
        //check 
        const user = await userModel.findOne({ email, answer });
        //valaidation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "Wrong Email or Answer"
            });
        }
        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, { password: hashed });
        res.status(200).send({
            success: true,
            message: "Password Reset Successfully!",
        });
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Something went wrong",
            error
        });

    }
};

//test route
export const testController = (req, res) => {
    res.send("protected route")
}

//update user profile
export const updateProfileController = async (req, res) => {
    try {
        const { name, email, password, address, phone } = req.body;
        const user = await userModel.findById(req.user._id)
        //password
        if (password && password.length < 6) {
            return res.json({ error: "Password is required and at least 6 character " })
        }
        const hashedPassword = password ? await hashPassword(password) : undefined;
        const updatedUser = await userModel.findByIdAndUpdate(req.user._id, {
            name: name || user.name,
            password: hashedPassword || user.password,
            phone: phone || user.phone,
            address: address || user.address
        }, { new: true })
        res.status(200).send({
            success: true,
            message: "User Profile Upstaed Successfully",
            updatedUser,
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({
            success: false,
            message: "Error while Update user profile",
            error
        })

    }
}
//get Orders
export const getOrdersController = async (req, res) => {
    try {
        const orders = await orderModel
            .find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.json(orders);

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Geting Orders Error",
            error
        })

    }
}
//All Orders for Admin
export const allOrdersController = async (req,res)=>{
    try {
        const orders = await orderModel
            .find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({createdAt: "-1"})
        res.json(orders);

    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Geting Orders Error",
            error
        })

    }
}
//Order Status
export const orderStatusController = async (req,res)=>{
    try { 
        const {orderId} = req.params;
        const {status} = req.body;
        const orders = await orderModel.findByIdAndUpdate(orderId,{status},{new:true})
        res.json(orders)
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:"Error in Order Status",
            error
        })
        
    }
}
//All users for Admin
export const allUsersController = async (req,res)=>{
    try {
        const users = await userModel.find({}).sort({ createdAt: -1 });
        res.json({users});
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: "Geting Users Error",
            error
        })

    }
}