CREATE DATABASE blog;

CREATE TABLE user (
    user_id   INT  PRIMARY KEY AUTO_INCREMENT,
    user_name VARCHAR(16),
    password: VARCHAR(16)
    user_role VARCHAR(11)
);


CRREATE TABLE posts (
	post_number  INT PRIMARY KEY AUTO_INCREMENT,
	blog_post TEXT,
	user_name VARCHARScreenshot at 2025-12-12 23-56-17(16);
        posted TIMESTAMP
);


CREATE TABLE news  ( title VARCHAR(100),            
		     author VARCHAR(35),            
                     photo BLOB(4294967295),            
                     newsitem MEDIUMTEXT
);
