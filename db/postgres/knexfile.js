require("dotenv").config();

module.exports = {
    unittest: {
        client: "postgresql",
        connection: {
            port: "5432",
            host: "192.168.99.100",
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
            host: "192.168.99.100",
            database: "postgres",
            user: "postgres",
            password: "docker",
        },
        migrations: {
            directory: './migration',
        }
    }

};
