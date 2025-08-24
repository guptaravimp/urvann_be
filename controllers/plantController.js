const Plant = require("../models/Plant");
const Category = require("../models/Category");

const addPlant = async (req, res) => {
    try {
        const { plantName, plantPrice, plantImage, plantDescription, plantCategories, plantAvailability, usertype } = req.body;

        if(usertype !== "admin"){
            return res.status(400).json({ message: "You are not authorized to add a plant" });
        }

        if (!plantName || !plantPrice || !plantImage || !plantCategories) {
            return res.status(400).json({ message: "All fields are required" });
        }

        for (let categoryId of plantCategories) {
            const categoryExists = await Category.findById(categoryId);
            if (!categoryExists) {
                return res.status(400).json({ message: `Invalid category ID: ${categoryId}` });
            }
        }

        if (plantAvailability === undefined) {
            return res.status(400).json({ message: "Plant availability is required" });
        }
        if (plantPrice <= 0) {
            return res.status(400).json({ message: "Plant price must be greater than 0" });
        }

        const newplant = await Plant.create({ plantName, plantPrice, plantImage, plantDescription, plantCategories, plantAvailability });
        
        await newplant.populate('plantCategories', 'categoryName description');
        
        return res.status(201).json({
            success: true,
            message: "Plant added successfully",
            newplant,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in adding plant",
            error: error.message,
        });
    }
}



const addCategory = async(req, res) => {
    try {
        const { categoryName, description } = req.body;
        
        if (!categoryName) {
            return res.status(400).json({ 
                success: false,
                message: "Category name is required" 
            });
        }

        const newCategory = await Category.create({ 
            categoryName, 
            description: description || "" 
        });
        
        return res.status(201).json({
            success: true,
            message: "Category added successfully",
            newCategory,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error in adding category",
            error: error.message,
        })
    }
}

const getAllPlantByCategory = async(req, res) => {
    try {
        const { category, categoryId } = req.query;
        const categoryToFilter = category || categoryId;
        
        if (!categoryToFilter) {
            return res.status(400).json({
                success: false,
                message: "Category ID is required"
            });
        }

        const plants = await Plant.find({ plantCategories: categoryToFilter })
            .populate('plantCategories', 'categoryName description');
            
        return res.status(200).json({
            success: true,
            message: "Plants fetched successfully",
            plants,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching plants by category",
            error: error.message,
        })
    }
}

const getAllCategories = async(req, res) => {
    try {
        const categories = await Category.find({ isActive: true }).select('categoryName description');
        
        return res.status(200).json({
            success: true,
            message: "Categories fetched successfully",
            categories,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error fetching categories",
            error: error.message,
        })
    }
}

const getAllPlants = async(req, res) => {
    try {
        console.log('🔍 getAllPlants function called');
        
        // Check database connection
        const mongoose = require("mongoose");
        if (mongoose.connection.readyState !== 1) {
            console.error('❌ Database not connected. ReadyState:', mongoose.connection.readyState);
            return res.status(500).json({
                success: false,
                message: "Database connection not established",
                readyState: mongoose.connection.readyState
            });
        }
        
        console.log('✅ Database connected, fetching plants...');
        const plants = await Plant.find({}).populate('plantCategories', 'categoryName description');
        
        console.log(`✅ Found ${plants.length} plants`);
        return res.status(200).json({
            success: true,
            message: "Plants fetched successfully",
            plants,
        })
    } catch (error) {
        console.error('❌ Error in getAllPlants:', error);
        return res.status(500).json({
            success: false,
            message: "Error fetching plants",
            error: error.message,
        })
    }
}

const searchPlants = async (req, res) => {
    try {
        const { query } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                message: "Search query is required"
            });
        }

        const plants = await Plant.find({
            $or: [
                { plantName: { $regex: query, $options: 'i' } },
                { plantDescription: { $regex: query, $options: 'i' } }
            ]
        }).populate('plantCategories', 'categoryName description');

        const categoryPlants = await Plant.find({
            plantCategories: {
                $in: await Category.find({
                    categoryName: { $regex: query, $options: 'i' }
                }).distinct('_id')
            }
        }).populate('plantCategories', 'categoryName description');

        const allPlants = [...plants, ...categoryPlants];
        const uniquePlants = allPlants.filter((plant, index, self) => 
            index === self.findIndex(p => p._id.toString() === plant._id.toString())
        );

        return res.status(200).json({
            success: true,
            message: "Plants found successfully",
            plants: uniquePlants,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error searching plants",
            error: error.message,
        });
    }
};

module.exports = { addPlant, addCategory, getAllPlantByCategory, getAllCategories, getAllPlants, searchPlants };