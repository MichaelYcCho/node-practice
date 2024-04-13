import { Knex } from "knex";

export class UserRepository {
  constructor(private knex: Knex) {}


  async getUser(userId?: number) {
      try {
        console.log(`getUser userId ${String(userId)} `);
        const result = await this.knex('users')
          .select('*')
          .where((builder) => {
            if (userId) {
              console.log('get user by user id');
              builder.where('users.id', userId);
            } 
          })
        console.log(`getUser result ${JSON.stringify(result)}`);
        return result;
      } catch (error) {
        console.error(error);
        return false;
      }
    }
}