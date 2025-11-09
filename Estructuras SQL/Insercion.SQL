-- 1. Insertar Usuarios (IDs 1-5)
INSERT INTO usuarios (username, email, password, role) VALUES
('jperéz', 'juan.perez@example.com', 'pass_hash_123', 'CLIENTE'),
('mgarcía', 'maria.garcia@example.com', 'pass_hash_456', 'CLIENTE'),
('admin_spa', 'admin@spa.com', 'pass_hash_789', 'ADMIN'),
('l_gomez', 'luis.gomez@example.com', 'pass_hash_101', 'CLIENTE'),
('a_diaz', 'ana.diaz@example.com', 'pass_hash_102', 'TERAPEUTA');

-- 2. Insertar Categorías de Productos (IDs 1-5)
INSERT INTO categories (name, description) VALUES
('Facial', 'Productos para el cuidado facial'),
('Corporal', 'Productos para el cuidado corporal'),
('Aromaterapia', 'Aceites esenciales y difusores'),
('Cabello', 'Shampoos y tratamientos capilares'),
('Accesorios', 'Esponjas, cepillos y más');

-- 3. Insertar Categorías de Servicios (IDs 1-5)
INSERT INTO service_categories (name, description, image_url) VALUES
('Masajes', 'Masajes relajantes y terapéuticos', '/img/cat_masajes.jpg'),
('Tratamientos Faciales', 'Limpieza, hidratación y rejuvenecimiento', '/img/cat_faciales.jpg'),
('Terapias Holísticas', 'Reiki, acupuntura y más', '/img/cat_holisticas.jpg'),
('Manicura y Pedicura', 'Cuidado de manos y pies', '/img/cat_manos.jpg'),
('Tratamientos Corporales', 'Exfoliaciones y envolturas', '/img/cat_corporales.jpg');

-- 4. Insertar Códigos de Reseteo
INSERT INTO password_reset_codes (attempts, code, created_at, expires_at, email_sent_at, status) VALUES
(1, '123456', NOW(), NOW() + INTERVAL 10 MINUTE, NOW(), 'PENDING'),
(0, '654321', NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY + INTERVAL 10 MINUTE, NOW() - INTERVAL 1 DAY, 'EXPIRED'),
(3, '112233', NOW() - INTERVAL 2 HOUR, NOW() - INTERVAL 2 HOUR + INTERVAL 10 MINUTE, NOW() - INTERVAL 2 HOUR, 'PENDING'),
(0, '445566', NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY + INTERVAL 10 MINUTE, NOW() - INTERVAL 5 DAY, 'USED'),
(2, '987654', NOW() - INTERVAL 1 MINUTE, NOW() + INTERVAL 9 MINUTE, NOW() - INTERVAL 1 MINUTE, 'PENDING');

-- 5. Insertar Tokens de Reseteo
INSERT INTO password_reset_tokens (token_hash, created_at, expires_at, request_ip, user_agent, used_at) VALUES
('hash_abc', NOW(), NOW() + INTERVAL 1 HOUR, '192.168.1.1', 'Chrome/Win10', NULL),
('hash_def', NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY + INTERVAL 1 HOUR, '10.0.0.1', 'Firefox/Mac', NOW() - INTERVAL 1 DAY),
('hash_ghi', NOW(), NOW() + INTERVAL 1 HOUR, '172.16.0.5', 'Safari/iOS', NULL),
('hash_jkl', NOW() - INTERVAL 30 MINUTE, NOW() + INTERVAL 30 MINUTE, '192.168.1.2', 'Chrome/Win10', NULL),
('hash_mno', NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY + INTERVAL 1 HOUR, '200.1.1.1', 'Edge/Win11', NULL);

-- 6. Insertar Productos (Usando category_id 1-5)
INSERT INTO products (name, description, price, stock, image_url, category_id, contenido) VALUES
('Crema Hidratante Facial', 'Crema de día con ácido hialurónico', 750.00, 50, '/img/prod_crema.jpg', 1, '50ml'),
('Exfoliante Corporal', 'Exfoliante de sales marinas', 420.00, 30, '/img/prod_exfol.jpg', 2, '200g'),
('Aceite Esencial Lavanda', 'Aceite puro de lavanda para relajación', 250.00, 100, '/img/prod_lavanda.jpg', 3, '10ml'),
('Serum Capilar', 'Serum reparador de puntas', 380.00, 40, '/img/prod_serum.jpg', 4, '30ml'),
('Esponja Konjac', 'Esponja facial de fibra natural', 150.00, 80, '/img/prod_esponja.jpg', 5, '1 pza');

-- 7. Insertar Servicios (Usando category_id 1-5)
INSERT INTO services (name, description, duration, price, image_url, category_id) VALUES
('Masaje Sueco', 'Masaje relajante de cuerpo completo', '60 min', 900.0, '/img/serv_sueco.jpg', 1),
('Limpieza Facial Profunda', 'Incluye extracción y mascarilla', '75 min', 800.0, '/img/serv_facial.jpg', 2),
('Sesión de Reiki', 'Terapia de energía para equilibrio', '50 min', 700.0, '/img/serv_reiki.jpg', 3),
('Manicura Spa', 'Manicura completa con exfoliación', '45 min', 350.0, '/img/serv_mani.jpg', 4),
('Envoltura de Algas', 'Tratamiento corporal desintoxicante', '90 min', 1200.0, '/img/serv_algas.jpg', 5);

-- 8. Insertar Órdenes (Usando usuario_id 1, 2, 4)
INSERT INTO orders (estado, fecha_creacion, nota, total, usuario_id) VALUES
('PENDIENTE', NOW(), 'Entregar por la tarde', 750.00, 1),
('COMPLETADO', NOW() - INTERVAL 1 DAY, 'Cliente recogió', 420.00, 2),
('EN_PROCESO', NOW(), 'Para regalo', 250.00, 4),
('CANCELADO', NOW() - INTERVAL 2 DAY, 'Pago rechazado', 380.00, 1),
('COMPLETADO', NOW() - INTERVAL 3 DAY, '', 150.00, 2);

-- 9. Insertar Reservas (Usando usuario_id 1-5 y spa_service_id 1-5)
INSERT INTO reservas (estado, fecha_reserva, hora_reserva, metodo_confirmacion, nota, telefono, usuario_id, spa_service_id, creado_en) VALUES
('CONFIRMADA', '2025-11-15', '16:00:00', 'WHATSAPP', 'Cliente frecuente', '5511223344', 1, 1, CURDATE()),
('PENDIENTE', '2025-11-16', '11:00:00', 'EMAIL', '', '5522334455', 2, 2, CURDATE()),
('COMPLETADA', '2025-11-08', '13:00:00', 'LLAMADA', 'Llegó 10 min tarde', '5533445566', 3, 3, '2025-11-08'),
('CANCELADA', '2025-11-10', '10:00:00', 'SISTEMA', 'Cliente canceló online', '5544556677', 4, 4, '2025-11-10'),
('CONFIRMADA', '2025-11-17', '18:00:00', 'WHATSAPP', 'Alergia a cítricos', '5566778899', 5, 5, CURDATE());

-- 10. Insertar Items del Carrito (Usando product_id 1-5 y order_id 1-5)
INSERT INTO cart_items (quantity, total_price, product_id, order_id) VALUES
(1, 750.00, 1, 1),
(1, 420.00, 2, 2), 
(1, 250.00, 3, 3), 
(1, 380.00, 4, 4), 
(1, 150.00, 5, 5);