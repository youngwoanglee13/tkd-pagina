const fs = require('fs');

const dir = "src/environments";
const prodFile = "environment.prod.ts";

const prodEnvConfig = `${process.env.PROD_ENV_CONFIG}`;

fs.access(dir, fs.constants.F_OK, (err) => {
    if(err) {
        console.log("Directory does not exist. Creating now.", process.cwd());
        fs.mkdir(dir, {recursive: true}, (err) => {
            if(err) {
                throw err;
            }
        });
    }
    try {
        fs.writeFileSync(dir + "/" + prodFile, prodEnvConfig);
        if (fs.existsSync(dir + "/" + prodFile)) {
            console.log("Environment files are created successfully.");
        }
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
});
