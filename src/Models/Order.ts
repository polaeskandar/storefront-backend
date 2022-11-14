import client from "../connection";
import { OrderType, ProductType } from "../Types/types";

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
      const result: OrderType[] = [];
      const orders = await conn.query(
        `
          SELECT
            orders.id as order_id,
            users.id as user_id,
            users.name as user_name,
            users.email as user_email
          FROM
            orders
          INNER JOIN users ON users.id = orders.user_id;
        `
      );

      for (let i = 0; i < orders.rowCount; i++) {
        const products: ProductType[] | undefined = await this.getProductsForOrder(orders.rows[i].order_id);

        const order: OrderType = {
          id: orders.rows[i].order_id,
          price: this.calculateTotalPriceOfOrder(products!),
          user: { id: orders.rows[i].user_id, name: orders.rows[i].user_name, email: orders.rows[i].user_email },
          products,
        };

        result.push(order);
      }

      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Gets all products for a specific order.
   *
   * @param orderId
   * @returns A promise of an array of OrderType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async getProductsForOrder(orderId: string): Promise<ProductType[] | undefined> {
    const products: ProductType[] = [];

    try {
      const conn = await client.connect();
      const orderProducts = await conn.query(
        `
        SELECT
          order_product.quantity as quantity,
          products.id as product_id,
          products.name as product_name,
          products.price as product_price,
          products.description as product_description
        FROM
          order_product
        INNER JOIN products ON products.id = order_product.product_id
        WHERE
          order_product.order_id = $1
      `,
        [orderId]
      );

      for (let j = 0; j < orderProducts.rowCount; j++) {
        products.push({
          id: orderProducts.rows[j].product_id,
          name: orderProducts.rows[j].product_name,
          description: orderProducts.rows[j].product_description,
          price_per_unit: orderProducts.rows[j].product_price,
          order_quantity: orderProducts.rows[j].quantity,
          total_price: orderProducts.rows[j].product_price * orderProducts.rows[j].quantity,
        });
      }

      conn.release();
      return products;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Calculate the total price of the order.
   *
   * @param products
   * @returns A promise of an array of OrderType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  calculateTotalPriceOfOrder(products: ProductType[]): number {
    let price = 0;
    for (const product of products) price += product.total_price!;
    return price;
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
      const orderQuery = await conn.query(
        `
          SELECT
            orders.id as order_id,
            users.id as user_id,
            users.name as user_name,
            users.email as user_email
          FROM
            orders
          INNER JOIN users ON users.id = orders.user_id
          WHERE orders.id = $1;
        `,
        [id]
      );

      const products: ProductType[] | undefined = await this.getProductsForOrder(orderQuery.rows[0].order_id);

      const order: OrderType = {
        id: orderQuery.rows[0].order_id,
        price: this.calculateTotalPriceOfOrder(products!),
        user: { id: orderQuery.rows[0].user_id, name: orderQuery.rows[0].user_name, email: orderQuery.rows[0].user_email },
        products,
      };

      conn.release();
      return order;
    } catch (error) {
      throw error;
    }
  }

  // /**
  //  *
  //  * Create a new order row in the table.
  //  *
  //  * @param order
  //  * @returns A promise of ProductType or undefined.
  //  * @author Pola Eskandar.
  //  * @version v1.0.0
  //  * @since v1.0.0
  //  */
  // async create(order: SimplifiedOrderType): Promise<OrderType | undefined> {
  //   const quantity: string | undefined = order.quantity;
  //   const user_id: string | undefined = order.user_id;
  //   const product_id: string | undefined = order.product_id;

  //   try {
  //     const conn = await client.connect();
  //     const insertQuery = await (
  //       await client.query(
  //         `
  //           INSERT INTO
  //             orders (quantity, user_id, product_id)
  //           VALUES
  //             ($1, $2, $3)
  //           RETURNING *;
  //         `,
  //         [quantity, user_id, product_id]
  //       )
  //     ).rows[0];

  //     const result: OrderType | undefined = await this.find(insertQuery.id);
  //     conn.release();
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // /**
  //  *
  //  * Update an existing order row in the table.
  //  *
  //  * @param order
  //  * @returns A promise of ProductType or undefined.
  //  * @author Pola Eskandar.
  //  * @version v1.0.0
  //  * @since v1.0.0
  //  */
  // async update(order: SimplifiedOrderType): Promise<OrderType | undefined> {
  //   try {
  //     const conn = await client.connect();
  //     const orderCheck = await (await client.query("SELECT * FROM orders WHERE id = $1;", [order.id])).rowCount;
  //     if (!orderCheck) throw new Error("Order not found");

  //     const updateQuery = await (
  //       await client.query(
  //         `
  //           UPDATE
  //             orders
  //           SET
  //             quantity = $1,
  //             user_id = $2,
  //             product_id = $3
  //           WHERE id = $4
  //           RETURNING *;
  //         `,
  //         [order.quantity, order.user_id, order.product_id, order.id]
  //       )
  //     ).rows[0];

  //     const result: OrderType | undefined = await this.find(updateQuery.id);
  //     conn.release();
  //     return result;
  //   } catch (error) {
  //     throw error;
  //   }
  // }

  // /**
  //  *
  //  * Delete an existing order row in the table.
  //  *
  //  * @param id
  //  * @returns A promise of UserType or undefined.
  //  * @author Pola Eskandar.
  //  * @version v1.0.0
  //  * @since v1.0.0
  //  */
  // async delete(id: string): Promise<void> {
  //   try {
  //     const conn = await client.connect();
  //     const orderCheck = await await (await client.query("SELECT * FROM orders WHERE id = $1;", [id])).rows[0];
  //     if (!orderCheck) throw new Error("Order not found");
  //     await client.query("DELETE FROM orders WHERE id = $1;", [id]);
  //     conn.release();
  //   } catch (error) {
  //     throw error;
  //   }
  // }
}

export default Order;
