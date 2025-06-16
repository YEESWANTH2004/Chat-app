import express from 'express';
import cors from 'cors';
import "dotenv/config";
import http from 'http';

import { connectDB } from './lib/db.js'; // Adjust the path as necessary
import userRouter from './routes/userRoutes.js';

//Create express app and http server

const app = express();
const server = http.createServer(app);

//middleware

app.use(express.json({limit:"4mb"}));
app.use(cors());


//Routes setup
app.use("/api/status", (req,res)=> res.send("Server is running"));
app.use("/api/auth", userRouter)

//Connect to MongoDB
await connectDB();

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});