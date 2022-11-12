CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  quantity INT,
  user_id INT REFERENCES users (id),
  product_id INT REFERENCES products (id)
);
