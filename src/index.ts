import dotenv from 'dotenv';
import Server from "./models/server";

dotenv.config({path : './.env'})

const server = new Server();