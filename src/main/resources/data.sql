-- Création de la table utilisateur
CREATE TABLE utilisateur (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- Création de la table favori avec une clé étrangère vers la table utilisateur
CREATE TABLE favori (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    utilisateur_id INTEGER NOT NULL,
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateur(id) ON DELETE CASCADE
);

INSERT INTO utilisateur (name, password) 
VALUES ('test', 'password123');

INSERT INTO favori (name, latitude, longitude, utilisateur_id) 
VALUES ('test name', 0, 0, 1);

