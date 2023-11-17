-- Tabela Autor
CREATE TABLE Autor (
    id_autor INT PRIMARY KEY,
    nome_autor VARCHAR(255),
    email VARCHAR(255)
);

-- Tabela Usuario
CREATE TABLE Usuario (
    id_usuario INT PRIMARY KEY,
    nome_usuario VARCHAR(50),
    senha VARCHAR(255),
    fk_autor INT UNIQUE,
    FOREIGN KEY (fk_autor) REFERENCES Autor(id_autor)
);

-- Tabela TipoArtigo
CREATE TABLE TipoArtigo (
    id_tipo_artigo INT PRIMARY KEY,
    nome_tipo_artigo VARCHAR(255)
);

-- Tabela Artigo
CREATE TABLE Artigo (
    id_artigo INT PRIMARY KEY,
    titulo VARCHAR(255),
    conteudo TEXT,
    data_artigo TIMESTAMP,
    n_curtidas INT,
    fk_autor INT,
    FOREIGN KEY (fk_autor) REFERENCES Autor(id_autor)
);

-- Tabela ArtigoTipoAssociacao
CREATE TABLE ArtigoTipoAssociacao (
    id_artigo_tipo INT PRIMARY KEY,
    fk_artigo INT,
    fk_tipo_artigo INT,
    FOREIGN KEY (fk_artigo) REFERENCES Artigo(id_artigo),
    FOREIGN KEY (fk_tipo_artigo) REFERENCES TipoArtigo(id_tipo_artigo)
);

-- Tabela Comentario
CREATE TABLE Comentario (
    id_comentario INT PRIMARY KEY,
    conteudo TEXT,
    data_comentario TIMESTAMP,
    fk_autor INT,
    fk_artigo INT,
    FOREIGN KEY (fk_autor) REFERENCES Autor(id_autor),
    FOREIGN KEY (fk_artigo) REFERENCES Artigo(id_artigo)
);
