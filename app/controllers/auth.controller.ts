import { Router } from "express";
import { User } from "../models/user.model";

const router = Router()
const SALT_ROUNDS = 10

router.post("/signup", async (request, response) => {
    response.status(503).send('LOL');
})

export const AuthController = router;