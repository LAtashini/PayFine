import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/mongodb.js'
import connectCloudinary from './config/cloudinary.js'
import adminRouter from './routes/adminRouter.js'
import policeRouter from './routes/policeRouter.js'
import driverRouter from './routes/driverRouter.js'
import revenueRouter from './routes/revenueRouter.js';


//app config
const app = express()
const port = process.env.PORT || 4000
connectDB()
connectCloudinary()

//middlewares
app.use(express.json());
app.use(cors());

//API endpoint

app.use('/api/admin', adminRouter)
app.use('/api/police', policeRouter)
app.use('/api/driver', driverRouter)
app.use('/api/revenue', revenueRouter);

app.get('/', (req, res) => {
    res.send('API WORKING')
})

app.listen(port, () => console.log("server started", port))