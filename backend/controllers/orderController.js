import { db } from "../config/db.js";
import Stripe from  "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order from frontend
const placeOrder = async (req, res) => {
    const frontend_url = "http://localhost:5174";
    try{
        const newOrder = await db.query('insert into orders (userId, items, amount, address) values ($1, $2, $3, $4) returning id',[req.body.userId, req.body.items, req.body.amount, req.body.address]);
        await db.query('update users set cartdata=($1) where id=($2)',[{}, req.body.userId]);

        const line_items = req.body.items.map((item)=>({
            price_data:{
                currency:"inr",
                product_data:{
                    name:item.name
                },
                unit_amount:item.price*100*80
            },
            quantity:item.quantity
        }))

        line_items.push({
            price_data:{
                currency:"inr",
                product_data:{
                    name:"Delivery Charges"
                },
                unit_amount: 2*100*80
            },
            quantity:1
        })

        const session = await stripe.checkout.sessions.create({
            line_items: line_items,
            mode: 'payment',
            success_url:`${frontend_url}/verify?success=true&orderId=${newOrder.rows[0].id}`,
            cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder.rows[0].id}`
        })

        res.json({success: true, session_url: session.url});
    }catch(error){
        console.log(error);
        res.json({success:false, message: "Error"});
    }
}

const verifyOrder = async (req, res) => {
    const {orderId, success} = req.body;
    try{
        if(success=="true"){
            await db.query('update orders set payment=($1) where id=($2)',[true, orderId]);
            res.json({success:true, message:"paid"});
        }else{
            await db.query('delete from orders where id=($1)', [orderId]);
            res.json({success:false, message:"not paid"})
        }
    }catch(error){
        console.log(error);
        res.json({success:false, message:"error"});
    }
}

//user orders for frontend
const userOrders = async (req, res) => {
    try{
        const response = await db.query('select * from orders where userid=($1)',[req.body.userId]);
        const orders = response.rows;
        res.json({success: true, data:orders});
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}


//Listing Orders for admin Panel
const listOrders = async (req, res) => {
    try{
        const response = await db.query("select * from orders");
        const orders = response.rows;
        res.json({success:true, data:orders});
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error"});
    }
}

//api for updating order status
const updateStatus = async (req, res) => {
    try{
        await db.query('update orders set status=($1) where id=($2)', [req.body.status, req.body.orderId]);
        res.json({success: true, message: "Status Updated"});
    }catch(error){
        console.log(error);
        res.json({success: false, message:"Error"});
    }
}

export {placeOrder, verifyOrder, userOrders, listOrders, updateStatus}