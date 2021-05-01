import { Router } from "express";
import { DI } from "../index";
const bcrypt = require('bcrypt');
import { User } from "../models/user.model";

const router = Router()
const SALT_ROUNDS = 10

router.post("/signup", async (request, response) => {
    const { mail, password, nickname } = request.body;

    if (!mail || !password || !nickname) {
        return response.status(412).send('You need to provide a mail address, a password and a nickname to register');
    }
    
    if (await DI.userRepository.findOne({ mail })) {
        return response.status(409).send('The mail address is invalid or already in use.')
    }

    try {
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        const user = new User(nickname, hashedPassword, mail);
        await DI.userRepository.persistAndFlush(user);
        
        response.json(user);
    } catch (error) {
        return response.status(400).json({ message: error.message });
    }
})

export const AuthController = router;