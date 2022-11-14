CREATE TABLE order_product (
  id SERIAL PRIMARY KEY,
  quantity INT DEFAULT 0,
  product_id INT REFERENCES products (id),
  order_id INT REFERENCES orders (id)
);