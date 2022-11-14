import client from "../connection";
import { ProductType } from "../Types/types";

class Product {
  /**
   *
   * Gets all rows in the table.
   *
   * @returns A promise of an array of ProductType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async all(): Promise<ProductType[] | undefined> {
    try {
      const conn = await client.connect();
      const result = await conn.query("SELECT id, name, description FROM products ORDER BY id DESC;");
      conn.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Finds a specific product row in the table with the id.
   *
   * @param id
   * @returns A promise of ProductType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async find(id: string): Promise<ProductType | undefined> {
    try {
      const conn = await client.connect();
      const result = await (await client.query("SELECT name, description FROM products WHERE id = $1;", [id])).rows[0];
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Create a new product row in the table.
   *
   * @param user
   * @returns A promise of ProductType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async create(product: ProductType): Promise<ProductType | undefined> {
    const name: string | undefined = product.name;
    const description: string | undefined = product.description;

    try {
      const conn = await client.connect();
      const result = await (await client.query("INSERT INTO products (name, description) VALUES ($1, $2, $3) RETURNING *;", [name, description])).rows[0];
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Update an existing product row in the table.
   *
   * @param product
   * @returns A promise of ProductType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async update(product: ProductType): Promise<ProductType | undefined> {
    try {
      const conn = await client.connect();
      const productCheck = await (await client.query("SELECT * FROM products WHERE id = $1;", [product.id])).rowCount;
      if (!productCheck) throw new Error("Product not found");

      const result = await (await client.query("UPDATE products SET name = $1, description = $2 WHERE id = $3 RETURNING *;", [product.name, product.description, product.id])).rows[0];

      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Delete an existing product row in the table.
   *
   * @param id
   * @returns A promise of UserType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async delete(id: string): Promise<void> {
    try {
      const conn = await client.connect();
      const productCheck = await (await client.query("SELECT * FROM products WHERE id = $1;", [id])).rows[0];
      if (!productCheck) throw new Error("Product not found");
      await client.query("DELETE FROM products WHERE id = $1;", [id]);
      conn.release();
    } catch (error) {
      throw error;
    }
  }
}

export default Product;
