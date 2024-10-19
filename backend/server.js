import express from "express"
import cors from "cors"
import { db } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userModel from "./models/userModel.js";
import userRouter  from "./routes/userRoute.js";
import 'dotenv/config'
import cartRouter from "./routes/cartRoute.js";
import orderModel from "./models/orderModel.js";
import orderRouter from "./routes/orderRoute.js";

//app config
const app = express();
const port = 4000;


//middleware
app.use(express.json())
app.use(cors())

//db connection
db.connect((err) => {
    if(err) console.log("Connection error:", err);
    else console.log("Connected to the database");
});

//table creation
userModel(db);
orderModel(db);

//api endpoints
app.use("/api/food", foodRouter);
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/cart",cartRouter);
app.use("/api/order", orderRouter);

app.get('/', (req, res) => {
    res.send('api-working')
})

app.listen(port, () => {
    console.log(`Listening on Port no:${port}`);
})