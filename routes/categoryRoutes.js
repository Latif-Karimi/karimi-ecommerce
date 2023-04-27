import express from "express";
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";
import { categoryController, createCategoryController, deletCategoryController, singleCategoryController, updateCategoryController } from "../controllers/categoryController.js";

const router = express.Router()

//routers
//create category
router.post("/create-category", requireSignIn, isAdmin, createCategoryController)

//update category
router.put("/update-category/:id", requireSignIn,isAdmin,updateCategoryController)

//get All category
router.get("/all-category",categoryController)

//single category
router.get("/single-category/:slug",singleCategoryController)

//Delet Category
router.delete("/delete-category/:id",deletCategoryController)
export default router
