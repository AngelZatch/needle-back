import { Connection, IDatabaseDriver, MikroORM } from '@mikro-orm/core';
import express from 'express';

export default class Application {
    // Create a new app object from express
    public app!: express.Application;

    public orm!: MikroORM<IDatabaseDriver<Connection>>;

    public connect = async(
        ormConfig: Parameters<typeof MikroORM.init>[0]
    ): Promise<void> => {
        this.orm = await MikroORM.init(ormConfig);
    }

    public init = (port: number): void => {
        this.app = express()
        // this.app.use(cors())
        this.app.use(express.json())

        this.app.use("/", (req, res) => res.send('HELLO'));

        this.app.listen(port, '0.0.0.0');
    }
}