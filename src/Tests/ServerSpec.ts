import bcrypt from "bcrypt";
import User from "../Models/User";
import Product from "../Models/Product";
import Order from "../Models/Order";
import { ProductType } from "../Types/types";

const userModel: User = new User();
const productModel: Product = new Product();
const orderModel: Order = new Order();

describe("Models Tests", () => {
  it("User model should have a create method", async () => {
    expect(userModel.create).toBeDefined();
  });

  it("User model can create a user.", async () => {
    try {
      const user = await userModel.create({
        name: "Pola Adel Eskandar",
        email: "polaeskandar123@gmail.com",
        password: "123456789",
      });

      expect(user?.name).toBe("Pola Adel Eskandar");
      expect(user?.email).toBe("polaeskandar123@gmail.com");

      const comparePassword = await bcrypt.compare(
        "123456789",
        user?.password!
      );

      expect(comparePassword).toBeTrue();
    } catch (error) {
      console.error(error);
    }
  });

  it("User model should have an all method.", async () => {
    expect(userModel.all).toBeDefined();
  });

  it("User model can get all users.", async () => {
    try {
      const users = await userModel.all();

      expect(users![0]?.name).toBe("Pola Adel Eskandar");
      expect(users![0]?.email).toBe("polaeskandar123@gmail.com");

      const comparePassword = await bcrypt.compare(
        "123456789",
        users![0]?.password!
      );

      expect(comparePassword).toBeTrue();
    } catch (error) {
      console.error(error);
    }
  });

  it("User model should have a find method.", async () => {
    expect(userModel.find).toBeDefined();
  });

  it("User model can find a user.", async () => {
    try {
      const user = await userModel.find("1");

      expect(user?.name).toBe("Pola Adel Eskandar");
      expect(user?.email).toBe("polaeskandar123@gmail.com");
      expect(user?.password?.startsWith("$")).toBeTrue();
    } catch (error) {
      console.error(error);
    }
  });

  it("User model should have a findWithEmail method.", async () => {
    expect(userModel.findWithEmail).toBeDefined();
  });

  it("User model can find a user with email.", async () => {
    try {
      const user = await userModel.findWithEmail("polaeskandar123@gmail.com");

      expect(user?.name).toBe("Pola Adel Eskandar");
      expect(user?.email).toBe("polaeskandar123@gmail.com");

      const comparePassword = await bcrypt.compare(
        "123456789",
        user?.password!
      );

      expect(comparePassword).toBeTrue();
    } catch (error) {
      console.error(error);
    }
  });

  it("User model should have an update method.", async () => {
    expect(userModel.update).toBeDefined();
  });

  it("User model can update a user.", async () => {
    try {
      const user = await userModel.update({
        id: "1",
        name: "Pola Updated",
        email: "polaeskandar123.updated@gmail.com",
        password: "updatedpassword",
      });

      expect(user?.name).toBe("Pola Updated");
      expect(user?.email).toBe("polaeskandar123.updated@gmail.com");

      const comparePassword = await bcrypt.compare(
        "updatedpassword",
        user?.password!
      );

      expect(comparePassword).toBeTrue();
    } catch (error) {
      console.error(error);
    }
  });

  it("User model should have a delete method.", async () => {
    expect(userModel.delete).toBeDefined();
  });

  it("User model can delete a user.", async () => {
    try {
      await userModel.delete("1");
      const user = await userModel.find("1");
      expect(user).toBeUndefined();
    } catch (error) {
      console.error(error);
    }
  });
});

describe("Product Tests", () => {
  it("Product model should have a create method.", () => {
    expect(productModel.create).toBeDefined();
  });

  it("Product model can create a product.", async () => {
    try {
      const product = await productModel.create({
        name: "Testing product",
        price: 100,
        description: "Some testing description",
      });

      expect(product?.name).toBe("Testing product");
      expect(product?.description).toBe("Some testing description");
    } catch (error) {
      console.error(error);
    }
  });

  it("Product model should have an all method.", () => {
    expect(productModel.all).toBeDefined();
  });

  it("Product model can get all products.", async () => {
    try {
      const products = await productModel.all();

      expect(products![0]).toEqual({
        id: 6,
        name: "Testing product",
        price: 100,
        description: "Some testing description",
      });
    } catch (error) {
      console.error(error);
    }
  });

  it("Product model should have a find method.", () => {
    expect(productModel.find).toBeDefined();
  });

  it("Product model can find a product with id.", async () => {
    try {
      const product = await productModel.find(6);

      expect(product).toEqual({
        id: 6,
        name: "Testing product",
        price: 100,
        description: "Some testing description",
      });
    } catch (error) {
      console.error(error);
    }
  });

  it("Product model should have an update method.", () => {
    expect(productModel.update).toBeDefined();
  });

  it("Product model can update a product.", async () => {
    try {
      const product = await productModel.update({
        id: 6,
        name: "Updated Product",
        price: 200,
        description: "Updated product description.",
      });

      expect(product).toEqual({
        id: 6,
        name: "Updated Product",
        price: 200,
        description: "Updated product description.",
      });
    } catch (error) {
      console.error(error);
    }
  });

  it("Product model should have a delete method.", () => {
    expect(productModel.delete).toBeDefined();
  });

  it("Product model can delete a product.", async () => {
    try {
      await productModel.delete(6);
      const product = await productModel.find(6);
      expect(product).toBeUndefined();
    } catch (error) {
      console.error(error);
    }
  });

  describe("Order Tests", () => {
    it("Order model should have a create method.", () => {
      expect(orderModel.create).toBeDefined();
    });

    it("Order model can create an order.", async () => {
      try {
        const user = await userModel.create({
          name: "Pola Adel Eskandar",
          email: "polaeskandar123@gmail.com",
          password: "123456789",
        });

        const products: ProductType[] | undefined = [];
        const product = await productModel.find(1);
        product!.order_quantity = 1;
        products.push(product!);
        const order = await orderModel.create({ user, products });

        expect(order).toEqual({
          id: 1,
          price: 4000,
          user: {
            id: 2,
            name: "Pola Adel Eskandar",
            email: "polaeskandar123@gmail.com",
          },
          products: [
            {
              id: 1,
              name: "Macbook Pro",
              description: "A laptop",
              price: 4000,
              order_quantity: 1,
              total_price: 4000,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("Order model should have an all method.", () => {
      expect(orderModel.all).toBeDefined();
    });

    it("Order model can get all orders.", async () => {
      try {
        const order = await orderModel.all();

        expect(order![0]).toEqual({
          id: 1,
          price: 4000,
          user: {
            id: 2,
            name: "Pola Adel Eskandar",
            email: "polaeskandar123@gmail.com",
          },
          products: [
            {
              id: 1,
              name: "Macbook Pro",
              description: "A laptop",
              price: 4000,
              order_quantity: 1,
              total_price: 4000,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("Order model should have a find method.", () => {
      expect(orderModel.find).toBeDefined();
    });

    it("Order model can find an order with id.", async () => {
      try {
        const order = await orderModel.find(1);

        expect(order).toEqual({
          id: 1,
          price: 4000,
          user: {
            id: 2,
            name: "Pola Adel Eskandar",
            email: "polaeskandar123@gmail.com",
          },
          products: [
            {
              id: 1,
              name: "Macbook Pro",
              description: "A laptop",
              price: 4000,
              order_quantity: 1,
              total_price: 4000,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("Order model should have a getProductsForOrder method.", () => {
      expect(orderModel.getProductsForOrder).toBeDefined();
    });

    it("Order model can get products for order.", async () => {
      try {
        const products = await orderModel.getProductsForOrder(1);

        expect(products).toEqual([
          {
            id: 1,
            name: "Macbook Pro",
            description: "A laptop",
            price: 4000,
            order_quantity: 1,
            total_price: 4000,
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    });

    it("Order model should have a calculateTotalPriceOfOrder method.", () => {
      expect(orderModel.calculateTotalPriceOfOrder).toBeDefined();
    });

    it("Order model can calculate the total price of order.", async () => {
      try {
        const price = orderModel.calculateTotalPriceOfOrder([
          {
            id: 1,
            name: "Macbook Pro",
            description: "A laptop",
            price: 4000,
            order_quantity: 1,
            total_price: 4000,
          },
        ]);

        expect(price).toEqual(4000);
      } catch (error) {
        console.error(error);
      }
    });

    it("Order model should have an update method.", () => {
      expect(orderModel.update).toBeDefined();
    });

    it("Order model can update an order.", async () => {
      try {
        const updatedUser = await userModel.create({
          name: "Pola Adel Eskandar Updated",
          email: "polaeskandar123.updated@gmail.com",
          password: "123456789",
        });

        const products: ProductType[] | undefined = [];
        const product = await productModel.find(1);
        product!.order_quantity = 2;
        products.push(product!);
        const order = await orderModel.update({
          id: 1,
          user: updatedUser,
          products,
        });

        expect(order).toEqual({
          id: 1,
          price: 8000,
          user: {
            id: 3,
            name: "Pola Adel Eskandar Updated",
            email: "polaeskandar123.updated@gmail.com",
          },
          products: [
            {
              id: 1,
              name: "Macbook Pro",
              description: "A laptop",
              price: 4000,
              order_quantity: 2,
              total_price: 8000,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("Order model should have a delete method.", () => {
      expect(orderModel.delete).toBeDefined();
    });

    it("Order model can delete an order.", async () => {
      try {
        await orderModel.delete("1");
        const order = await orderModel.find(1);
        expect(order).toBeUndefined();
      } catch (error) {
        console.error(error);
      }
    });
  });
});
