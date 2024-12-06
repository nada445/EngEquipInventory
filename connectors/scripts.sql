CREATE TABLE categories (
    category_ID SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL
);

CREATE TABLE suppliers (
    supplier_ID SERIAL PRIMARY KEY,
    supplier_name TEXT NOT NULL, 
    contact_info TEXT,
    address TEXT
);

CREATE TABLE equipments (
    equipment_ID SERIAL PRIMARY KEY,
    equipment_name TEXT NOT NULL,
    equipment_img BYTEA, 
    rating INTEGER NOT NULL DEFAULT 5,
    model_number INTEGER NOT NULL,
    purchase_date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT CHECK (status IN ('Available', 'In Use', 'Under Maintenance')),
    location TEXT,
    category_ID INTEGER REFERENCES categories(category_ID),
    supplier_id INTEGER REFERENCES suppliers(supplier_ID)
);

CREATE TABLE users (
    user_ID SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    role TEXT CHECK (role IN ('admin', 'standard_user')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE orders (
    order_ID SERIAL PRIMARY KEY,
    user_ID INTEGER REFERENCES users(user_ID),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart (
    cart_ID SERIAL PRIMARY KEY,
    user_ID INTEGER REFERENCES users(user_ID),
    equipment_ID INTEGER REFERENCES equipments(equipment_ID),
    quantity INTEGER NOT NULL
);

CREATE TABLE rating (
    rating_ID SERIAL PRIMARY KEY,
    user_ID INTEGER REFERENCES users(user_ID),
    equipment_ID INTEGER REFERENCES equipments(equipment_ID),
    comment TEXT,
    score INTEGER NOT NULL
);

CREATE TABLE equipment_order (
    order_ID INTEGER REFERENCES orders(order_ID),
    equipment_ID INTEGER REFERENCES equipments(equipment_ID),
    quantity INTEGER NOT NULL,
    PRIMARY KEY (order_ID, equipment_ID)
);