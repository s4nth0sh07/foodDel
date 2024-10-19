import { db } from "../config/db.js";
import fs from 'fs'

//Add food item
const addFood = async (req, res) => {
    let image_filename = `${req.file.filename}`;
    try{
        await db.query("insert into food (name, description, price, category, image) values ($1,$2,$3,$4,$5)",[req.body.name, req.body.description, req.body.price, req.body.category, image_filename]);
        res.json({success: true, message: "Food Added"});
    }
    catch(error){
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

//all food list
const listFood = async (req,res) => {
    try{
        const response = await db.query("select * from food");
        const foods = response.rows;
        res.json({success: true, data:foods});
    }catch(error){
        console.log(error);
        res.json({success:false, message: "Error"});
    }
}

//remove food item
const removeFood = async (req, res) => {
    try{
        const response = await db.query("select * from food where id=($1)",[req.body.id]);
        const food = response.rows[0];
        console.log(food.image);
        fs.unlink(`uploads/${food.image}`,() => {})
        await db.query("delete from food where id=($1)",[req.body.id]);
        res.json({success: true, message: "food removed"});
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

export {addFood, listFood, removeFood}