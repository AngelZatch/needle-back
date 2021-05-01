import { MikroORM, EntityManager, EntityRepository, RequestContext } from '@mikro-orm/core';
import express from 'express';

import { AuthController } from './controllers';
import { Tag } from './models/tag.model';
import { User } from './models/user.model';
import ormConfig from './orm.config';
import { devInit, migrate } from './utils/dbGenerator';

export const DI = {} as {
    orm: MikroORM,
    em: EntityManager,
    userRepository: EntityRepository<User>,
    tagRepository: EntityRepository<Tag>,
};

const app = express();
const PORT = process.env.PORT || 8000;
const isDevEnv = process.env.NODE_ENV !== 'production';

(async () => {
    try {
        DI.orm = await MikroORM.init(ormConfig);
        DI.em = DI.orm.em;
        DI.userRepository = DI.orm.em.getRepository(User);
        DI.tagRepository = DI.orm.em.getRepository(Tag);

        if (isDevEnv) {
            await devInit(DI.orm);
          } else {
            await migrate(DI.orm);
        }

        app.use(express.json())
        app.use((req, res, next) => RequestContext.create(DI.orm.em, next));
        app.use("/auth", AuthController);
        app.use((req, res) => res.status(404).json({ message: 'Where are you trying to go?' }));
        app.listen(+PORT, () => {
            console.log(`App has started, listening on port ${PORT}`);
        });
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();