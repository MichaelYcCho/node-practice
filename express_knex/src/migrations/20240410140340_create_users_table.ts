import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
    const result = await knex.schema.createTable('users', (table) => {
      table.bigIncrements('id');
      table.string('discord_user_id', 20).notNullable().unique();
      table.string('email', 50).nullable();
      table.timestamp('created_at').defaultTo(knex.fn.now());
      table.timestamp('updated_at').defaultTo(knex.fn.now());
    });
    console.log(result);
  }
  
  export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('users');
  }