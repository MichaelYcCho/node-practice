// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */


require('dotenv').config({path: './.env'});

console.log('하', process.env.DB_CLIENT);



module.exports = {




    client: process.env.DB_CLIENT,
    connection: {
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      user:     process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      port:process.env.DB_PORT,
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './src/migrations',
      tableName: 'knex_migrations'
    }
  }


  // staging: {
  //   client: 'postgresql',
  //   connection: {
  //     database: process.env.DB_NAME,
  //     user:     process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // },

  // production: {
  //   client: 'postgresql',
  //   connection: {
  //     database: process.env.DB_NAME,
  //     user:     process.env.DB_USER,
  //     password: process.env.DB_PASSWORD,
  //   },
  //   pool: {
  //     min: 2,
  //     max: 10
  //   },
  //   migrations: {
  //     tableName: 'knex_migrations'
  //   }
  // }


