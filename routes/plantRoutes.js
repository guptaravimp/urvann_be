const express=require("express");
const router=express.Router();
const {addPlant, addCategory, getAllPlantByCategory, getAllCategories, getAllPlants, searchPlants}=require("../controllers/plantController");

router.post("/test", (req, res) => {
    res.json({
        success: true,
        message: "Server is working",
        timestamp: new Date().toISOString()
    });
});



router.post("/addPlant",addPlant);

router.post("/addCategory",addCategory);
router.get("/getAllPlants",getAllPlants);
router.get("/search",searchPlants);
router.get("/getAllPlantByCategory",getAllPlantByCategory);
router.get("/getAllCategories",getAllCategories);

module.exports=router;
