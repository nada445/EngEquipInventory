CREATE TABLE if not exists "SEproject".categories (
    category_ID SERIAL PRIMARY KEY,
    category_name TEXT NOT NULL
);

CREATE TABLE if not exists "SEproject".suppliers (
    supplier_ID SERIAL PRIMARY KEY,
    supplier_name TEXT NOT NULL, 
    contact_info TEXT,
    address TEXT
);

CREATE TABLE if not exists "SEproject".equipments (
    equipment_ID SERIAL PRIMARY KEY,
    equipment_name TEXT NOT NULL,
    equipment_img BYTEA, 
    rating INTEGER NOT NULL DEFAULT 5,
    model_number INTEGER NOT NULL,
    purchase_date DATE NOT NULL,
    quantity INTEGER NOT NULL,
    status TEXT CHECK (status IN ('Available', 'In Use', 'Under Maintenance')),
    location TEXT,
    category_ID INTEGER REFERENCES "SEproject".categories(category_ID),
    supplier_id INTEGER REFERENCES "SEproject".suppliers(supplier_ID)
);

CREATE TABLE if not exists "SEproject".users (
    user_ID SERIAL PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL, 
    role TEXT CHECK (role IN ('admin', 'standard_user')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE if not exists "SEproject".orders (
    order_ID SERIAL PRIMARY KEY,
    user_ID INTEGER REFERENCES "SEproject".users(user_ID),
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "SEproject".cart (
    cart_ID SERIAL PRIMARY KEY,
    user_ID INTEGER REFERENCES "SEproject".users(user_ID),
    equipment_ID INTEGER REFERENCES "SEproject".equipments(equipment_ID),
    quantity INTEGER NOT NULL
);

CREATE TABLE "SEproject".rating (
    rating_ID SERIAL PRIMARY KEY,
    user_ID INTEGER REFERENCES "SEproject".users(user_ID),
    equipment_ID INTEGER REFERENCES "SEproject".equipments(equipment_ID),
    comment TEXT,
    score INTEGER NOT NULL
);

CREATE TABLE "SEproject".equipment_order (
    order_ID INTEGER REFERENCES "SEproject".orders(order_ID),
    equipment_ID INTEGER REFERENCES "SEproject".equipments(equipment_ID),
    quantity INTEGER NOT NULL,
    PRIMARY KEY (order_ID, equipment_ID)
);

create table if not exists "SEproject"."session"
(
    "id" serial primary key,
    "userId" integer not null,
    "token" text not null,
    "expiresAt" timestamp not null
);