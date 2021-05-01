import { wrap } from "@mikro-orm/core";
import { Router } from "express";

import { DI } from "../index";

const router = Router()

router.put("/:id", async (request, response) => {
    try {

        const user = await DI.userRepository.findOne(+request.params.id);
        
        if (!user) {
            return response.status(404).json({ message: 'User not found' });
        }

        const { mail, nickname, tags } = request.body;
        
        wrap(user).assign({ mail, nickname, tags });
        await DI.userRepository.flush();
        
        response.json(user);
    } catch (error) {
        return response.status(400).json({ message: error.message });
    }
})

export const UserController = router;