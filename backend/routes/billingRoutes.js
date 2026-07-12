const express=require("express");

const router=express.Router();


const {
    createBill,
    payBill
} = require("../controllers/billingController");


const {
protect,
authorize
}=require("../middleware/authMiddleware");



router.post(
"/create",
protect,
authorize("Doctor"),
createBill
);

router.put(
    "/pay/:id",
    protect,
    authorize("Patient"),
    payBill
);

module.exports=router;