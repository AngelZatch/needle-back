import Application from './app';
import ormConfig from './orm.config';
import { devInit, migrate } from './utils/dbGenerator';

const PORT = process.env.PORT || 8000;
const isDevEnv = process.env.NODE_ENV !== 'production';

(async () => {
    try {
        const application = new Application();
        await application.connect(ormConfig);

        if (isDevEnv) {
            await devInit(application.orm);
          } else {
            await migrate(application.orm);
        }
        
        application.init(+PORT);
        console.log(`App has started, listening on port ${PORT}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();