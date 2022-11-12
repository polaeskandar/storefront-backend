CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT DEFAULT NULL,
  available_quantity INT DEFAULT 0
);

INSERT INTO 
  products (name, description, available_quantity) 
VALUES
  ('Macbook Pro', 'A laptop', 10),
  ('Notebook', 'A notebook', 20),
  ('Pencil', 'A pencil', 15),
  ('Gaming PC', 'A gaming PC', 30),
  ('iPhone 14 plus', 'An iPhone', 50);