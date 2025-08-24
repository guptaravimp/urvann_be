const express=require("express");
const {  imageUpload } = require("../controllers/fileupload");
const router=express.Router();


router.post("/imageUpload",imageUpload);



module.exports=router;
