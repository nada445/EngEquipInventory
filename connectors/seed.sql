
-- Insert rows into Categories
INSERT INTO "SEproject".categories (category_ID, category_name) VALUES
(20, 'Electronics'), -- ID = 20
(21, 'Tools'),       -- ID = 21
(22, 'Furniture'),   -- ID = 22
(23, 'Appliances'),  -- ID = 23
(24, 'Office Supplies'); -- ID = 24


INSERT INTO "SEproject".Suppliers (supplier_ID , supplier_name, contact_info, address)
VALUES 
(30,'Omar_Telecom', 'malkoosh@da3wa.com','beit_mama'),     -- supplier_ID = 30
(31, 'Seba3i_industries', 'sales@7aga.com', 'Office Rd, eldo2y'),
(32,'Nada_mart', 'info@7agabrdo.com', '789St Basmet kheir'),
(33, 'Mazen_World', 'service@ahlan.com', '101 midan elahwa'),
(34, 'helal_7aga', 'support@meen.com', '202 EBlvd, Chicago_ah');

-- Insert rows into Equipments 
INSERT INTO "SEproject".equipments (equipment_name, rating, model_number, purchase_date, quantity, status, location, category_ID, supplier_id) VALUES
('Drill Machine', 5, 101, '2022-01-10', 20, 'Available', 'Warehouse 1', 20, 30),
('Laptop', 4, 202, '2022-03-15', 10, 'In Use', 'Office 1', 21, 31),
('Projector', 5, 303, '2021-07-20', 5, 'Under Maintenance', 'Conference Room', 22, 32),
('Chair', 3, 404, '2023-02-05', 50, 'Available', 'Office 2', 23, 33),
('Air Conditioner', 5, 505, '2023-06-30', 8, 'Available', 'Server Room', 24, 34);


-- Inserting data into Users table
INSERT INTO "SEproject".Users (username, email, password, role)
VALUES 
('admin_user', 'admin@example.com', 'adminpass', 'admin'),
('john_doe', 'john.doe@example.com', 'password123', 'standard_user'),
('layla_hanem', 'layla.bateekha@example.com', 'mypassword', 'standard_user'),
('sherbo_lee', 'sherbo.lee@example.com', 'elpass', 'standard_user'),
('lucy_wang', 'lucy.wang@example.com', 'elpassword2', 'standard_user');

-- Inserting data into Orders table
INSERT INTO "SEproject".Orders (user_ID, date)
VALUES 
(1, '2024-12-01 10:30:00'),
(2, '2024-12-01 11:15:00'),
(3, '2024-12-02 14:20:00'),
(4, '2024-12-03 09:00:00'),
(5, '2024-12-03 16:50:00');

-- Inserting data into Cart table
INSERT INTO "SEproject".Cart (user_ID, equipment_ID, quantity)
VALUES 
(1, 1, 2),
(2, 3, 1),
(3, 4, 3),
(4, 2, 1),
(5, 5, 4);

-- Inserting data into Rating table
INSERT INTO "SEproject".Rating (user_ID, equipment_ID, comment, score)
VALUES 
(1, 1, 'Excellent performance, sho8l 3aly.', 5),
(2, 2, 'Great', 4),
(3, 3, 'tarsh el tarsh', 4),
(4, 4, 'meh awi', 3),
(5, 5, 'msh a7san 7aga', 3);

-- Inserting data into Equipment_Order table
INSERT INTO "SEproject".Equipment_Order (order_ID, equipment_ID, quantity)
VALUES 
(1, 1, 2),
(2, 2, 1),
(3, 3, 3),
(4, 4, 1),
(5, 5, 4);

