import client from "../connection";
import { OrderType, ProductType, UserType } from "../Types/types";

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
        const products: ProductType[] | undefined =
          await this.getProductsForOrder(orders.rows[i].order_id);

        const order: OrderType = {
          id: orders.rows[i].order_id,
          price: this.calculateTotalPriceOfOrder(products!),
          user: {
            id: orders.rows[i].user_id,
            name: orders.rows[i].user_name,
            email: orders.rows[i].user_email,
          },
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
  async getProductsForOrder(
    orderId: string | number
  ): Promise<ProductType[] | undefined> {
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
            order_product.order_id = $1;
        `,
        [orderId]
      );

      for (let j = 0; j < orderProducts.rowCount; j++) {
        products.push({
          id: orderProducts.rows[j].product_id,
          name: orderProducts.rows[j].product_name,
          description: orderProducts.rows[j].product_description,
          price: orderProducts.rows[j].product_price,
          order_quantity: orderProducts.rows[j].quantity,
          total_price:
            orderProducts.rows[j].product_price *
            orderProducts.rows[j].quantity,
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
  async find(id: string | number): Promise<OrderType | undefined> {
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

      if (!orderQuery.rowCount) return;

      const products: ProductType[] | undefined =
        await this.getProductsForOrder(orderQuery.rows[0].order_id);

      const order: OrderType = {
        id: orderQuery.rows[0].order_id,
        price: this.calculateTotalPriceOfOrder(products!),
        user: {
          id: orderQuery.rows[0].user_id,
          name: orderQuery.rows[0].user_name,
          email: orderQuery.rows[0].user_email,
        },
        products,
      };

      conn.release();
      return order;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Create a new order in the database.
   *
   * @param order
   * @returns A promise of ProductType or undefined.
   * @author Pola Eskandar.
   * @version v1.0.0
   * @since v1.0.0
   */
  async create(order: OrderType): Promise<OrderType | undefined> {
    const user: UserType | undefined = order.user;
    const products: ProductType[] | undefined = order.products;

    try {
      const conn = await client.connect();
      const orderQuery = await conn.query(
        `
          INSERT INTO
            orders (user_id)
          VALUES
            ($1)
          RETURNING *;
        `,
        [user!.id]
      );

      for (const product of order.products!) {
        await conn.query(
          `
            INSERT INTO 
              order_product (quantity, product_id, order_id)
            VALUES
              ($1, $2, $3);
          `,
          [product.order_quantity, product.id, orderQuery.rows[0].id]
        );
      }

      conn.release();
      const result: OrderType | undefined = await this.find(
        orderQuery.rows[0].id
      );
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
  async update(order: OrderType): Promise<OrderType | undefined> {
    try {
      const conn = await client.connect();
      const orderCheck = await this.find(order.id!);
      if (!orderCheck) throw new Error("Order not found");

      const updateOrderQuery = await conn.query(
        `
          UPDATE
            orders
          SET
            user_id = $1
          WHERE id = $2
          RETURNING *;
        `,
        [order.user?.id, order.id]
      );

      await conn.query(`DELETE FROM order_product WHERE order_id = $1`, [
        order.id,
      ]);

      for (const product of order.products!) {
        await conn.query(
          `
            INSERT INTO 
              order_product (quantity, product_id, order_id)
            VALUES
              ($1, $2, $3);
          `,
          [product.order_quantity, product.id, order.id]
        );
      }

      const result: OrderType | undefined = await this.find(
        updateOrderQuery.rows[0].id
      );
      conn.release();
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   *
   * Delete an existing order in the database.
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
      const orderCheck = await conn.query(
        "SELECT * FROM orders WHERE id = $1;",
        [id]
      );
      if (!orderCheck) throw new Error("Order not found");
      await conn.query(`DELETE FROM order_product WHERE order_id = $1;`, [id]);
      await conn.query("DELETE FROM orders WHERE id = $1;", [id]);
      conn.release();
    } catch (error) {
      throw error;
    }
  }
}

export default Order;
