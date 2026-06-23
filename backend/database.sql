CREATE DATABASE IF NOT EXISTS dsw_crud;
USE dsw_crud;

CREATE TABLE IF NOT EXISTS livros (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(100) NOT NULL,
    preco DECIMAL(10,2) NOT NULL,
    estoque INT NOT NULL DEFAULT 0,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserindo alguns livros de exemplo para testar depois
INSERT INTO livros (titulo, preco, estoque) VALUES
('O Senhor dos Anéis', 59.90, 15),
('O Hobbit', 39.90, 20),
('Dom Casmurro', 19.90, 5);
('1984', 34.90, 12),
('A Revolução dos Bichos', 24.90, 8),
('O Pequeno Príncipe', 15.00, 30),
('Harry Potter e a Pedra Filosofal', 45.00, 18),
('O Código Da Vinci', 29.90, 6),
('A Garota no Trem', 39.90, 4),
('O Alquimista', 22.50, 11);