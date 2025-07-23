-- Cria o schema (banco de dados) se ele ainda não existir
CREATE SCHEMA IF NOT EXISTS testemaxima;

-- Seleciona o schema para usar nos comandos seguintes
USE testemaxima;

-- Tabela: departments
CREATE TABLE IF NOT EXISTS departments (
    code        VARCHAR(3) NOT NULL,
    description VARCHAR(100) NOT NULL,
    PRIMARY KEY (code)
);

-- Inserindo os dados fixos dos departamentos
INSERT IGNORE INTO departments (code, description) VALUES
('010', 'BEBIDAS'),
('020', 'CONGELADOS'),
('030', 'LATICINIOS'),
('040', 'VEGETAIS');

-- Tabela: users
CREATE TABLE IF NOT EXISTS users (
    id           CHAR(36) NOT NULL,
    email        VARCHAR(255) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name    VARCHAR(255) NOT NULL,
    status       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_email (email)
);

-- Tabela: products
CREATE TABLE IF NOT EXISTS products (
    id              CHAR(36) NOT NULL,
    code            VARCHAR(50) NOT NULL,
    description     VARCHAR(255) NOT NULL,
    department_code VARCHAR(3) NOT NULL,
    price           DECIMAL(18, 2) NOT NULL,
    status          BOOLEAN NOT NULL DEFAULT TRUE,
    Estado_prod     INT NOT NULL DEFAULT 2,
    created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uq_products_code (code),
    CONSTRAINT fk_products_departments
        FOREIGN KEY (department_code)
        REFERENCES departments (code)
);
