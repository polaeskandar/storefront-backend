## Database Schema

- storefront_backend
  - users
    - id INT
    - name VARCHAR(100)
    - email VARCHAR(255)
    - password VARCHAR(100)
  - products
    - id INT
    - name VARCHAR(100)
    - price INT
    - description TEXT
  - orders
    - id INT
    - user_id INT
  - order_product (Many to many pivot table)
    - id INT
    - quantity INT
    - product_id INT
    - order_id INT

---

# Setting up the database

1. connect to postgres database using the default user: `psql -U postgres`
2. Run the following command to create a user: `CREATE USER store_user WITH PASSWORD 'testing_password';`
3. Create the development / production database: `CREATE DATABASE storefront_backend;`
4. Create the test database: `CREATE DATABASE storefront_backend_test;`
5. Grant privileges to the databases:
   - `\c storefront_backend`
   - `GRANT ALL PRIVILEGES ON DATABASE storefront_backend TO store_user;`
   - `\c storefront_backend_test`
   - `GRANT ALL PRIVILEGES ON DATABASE storefront_backend_test TO store_user;`

---

## Endpoints

- `POST /user/signup`
  - Signs a new user up.
- `POST /user/signin`
  - Signs a user in.
- `GET /users`
  - Gets all users registered in the database.
  - Must be authenticated in order to complete this action.
- `GET /user/:id`
  - Gets a specific user with id in the database.
  - Must be authenticated in order to complete this action.
- `POST /user/create`
  - FOR AUTHENTICATED USERS ONLY. For unathenticated users please use `POST /user/signin` or `POST /user/signup`.
  - Creates a new user in the database.
  - Must be authenticated in order to complete this action.
- `PUT /user/:id/update`
  - Updates an existing user in the database.
  - Must be authenticated in order to complete this action.
- `DELETE /user/:id/delete`
  - Deltes an existing user in the database.
  - Must be authenticated in order to complete this action.
- `GET /products`
  - Gets all products in the database.
  - Must be authenticated in order to complete this action.
- `GET /product/:id`
  - Gets a specific product with id in the database.
  - Must be authenticated in order to complete this action.
- `POST /product/create`
  - Creates a new product in the database.
  - Must be authenticated in order to complete this action.
- `PUT /product/:id/update`
  - Updates an existing product in the database.
  - Must be authenticated in order to complete this action.
- `DELETE /product/:id/delete`
  - Deletes an existing product in the database.
  - Must be authenticated in order to complete this action.
- `GET /orders`
  - Gets all orders in the database.
  - Must be authenticated in order to complete this action.
- `GET /order/:id`
  - Gets a specific order with id in the database.
  - Must be authenticated in order to complete this action.
- `POST /order/create`
  - Creates a new order in the database.
  - Must be authenticated in order to complete this action.
- `POST /order/add-product`
  - Adds a new product to an existing order.
  - Must be authenticated in order to complete this action.
- `PUT /order/:id/update`
  - Updates an existing order in the database.
  - Must be authenticated in order to complete this action.
- `DELETE /order/:id/delete`
  - Deletes an existing order in the database.
  - Must be authenticated in order to complete this action.

---
