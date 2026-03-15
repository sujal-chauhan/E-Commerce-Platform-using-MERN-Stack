import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import path from 'path';

import connectDB from "./config/db.ts"

import productRouter from './Product/productRoutes.ts';
import authRouter from './auth/authRoutes.ts'
import userRouter from './User/userRoutes.ts'
import cartRouter from './Cart/cartRoutes.ts'
import orderRouter from './Order/orderRoutes.ts'

const app = express()
const PORT = process.env.PORT || 5000;

//connect mongodb
await connectDB(); 

//middlewaressss
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res)=>{
    res.send('This is server')
})

app.use("/images", express.static(path.join(process.cwd(), "images")));

app.use('/auth', authRouter)
app.use('/user', userRouter)
app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', orderRouter);

app.listen(PORT, ()=>{
    console.log("Server listening at port : ", PORT);
}) 