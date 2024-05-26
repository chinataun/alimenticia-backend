import express, { Application } from "express";
import cors from 'cors';
import routesUser from '../routes/user';
import { User } from './user';

class Server {
    private app: Application;
    private port: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || '3000';
        this.listen();
        this.midlewares();
        this.routes();
        this.dbConnect();
    }

    listen() {
        this.app.listen(this.port, () => {
            console.log(`Servidor escuchando en el puerto ${this.port}`)
        })
    }

    routes() {
        this.app.use('/api/users', routesUser);
    }

    midlewares() {
        // Parseo body
        this.app.use(express.json());

        // Cors
        this.app.use(cors());
    }

    async dbConnect() {
        try {
            await User.sync();
            console.log('conectados a la base de datos')
        } catch (error) {
            console.error('Unable to connect to the database:', error);
        }
    }
}

export default Server;