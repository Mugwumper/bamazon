DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(45) NULL,
  department_name VARCHAR(12) NULL,
  price DECIMAL(10,2) NULL,
  stock_quantity INT NULL,
  PRIMARY KEY (id)
);

INSERT INTO products 
 (product_name,             department_name, price, stock_quantity)
VALUES 
 ("Vanilla Sprite",         "Grocery", 6.99, 296), 
 ("Diet Coke",              "Grocery", 6.99, 232), 
 ("Orange Cola",            "Grocery", 5.99, 120), 
 ("Greatest Hits of 1988",  "Music", 12.00, 52), 
 ("Greatest Hits of 1989",  "Music", 12.00, 51), 
 ("Greatest Hits of 1990",  "Music", 12.00, 56), 
 ("Greatest Hits of 1991",  "Music", 12.00, 33), 
 ("Vinyl Golf Gloves",      "Sports", 13.50, 296), 
 ("Golf Shoes w/spikes",    "Sports", 35.25, 6), 
 ("Lionel Train Set - Rock Island Road", "Toys", 125.99, 21); 


