CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  price INT DEFAULT 0,
  description TEXT DEFAULT NULL
);

INSERT INTO 
  products (name, price, description) 
VALUES
  ('Macbook Pro', 4000, 'A laptop'),
  ('Notebook', 20, 'A notebook'),
  ('Pencil', 2, 'A pencil'),
  ('Gaming PC', 5000, 'A gaming PC'),
  ('iPhone 14 plus', 2000, 'An iPhone');