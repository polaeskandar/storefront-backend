import supertest from "supertest";
import bcrypt from "bcrypt";
import serverApp from "../server";
import User from "../Models/User";
import Product from "../Models/Product";
import Order from "../Models/Order";
import { ProductType } from "../Types/types";

const userModel: User = new User();
const productModel: Product = new Product();
const orderModel: Order = new Order();
const server = supertest(serverApp);

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

  describe("Endpoints Tests", () => {
    it("can test: POST /user/signup", async () => {
      try {
        const response = await server.post("/user/signup").send({
          name: "Supertest Testing",
          email: "testing@supertest.com",
          password: "testing123",
        });

        expect(response.status).toBe(201);
        expect(response.body.user.name).toBe("Supertest Testing");
        expect(response.body.user.email).toBe("testing@supertest.com");

        const comparePassword = await bcrypt.compare(
          "testing123",
          response.body.user.password
        );

        expect(comparePassword).toBeTrue();
        expect(response.body.token).toBeDefined();
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: POST /user/signin", async () => {
      try {
        const response = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        expect(response.status).toBe(200);
        expect(response.body.user.email).toBe("testing@supertest.com");
        expect(response.body.token).toBeDefined();
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: GET /users", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .get("/users")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toEqual(3);
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: GET /user/:id", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .get("/user/4")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body.id).toBe(4);
        expect(response.body.name).toBe("Supertest Testing");
        expect(response.body.email).toBe("testing@supertest.com");
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: POST /user/create", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .post("/user/create")
          .set("Authorization", `Bearer ${user.body.token}`)
          .send({
            name: "Supertest Testing 2",
            email: "testing2@supertest.com",
            password: "testing123",
          });

        expect(response.status).toBe(201);
        expect(response.body.id).toBe(5);
        expect(response.body.name).toBe("Supertest Testing 2");
        expect(response.body.email).toBe("testing2@supertest.com");
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: PUT /user/:id/update", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .put("/user/5/update")
          .set("Authorization", `Bearer ${user.body.token}`)
          .send({
            name: "Updated Supertest Testing 2",
            email: "updatedtesting2@supertest.com",
            password: "testing123",
          });

        expect(response.status).toBe(201);
        expect(response.body.id).toBe(5);
        expect(response.body.name).toBe("Updated Supertest Testing 2");
        expect(response.body.email).toBe("updatedtesting2@supertest.com");
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: DELETE /user/:id/delete", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .delete("/user/5/delete")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(response.status).toBe(200);

        const checkUser = await server
          .get("/user/5")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(checkUser.body.id).toBeUndefined();
        expect(checkUser.body.name).toBeUndefined();
        expect(checkUser.body.email).toBeUndefined();
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: GET /products", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .get("/products")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(5);
        expect(response.body).toEqual([
          {
            id: 5,
            name: "iPhone 14 plus",
            price: 2000,
            description: "An iPhone",
          },
          { id: 4, name: "Gaming PC", price: 5000, description: "A gaming PC" },
          { id: 3, name: "Pencil", price: 2, description: "A pencil" },
          { id: 2, name: "Notebook", price: 20, description: "A notebook" },
          { id: 1, name: "Macbook Pro", price: 4000, description: "A laptop" },
        ]);
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: GET /product/:id", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .get("/product/5")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          id: 5,
          name: "iPhone 14 plus",
          price: 2000,
          description: "An iPhone",
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: POST /product/create", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .post("/product/create")
          .set("Authorization", `Bearer ${user.body.token}`)
          .send({
            name: "Testing product",
            price: 1000,
            description: "A testing product.",
          });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          id: 7,
          name: "Testing product",
          price: 1000,
          description: "A testing product.",
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: PUT /product/:id/update", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .put("/product/7/update")
          .set("Authorization", `Bearer ${user.body.token}`)
          .send({
            name: "Updated testing product",
            price: 2000,
            description: "An updated testing product.",
          });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          id: 7,
          name: "Updated testing product",
          price: 2000,
          description: "An updated testing product.",
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: DELETE /product/:id/delete", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .delete("/product/7/delete")
          .set("Authorization", `Bearer ${user.body.token}`);
        expect(response.status).toBe(200);

        const checkProduct = await server
          .get("/product/7")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(checkProduct.body.id).toBeUndefined();
        expect(checkProduct.body.name).toBeUndefined();
        expect(checkProduct.body.price).toBeUndefined();
        expect(checkProduct.body.description).toBeUndefined();
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: POST /order/create", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .post("/order/create")
          .set("Authorization", `Bearer ${user.body.token}`)
          .send({
            user_id: 3,
            products_ids: [1, 2],
            products_quantities: [5, 10],
          });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          id: 2,
          price: 20200,
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
              order_quantity: 5,
              total_price: 20000,
            },
            {
              id: 2,
              name: "Notebook",
              description: "A notebook",
              price: 20,
              order_quantity: 10,
              total_price: 200,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: GET /orders", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .get("/orders")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual([
          {
            id: 2,
            price: 20200,
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
                order_quantity: 5,
                total_price: 20000,
              },
              {
                id: 2,
                name: "Notebook",
                description: "A notebook",
                price: 20,
                order_quantity: 10,
                total_price: 200,
              },
            ],
          },
        ]);
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: GET /order/:id", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .get("/order/2")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          id: 2,
          price: 20200,
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
              order_quantity: 5,
              total_price: 20000,
            },
            {
              id: 2,
              name: "Notebook",
              description: "A notebook",
              price: 20,
              order_quantity: 10,
              total_price: 200,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: POST /order/:id/add-product", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .post("/order/2/add-product")
          .set("Authorization", `Bearer ${user.body.token}`)
          .send({
            user_id: 2,
            product_id: 3,
            quantity: 5,
          });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          id: 2,
          price: 20210,
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
              order_quantity: 5,
              total_price: 20000,
            },
            {
              id: 2,
              name: "Notebook",
              description: "A notebook",
              price: 20,
              order_quantity: 10,
              total_price: 200,
            },
            {
              id: 3,
              name: "Pencil",
              description: "A pencil",
              price: 2,
              order_quantity: 5,
              total_price: 10,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: PUT /order/:id/update", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        const response = await server
          .put("/order/2/update")
          .set("Authorization", `Bearer ${user.body.token}`)
          .send({
            user_id: 2,
            order_id: 2,
            products_ids: [4, 5],
            products_quantities: [30, 30],
          });

        expect(response.status).toBe(201);
        expect(response.body).toEqual({
          id: 2,
          price: 210000,
          user: {
            id: 2,
            name: "Pola Adel Eskandar",
            email: "polaeskandar123@gmail.com",
          },
          products: [
            {
              id: 4,
              name: "Gaming PC",
              description: "A gaming PC",
              price: 5000,
              order_quantity: 30,
              total_price: 150000,
            },
            {
              id: 5,
              name: "iPhone 14 plus",
              description: "An iPhone",
              price: 2000,
              order_quantity: 30,
              total_price: 60000,
            },
          ],
        });
      } catch (error) {
        console.error(error);
      }
    });

    it("can test: DELETE /order/:id/delete", async () => {
      try {
        const user = await server.post("/user/signin").send({
          email: "testing@supertest.com",
          password: "testing123",
        });

        await server
          .delete("/order/2/delete")
          .set("Authorization", `Bearer ${user.body.token}`);

        const check = await server
          .get("/order/2")
          .set("Authorization", `Bearer ${user.body.token}`);

        expect(check.status).toBe(200);
        expect(check.body.id).toBeUndefined();
        expect(check.body.price).toBeUndefined();
        expect(check.body.user).toBeUndefined();
        expect(check.body.product).toBeUndefined();
      } catch (error) {
        console.error(error);
      }
    });
  });
});
