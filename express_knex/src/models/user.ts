import { Knex } from "knex";

interface User {
  id: number;
  username: string;
  email: string;
  created_at: Date;
  updated_at: Date;
}

const createTable = (knex: Knex) =>
  knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("username").notNullable();
    table.string("email").notNullable().unique();
    table.timestamps(true, true);
  });

export { User, createTable };


