import mongoose from "mongoose";
import express from "express";
import app from './app.js';
import { connectDB } from './config/db.js';



async function main() {
   await connectDB();  
   app.listen(3001, () => {
   console.log('Server is running on port 3001');
});
}
main();