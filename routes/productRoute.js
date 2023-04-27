import express from 'express'
import {
    braintreePaymentController,
    braintreeTokenController,
    createProductController,
    deleteProductController,
    getProductController,
    getSingleProductController,
    productCategoryController,
    productCountController,
    productFilterController,
    productListController,
    productPhotoController,
    searchProductController,
    smimilarProductController,
    updateProductController
} from '../controllers/productController.js'
import { isAdmin, requireSignIn } from '../middlewares/authMiddleware.js'
import formidable from 'express-formidable'
import braintree from 'braintree'



const router = express.Router()

//Routes
//create product
router.post("/create-product",
    requireSignIn,
    isAdmin, formidable(), createProductController)
//All product
router.get("/get-product", getProductController)

//Single product
router.get("/get-product/:slug", getSingleProductController)
//get photo
router.get('/product-photo/:pid', productPhotoController)

//Delete product
router.delete("/delete-product/:pid", deleteProductController)

//update product
router.put("/update-product/:pid",
    requireSignIn,
    isAdmin, formidable(), updateProductController)

//filters product
router.post("/product-filter", productFilterController);
//product count
router.get("/product-count", productCountController)
//product per page
router.get("/product-list/:page", productListController)
//Search Product
router.get("/search/:keyword", searchProductController)
//Similar product
router.get("/similar-product/:pid/:cid",smimilarProductController) 
//category wise product
router.get("/product-category/:slug",productCategoryController )
//payment
//token
router.get("/braintree/token", braintreeTokenController );

//payment
router.post("/braintree/payment",requireSignIn,braintreePaymentController)

export default router