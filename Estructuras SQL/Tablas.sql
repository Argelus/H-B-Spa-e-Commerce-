-- 1. Tabla de Usuarios
CREATE TABLE usuarios (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    password VARCHAR(255),
    role VARCHAR(255),
    username VARCHAR(255),
    email VARCHAR(255)
);

-- 2. Tabla de Categorías de Productos 
CREATE TABLE categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255),
    name VARCHAR(50)
);

-- 3. Tabla de Categorías de Servicios 
CREATE TABLE service_categories (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(500),
    image_url VARCHAR(255),
    name VARCHAR(255)
);

-- 4. Tabla de Códigos de Reseteo 
CREATE TABLE password_reset_codes (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    attempts INT,
    code VARCHAR(6),
    created_at DATETIME(6),
    expires_at DATETIME(6),
    email_sent_at DATETIME(6),
    status ENUM('PENDING', 'USED', 'EXPIRED')
);

-- 5. Tabla de Tokens de Reseteo 
CREATE TABLE password_reset_tokens (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    created_at DATETIME(6),
    expires_at DATETIME(6),
    request_ip VARCHAR(255),
    token_hash VARCHAR(128),
    used_at DATETIME(6),
    user_agent VARCHAR(255)
);

-- 6. Tabla de Productos
CREATE TABLE products (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(255),
    name VARCHAR(100),
    price DECIMAL(38,2), 
    stock INT,
    image_url VARCHAR(500),
    category_id BIGINT,
    contenido VARCHAR(50),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- 7. Tabla de Servicios
CREATE TABLE services (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    description VARCHAR(100),
    duration VARCHAR(255),
    image_url VARCHAR(255),
    name VARCHAR(255),
    price DOUBLE,
    category_id BIGINT,
    FOREIGN KEY (category_id) REFERENCES service_categories(id)
);

-- 8. Tabla de Órdenes 
CREATE TABLE orders (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(50),
    fecha_creacion DATETIME(6),
    nota VARCHAR(500),
    total DECIMAL(10,2),
    usuario_id BIGINT,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 9. Tabla de Reservas 
CREATE TABLE reservas (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    estado VARCHAR(50),
    fecha_reserva DATE,
    hora_reserva TIME,
    metodo_confirmacion VARCHAR(50),
    nota VARCHAR(500),
    telefono VARCHAR(20),
    usuario_id BIGINT,
    spa_service_id BIGINT,
    creado_en DATE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (spa_service_id) REFERENCES services(id)
);

-- 10. Tabla de Items del Carrito 
CREATE TABLE cart_items (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    quantity INT,
    total_price DECIMAL(10,2),
    product_id BIGINT,
    order_id BIGINT,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (order_id) REFERENCES orders(id)
);