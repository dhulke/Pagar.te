require("dotenv").config();

module.exports = {
    unittest: {
        client: "postgresql",
        connection: {
            port: "5432",
            host: "localhost",
            database: "postgres",
            user: "postgres",
            password: "docker",
        },
        migrations: {
            directory: './migration',
        }
    },
    development: {
        client: "postgresql",
        connection: {
            port: "5432",
            host: "localhost",
            database: "postgres",
            user: "postgres",
            password: "docker",
        },
        migrations: {
            directory: './migration',
        }
    }

};
