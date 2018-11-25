USE MASTER
GO
CREATE DATABASE Cinema
GO
USE [Cinema]
GO
CREATE TABLE Films(
    FilmID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    FilmName VARCHAR(100) NOT NULL,
    RealeseDate DATE NOT NULL,
);
GO
CREATE TABLE Actors(
    ActorID int IDENTITY(1,1) PRIMARY KEY NOT NULL,
    ActorFullName VARCHAR(100) NOT NULL,
    ActorBirthDate DATE,
    ActorBirthPlace VARCHAR(100),
    ActorSex CHAR(1) NOT NULL CHECK(ActorSex in ('M','F'))
);
GO
CREATE TABLE Genres(
    GenreID INT IDENTITY(1,1) PRIMARY KEY NOT NULL,
    GenreName VARCHAR(50) NOT NULL
);
GO
CREATE TABLE Studios(
    StudioID INT IDENTITY(1,1) PRIMARY KEY NOT NULL, 
    StudioName VARCHAR(100) NOT NULL
);
GO
CREATE TABLE FilmsActors(
    FilmID INT NOT NULL FOREIGN KEY REFERENCES Films(FilmID) ON UPDATE CASCADE ON DELETE CASCADE,
    ActorID INT NOT NULL FOREIGN KEY REFERENCES Actors(ActorID) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY (FilmID, ActorID)
);
GO
CREATE TABLE FilmsGenres(
    FilmID INT NOT NULL FOREIGN KEY REFERENCES Films(FilmID),
    GenreID INT NOT NULL FOREIGN KEY REFERENCES Genres(GenreID),
    PRIMARY KEY (FilmID, GenreID)
);
GO

ALTER TABLE Films
ADD StudioID INT FOREIGN KEY REFERENCES Studios(StudioID) ON DELETE CASCADE ON UPDATE CASCADE

INSERT INTO Genres VALUES ('Drama');
INSERT INTO Genres VALUES ('Fantasy');
INSERT INTO Genres VALUES ('Criminal');
INSERT INTO Genres VALUES ('Detective');
INSERT INTO Genres VALUES ('Love-story');
INSERT INTO Genres VALUES ('Biography');
INSERT INTO Genres VALUES ('History');
INSERT INTO Genres VALUES ('Comedy');
INSERT INTO Genres VALUES ('Thriller');
INSERT INTO Genres VALUES ('Fantastic');
INSERT INTO Genres VALUES ('Adventure');
INSERT INTO Genres VALUES ('Action');

INSERT INTO Studios VALUES ('Castle Rock Entertainment');
INSERT INTO Studios VALUES ('Universal Studios');
INSERT INTO Studios VALUES ('20 Century Fox');
INSERT INTO Studios VALUES ('Quad');
INSERT INTO Studios VALUES ('Gaumont');
INSERT INTO Studios VALUES ('Syncopy');

INSERT INTO Films (FilmName, RealeseDate, StudioID) VALUES ('The Shawshank Redemption','1994', 1);
INSERT INTO Films (FilmName, RealeseDate, StudioID) VALUES ('Green Mile','1999', 2);
INSERT INTO Films (FilmName, RealeseDate, StudioID) VALUES ('Forest Gump','1994', 2);
INSERT INTO Films (FilmName, RealeseDate, StudioID) VALUES ('Shindler`s list','1993', 3);
INSERT INTO Films (FilmName, RealeseDate, StudioID) VALUES ('Intouchables','2011', 5);
INSERT INTO Films (FilmName, RealeseDate, StudioID) VALUES ('Leon','1994', 6);
INSERT INTO Films (FilmName, RealeseDate, StudioID) VALUES ('Inception','2010', 6);
INSERT INTO Films (FilmName, RealeseDate, StudioID) VALUES ('Fight Club','1999', 3);
INSERT INTO Films (FilmName, RealeseDate, StudioID) VALUES ('Interstellar','2014', 6);

INSERT INTO Actors VALUES ('Tim Robbins','1958-10-16', 'West-Covina', 'M');
INSERT INTO Actors VALUES ('Morgan Freeman','1937-06-01', 'Memfis','M');
INSERT INTO Actors VALUES ('Bob Gunton','1945-11-15', 'Santa-Monica','M');
INSERT INTO Actors VALUES ('William Sadler','1950-04-13', 'Buffalo', 'M');

INSERT INTO Actors VALUES ('Tom Hanks','1956-06-09', 'Concord','M');
INSERT INTO Actors VALUES ('David Morse', '1953-10-11', 'Hamilton','M');
INSERT INTO Actors VALUES ('Michael Clarke Duncan', '1957-12-10', 'Los Angeles','M');
INSERT INTO Actors VALUES ('Bonnie Hunt', '1961-09-22', 'Chicago','F');

INSERT INTO Actors VALUES ('Robin Wright', '1966-04-08', 'Dallas','F');
INSERT INTO Actors VALUES ('Sally Field', '1946-11-06', 'Pasadena','F');
INSERT INTO Actors VALUES ('Gary Sinise', '1955-03-17', 'Blue-Island','M');

INSERT INTO Actors VALUES ('Liam Neeson', '1952-06-07', 'Belliman', 'M');
INSERT INTO Actors VALUES ('Ben Kingsley', '1943-12-31', 'Skaroboro', 'M');
INSERT INTO Actors VALUES ('Ralph Fiennes', '1962-12-22', 'Eepswitch', 'M');
INSERT INTO Actors VALUES ('Caroline Goodall', '1959-11-13', 'London','F');

INSERT INTO Actors VALUES ('Francois Cluzet', '1955-09-21', 'Paris', 'M');
INSERT INTO Actors VALUES ('Omar Si', '1978-01-20', 'Trap', 'M');
INSERT INTO Actors VALUES ('Anne Le Ny', '1962-12-16', 'Antony', 'F');
INSERT INTO Actors VALUES ('Audrey Fleurot', '1977-06-06', 'Mant-La-Joli','F');

INSERT INTO Actors VALUES ('Jean Reno', '1948-06-30', 'Kasablanka', 'M');
INSERT INTO Actors VALUES ('Gary Oldman', '1958-03-21', 'New-Cross', 'M');
INSERT INTO Actors VALUES ('Natalie Portman', '1981-06-09', 'Jeirusalim', 'F');
INSERT INTO Actors VALUES ('Danny Aillo', '1933-06-20', 'New-York','M');

INSERT INTO Actors VALUES ('Leonardo DiCaprio', '1974-11-11', 'Hollywood','M');
INSERT INTO Actors VALUES ('Joseph Gordon-Levitt', '1981-02-17', 'Los-Angeles','M');
INSERT INTO Actors VALUES ('Ellen Page', '1987-02-21', 'Halifax','F');
INSERT INTO Actors VALUES ('Tom Hardy', '1977-09-15', 'Hammersmith','M');

INSERT INTO Actors VALUES ('Edward Norton', '1969-08-18', 'Boston','M');
INSERT INTO Actors VALUES ('Brad Pitt', '1963-12-18', 'Shawni','M');
INSERT INTO Actors VALUES ('Helena Bonham Carter', '1966-05-26', 'Golders-Green','F');
INSERT INTO Actors VALUES ('Meat Loaf', '1947-09-27', 'Dallas','M');

INSERT INTO Actors VALUES ('Matthew McConaughey', '1969-11-04', 'Uwald','M');
INSERT INTO Actors VALUES ('Anne Hathaway', '1982-11-12', 'Brooklyn','F');
INSERT INTO Actors VALUES ('Jessica Chastain', '1977-03-24', 'Sacramento','F');
INSERT INTO Actors VALUES ('Mackenzie Foy', '2000-11-10', 'Dallas','F');



INSERT INTO FilmsActors VALUES (1, 1);
INSERT INTO FilmsActors VALUES (1, 2);
INSERT INTO FilmsActors VALUES (1, 3);
INSERT INTO FilmsActors VALUES (1, 4);
INSERT INTO FilmsActors VALUES (2, 5);
INSERT INTO FilmsActors VALUES (2, 6);
INSERT INTO FilmsActors VALUES (2, 7);
INSERT INTO FilmsActors VALUES (2, 8);
INSERT INTO FilmsActors VALUES (3, 5);
INSERT INTO FilmsActors VALUES (3, 9);
INSERT INTO FilmsActors VALUES (3, 10);
INSERT INTO FilmsActors VALUES (3, 11);
INSERT INTO FilmsActors VALUES (4, 12);
INSERT INTO FilmsActors VALUES (4, 13);
INSERT INTO FilmsActors VALUES (4, 14);
INSERT INTO FilmsActors VALUES (4, 15);
INSERT INTO FilmsActors VALUES (5, 16);
INSERT INTO FilmsActors VALUES (5, 17);
INSERT INTO FilmsActors VALUES (5, 18);
INSERT INTO FilmsActors VALUES (5, 19);
INSERT INTO FilmsActors VALUES (6, 20);
INSERT INTO FilmsActors VALUES (6, 21);
INSERT INTO FilmsActors VALUES (6, 22);
INSERT INTO FilmsActors VALUES (6, 23);
INSERT INTO FilmsActors VALUES (7, 24);
INSERT INTO FilmsActors VALUES (7, 25);
INSERT INTO FilmsActors VALUES (7, 26);
INSERT INTO FilmsActors VALUES (7, 27);
INSERT INTO FilmsActors VALUES (8, 28);
INSERT INTO FilmsActors VALUES (8, 29);
INSERT INTO FilmsActors VALUES (8, 30);
INSERT INTO FilmsActors VALUES (8, 31);
INSERT INTO FilmsActors VALUES (9, 32);
INSERT INTO FilmsActors VALUES (9, 33);
INSERT INTO FilmsActors VALUES (9, 34);
INSERT INTO FilmsActors VALUES (9, 35);

INSERT INTO FilmsGenres VALUES (1, 1);
INSERT INTO FilmsGenres VALUES (2, 1);
INSERT INTO FilmsGenres VALUES (2, 2);
INSERT INTO FilmsGenres VALUES (2, 3);
INSERT INTO FilmsGenres VALUES (2, 4);
INSERT INTO FilmsGenres VALUES (3, 1);
INSERT INTO FilmsGenres VALUES (3, 5);
INSERT INTO FilmsGenres VALUES (4, 1);
INSERT INTO FilmsGenres VALUES (4, 6);
INSERT INTO FilmsGenres VALUES (4, 7);
INSERT INTO FilmsGenres VALUES (5, 1);
INSERT INTO FilmsGenres VALUES (5, 6);
INSERT INTO FilmsGenres VALUES (5, 8);
INSERT INTO FilmsGenres VALUES (6, 1);
INSERT INTO FilmsGenres VALUES (6, 3);
INSERT INTO FilmsGenres VALUES (6, 9);
INSERT INTO FilmsGenres VALUES (7, 1);
INSERT INTO FilmsGenres VALUES (7, 4);
INSERT INTO FilmsGenres VALUES (7, 9);
INSERT INTO FilmsGenres VALUES (7, 10);
INSERT INTO FilmsGenres VALUES (7, 12);
INSERT INTO FilmsGenres VALUES (8, 1);
INSERT INTO FilmsGenres VALUES (8, 3);
INSERT INTO FilmsGenres VALUES (8, 9);
INSERT INTO FilmsGenres VALUES (9, 1);
INSERT INTO FilmsGenres VALUES (9, 10);
INSERT INTO FilmsGenres VALUES (9, 11);



USE [Cinema]
GO
SELECT [dbo].[FilmName] FROM [dbo].[Films] WHERE (RealeseDate BETWEEN 2017-03-05 AND 2018-09-03) AND StudioID=1;

UPDATE Films SET StudioID=1 WHERE FilmName='Green Mile';

INSERT INTO Actors VALUES('Kevin Spacey', '2001-06-26', 'South Oringe','M');
UPDATE Actors SET ActorBirthDate='1959-06-26' WHERE ActorFullName='Kevin Spacey';
DELETE FROM Actors WHERE ActorFullName='Kevin Spacey';
