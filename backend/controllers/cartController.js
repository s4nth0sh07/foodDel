import { db } from "../config/db.js";

//add item to user cart
const addToCart = async (req, res) => {
    try{
        const response = await db.query('select * from users where id=$1',[req.body.userId]);
        const userData = response.rows[0];
        const cartData = userData.cartdata;
        if(!cartData[req.body.itemId]) cartData[req.body.itemId]=1;
        else cartData[req.body.itemId]+=1;
        await db.query('update users set cartdata=($1) where id=($2)',[cartData, req.body.userId]);
        res.json({success:true, message: "Added to Cart"})
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

//remove items from user cart
const removeFromCart = async (req, res) => {
    try{
        const response = await db.query('select * from users where id=($1)',[req.body.userId]);
        const cartData = await response.rows[0].cartdata;
        if(cartData[req.body.itemId]>0){
            cartData[req.body.itemId] -=1;
        }
        await db.query('update users set cartdata=($1) where id=($2)',[cartData, req.body.userId]);
        res.json({success: true, message: "Removed from Cart"});
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

//fetch user cart data
const getCart = async (req, res) => {
    try{
        const response = await db.query('select * from users where id=($1)',[req.body.userId]);
        const cartData = await response.rows[0].cartdata;
        res.json({success:true, cartData});
    }catch(error){
        console.log(error);
        res.json({success: false, message: "Error"});
    }
}

export {addToCart, removeFromCart, getCart}