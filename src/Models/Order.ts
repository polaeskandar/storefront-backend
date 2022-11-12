import client from "../connection";
import { OrderType, SimplifiedOrderType } from "../Types/types";

class Order {
  /**
   *
   * Gets all rows in the table.
   *
   * @returns A promise of an array of OrderType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async all(): Promise<OrderType[] | undefined> {
    try {
      const conn = await client.connect();
      const result = await (
        await conn.query(
          `
            SELECT
              orders.id as order_id,
              orders.quantity as order_quantity,
              users.id as user_id,
              users.name as user_name,
              users.email as user_email,
              products.id as product_id,
              products.name as product_name,
              products.description as product_description,
              products.available_quantity as product_available_quantity
            FROM
              orders
            INNER JOIN users ON users.id = orders.user_id
            INNER JOIN products ON products.id = orders.product_id;
          `
        )
      ).rows;
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Finds a specific order row in the table with the id.
   *
   * @param id
   * @returns A promise of OrderType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async find(id: string): Promise<OrderType | undefined> {
    try {
      const conn = await client.connect();
      const result = await (
        await client.query(
          `
            SELECT
              orders.id as order_id,
              orders.quantity as order_quantity,
              users.id as user_id,
              users.name as user_name,
              users.email as user_email,
              products.id as product_id,
              products.name as product_name,
              products.description as product_description,
              products.available_quantity as product_available_quantity
            FROM
              orders
            INNER JOIN users ON users.id = orders.user_id
            INNER JOIN products ON products.id = orders.product_id
            WHERE orders.id = $1;
          `,
          [id]
        )
      ).rows[0];

      conn.release();
      return {
        id: result.order_id,
        quantity: result.order_quantity,
        user: {
          id: result.user_id,
          name: result.user_name,
          email: result.user_email,
        },
        product: {
          id: result.product_id,
          name: result.product_name,
          description: result.product_description,
          available_quantity: result.available_quantity,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Create a new order row in the table.
   *
   * @param order
   * @returns A promise of ProductType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async create(order: SimplifiedOrderType): Promise<OrderType | undefined> {
    const quantity: string | undefined = order.quantity;
    const user_id: string | undefined = order.user_id;
    const product_id: string | undefined = order.product_id;

    try {
      const conn = await client.connect();
      const insertQuery = await (
        await client.query(
          `
            INSERT INTO 
              orders (quantity, user_id, product_id)
            VALUES 
              ($1, $2, $3) 
            RETURNING *;
          `,
          [quantity, user_id, product_id]
        )
      ).rows[0];

      const result: OrderType | undefined = await this.find(insertQuery.id);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Update an existing order row in the table.
   *
   * @param order
   * @returns A promise of ProductType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async update(order: SimplifiedOrderType): Promise<OrderType | undefined> {
    try {
      const conn = await client.connect();
      const orderCheck = await (await client.query("SELECT * FROM orders WHERE id = $1;", [order.id])).rowCount;
      if (!orderCheck) throw new Error("Order not found");

      const updateQuery = await (
        await client.query(
          `
            UPDATE 
              orders 
            SET 
              quantity = $1,
              user_id = $2,
              product_id = $3
            WHERE id = $4
            RETURNING *;
          `,
          [order.quantity, order.user_id, order.product_id, order.id]
        )
      ).rows[0];

      const result: OrderType | undefined = await this.find(updateQuery.id);
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Delete an existing order row in the table.
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
      const orderCheck = await await (await client.query("SELECT * FROM orders WHERE id = $1;", [id])).rows[0];
      if (!orderCheck) throw new Error("Order not found");
      await client.query("DELETE FROM orders WHERE id = $1;", [id]);
      conn.release();
    } catch (error) {
      throw error;
    }
  }
}

export default Order;
