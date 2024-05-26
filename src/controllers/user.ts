import { Request, Response} from 'express';

import bcrypt from "bcrypt";
import { User } from '../models/user';
import jwt from 'jsonwebtoken';

export const getPedos = (req: Request, res: Response) => {
    return res.json({
        msg: 'Upps ocurrio un error'
    })
}


export const newUser = async (req: Request, res: Response) => {

    // const { username, password, apodo, email, imagen } = req.body;
    const { username, email, password, password_confirm } = req.body;
    console.log(req.body)
    // Validamos si el usuario ya existe en la base de datos
    const user = await User.findOne({ where: { email: email } });

    if(user) {
       return res.status(400).json({
            msg: `Ya existe un usuario con el nombre ${username}`
        })
    } 
    console.log(user)

    const saltRounds = 10; // Número de rondas de sal
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // const hashedPassword = await bcrypt.hash(contrasena, 10);
    console.log(hashedPassword)
    try {
        // Guardarmos usuario en la base de datos
        await User.create({
            username: username,
            password: hashedPassword,
            email: email
        })
    
        res.status(201).json({
            msg: `Usuario ${username} creado exitosamente!`
        })
    } catch (error) {
        res.status(400).json({
            msg: 'Upps ocurrio un error',
            error
        })
    }
}

export const loginUser = async (req: Request, res: Response) => {

    const { username, password } = req.body;
    console.log(req.body)
   // Validamos si el usuario existe en la base de datos
   const user: any = await User.findOne({ where: { username: username } });

   if(!user) {
        return res.status(400).json({
            msg: `No existe un usuario con el nombre ${username} en la base datos`
        })
   }

   // Validamos password
   const passwordValid = await bcrypt.compare(password, user.password)
   if(!passwordValid) {
    return res.status(400).json({
        msg: `Password Incorrecta`
    })
   }

   // Generamos token
   const token = jwt.sign({
    username: username
   }, process.env.SECRET_KEY || 'SECRET', {expiresIn: "24h"});
   
   res.json(token);
}