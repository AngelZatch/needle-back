import { MikroORM, EntityManager, EntityRepository, RequestContext } from '@mikro-orm/core';
import express from 'express';
import cookieParser from 'cookie-parser';
import * as dotenv from 'dotenv';
import { Socket, Server } from "socket.io";

import { AuthController, ChannelController, UserController } from './controllers';
import { Channel, Message, Tag, User } from './models';
import ormConfig from './orm.config';
import { devInit, migrate } from './utils/dbGenerator';
import { createServer } from 'http';

dotenv.config();

export const DI = {} as {
    orm: MikroORM,
    em: EntityManager,
    userRepository: EntityRepository<User>,
    tagRepository: EntityRepository<Tag>,
    channelRepository: EntityRepository<Channel>
};

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);
const PORT = process.env.PORT || 8000;
const isDevEnv = process.env.NODE_ENV !== 'production';

(async () => {
    try {
        DI.orm = await MikroORM.init(ormConfig);
        DI.em = DI.orm.em;
        DI.userRepository = DI.orm.em.getRepository(User);
        DI.tagRepository = DI.orm.em.getRepository(Tag);
        DI.channelRepository = DI.orm.em.getRepository(Channel);

        if (isDevEnv) {
            await devInit(DI.orm);
        } else {
            await migrate(DI.orm);
        }

        app.use(express.json())
        app.use(cookieParser())
        app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
        app.use("/auth", AuthController);
        app.use("/channels", ChannelController);
        app.use("/users", UserController);
        app.use((_, res) => res.status(404).json({ message: 'Where are you trying to go?' }));

        io.on('connection', (socket: Socket) => {
            socket.on('auth', ({ channelId, user }: { channelId: string, user: number }) => {
                socket.join(`channel-${channelId}`)
                socket.emit('confirm', `Welcome, user ${user}`);
            })

            socket.on("message", ({ channelId, message }: { channelId: string, message: Message }) => {
                io.to(`channel-${channelId}`).emit('message', message)
            })
        });

        httpServer.listen(+PORT, () => {
            console.log(`App has started, listening on port ${PORT}`);
        });

    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();