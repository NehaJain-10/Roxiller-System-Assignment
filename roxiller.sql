

DROP DATABASE IF EXISTS roxiller;
CREATE DATABASE roxiller;
USE roxiller;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  address VARCHAR(400),
  role ENUM('admin','user','store_owner') NOT NULL
);

CREATE TABLE stores (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(60) NOT NULL,
  email VARCHAR(100),
  address VARCHAR(400),
  owner_id INT,
  FOREIGN KEY (owner_id) REFERENCES users(id)
);

CREATE TABLE ratings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  store_id INT,
  rating INT CHECK(rating BETWEEN 1 AND 5),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (store_id) REFERENCES stores(id),
  UNIQUE KEY one_rating (user_id,store_id)
);

-- Sample data
INSERT INTO users (name,email,password,address,role)
VALUES
  ('Admin User of Roxiller','admin@roxiller.com', 'Abcdefghijkl@', 'Admin Address','admin'),
  ('Normal User of Roxiller','user@roxiller.com','Abcdefghijkl@','User Address','user'),
  ('Store Owner of Roxiller','owner@roxiller.com','Abcdefghijkl@','Owner Address','store_owner');

INSERT INTO stores (name,email,address,owner_id)
VALUES ('Sample Store','store@roxiller.com','Store Address',3);

INSERT INTO ratings (user_id,store_id,rating)
VALUES (2,1,4);
