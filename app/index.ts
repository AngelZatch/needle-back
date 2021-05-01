import Application from './app';

const PORT = process.env.PORT || 8000;

(async () => {
    try {
        const application = new Application();
        application.init(+PORT);
        console.log(`App has started, listening on port ${PORT}`);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
})();