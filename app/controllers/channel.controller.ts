import { Router } from "express";
import { DI } from "..";

const router = Router()

router.get("/", async (_, response) => {
    const channels = await DI.channelRepository.findAll();

    response.json(channels);
})

export const ChannelController = router;