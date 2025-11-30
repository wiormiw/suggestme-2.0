export abstract class AuthUtil {
  static async hashPassword(password: string): Promise<string> {
    return await Bun.password.hash(password, { algorithm: 'bcrypt', cost: 10 });
  }

  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    return await Bun.password.verify(password, hash);
  }
}
