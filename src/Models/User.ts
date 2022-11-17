import bcrypt from "bcrypt";
import client from "../connection";
import { SALT_ROUNDS } from "../constants";
import { UserType } from "../Types/types";

class User {
  /**
   *
   * Gets all rows in the table.
   *
   * @returns A promise of an array of UserType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async all(): Promise<UserType[] | undefined> {
    try {
      const conn = await client.connect();
      const sql: string = "SELECT * FROM users ORDER BY id DESC;";
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Finds a specific user row in the table with the id.
   *
   * @param id
   * @returns A promise of UserType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async find(id: string | number): Promise<UserType | undefined> {
    try {
      const conn = await client.connect();
      const result = await (
        await client.query("SELECT * FROM users WHERE id = $1;", [id])
      ).rows[0];
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Finds a specific user row in the table with email.
   *
   * @param email
   * @returns A promise of UserType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async findWithEmail(
    email: string | undefined
  ): Promise<UserType | undefined> {
    try {
      const conn = await client.connect();
      const result = await (
        await client.query("SELECT * FROM users WHERE email = $1;", [email])
      ).rows[0];
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Create a new user row in the table.
   *
   * @param user
   * @returns A promise of UserType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async create(user: UserType): Promise<UserType | undefined> {
    const name: string | undefined = user.name;
    const email: string | undefined = user.email;
    const password: string | Buffer = user.password!;

    const checkUser = await this.findWithEmail(email);
    if (checkUser) throw new Error("User already exists");

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const conn = await client.connect();

      const result = await (
        await client.query(
          "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *;",
          [name, email, hashedPassword]
        )
      ).rows[0];
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Update an existing user row in the table.
   *
   * @param user
   * @returns A promise of UserType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async update(user: UserType): Promise<UserType | undefined> {
    try {
      const conn = await client.connect();
      const userCheck = await this.find(user.id!);
      if (!userCheck) throw new Error("User not found");
      const password: string | Buffer = user.password!;
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      const result = await (
        await client.query(
          "UPDATE users SET name = $1, email = $2, password = $3 WHERE id = $4 RETURNING *;",
          [user.name, user.email, hashedPassword, user.id]
        )
      ).rows[0];
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Delete an existing user row in the table.
   *
   * @param id
   * @returns A promise of UserType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async delete(id: string | number): Promise<void> {
    try {
      const conn = await client.connect();
      const userCheck = await this.find(id);
      if (!userCheck) throw new Error("User not found");
      await client.query("DELETE FROM users WHERE id = $1;", [id]);
      conn.release();
    } catch (error) {
      throw error;
    }
  }
}

export default User;
