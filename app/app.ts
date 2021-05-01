import { Connection, EntityManager, EntityRepository, IDatabaseDriver, MikroORM, RequestContext } from '@mikro-orm/core';
import express from 'express';
import { AuthController } from './controllers';
import { Tag } from './models/tag.model';
import { User } from './models/user.model';

export default class Application {
    // Create a new app object from express
    public app!: express.Application;

    public DI = {} as {
        orm: MikroORM,
        em: EntityManager,
        userRepository: EntityRepository<User>,
        tagRepository: EntityRepository<Tag>,
    };

    public connect = async(
        ormConfig: Parameters<typeof MikroORM.init>[0]
    ): Promise<void> => {
        this.DI.orm = await MikroORM.init(ormConfig);
        this.DI.em = this.DI.orm.em;
        this.DI.userRepository = this.DI.orm.em.getRepository(User);
        this.DI.tagRepository = this.DI.orm.em.getRepository(Tag);
    }

    public init = (port: number): void => {
        this.app = express()
        // this.app.use(cors())
        this.app.use(express.json())

        this.app.use((req, res, next) => RequestContext.create(this.DI.orm.em, next));

        this.app.use("/auth", AuthController);

        this.app.listen(port, '0.0.0.0');
    }
}