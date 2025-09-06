import { eq } from "drizzle-orm";
import { db } from "../config/db";
import { users } from "../db/schema/users";
type User = typeof users.$inferInsert;

const authService = {
  async checkUserAlreadyExists(email: string): Promise<boolean> {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });
    return !!existingUser;
  },

  async createUser(userInfo: User) {
    const newUser = await db.insert(users).values(userInfo).returning({
      id: users.id,
      username: users.username,
      email: users.email,
    });
    return newUser[0];
  },
  
  async getUser(email: string) {
    return await db.query.users.findFirst({
      where: eq(users.email, email),
    });
  },
};

export default authService;
