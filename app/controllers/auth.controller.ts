import { Router } from "express";
import { DI } from "../index";
import { User } from "../models/user.model";

const router = Router()
const SALT_ROUNDS = 10

router.post("/signup", async (request, response) => {
    const { mail, password, nickname } = request.body;
    
    if(await DI.userRepository)
    
    response.status(503).send('LOL');
})

export const AuthController = router;