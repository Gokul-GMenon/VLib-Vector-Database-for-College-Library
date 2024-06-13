# VLIB - A College Library Management System built on Vector Database
A library management platform that simplifies the search experience in a library by allowing any user to use any basic natural query to find the most appropriate resource. Simply put, the goal is to design a system that improves the search experience for users and make it easier to find what they are looking for.

## Technologies used :
- ReactJS
- DJango
- PostgreSQL
- pgvector
- Mixtral

## Key Features:
- Use as a replacement for conventional library management systems by adding books/material of various types and thereby building a database.
- Search for books using very basic and descriptive questions rather than specifically including certain keywords like author name, topic name etc.
- Obtain AI generated answers for queries based on content from available top results reducing one step especially if youre in a lookout for quick answers
- Will take you to the exact page of the book/material that discusses the content requested in the query.

## Requirements:
```
Python 3.8.10
PostgreSQL 16.1
```
- A together.ai API key.
- Collection of book and other PDF materials to build the database.

## Database Schema:
![Database Schema for library](https://github.com/Gokul-GMenon/VLib-Vector-Database-for-College-Library/assets/76942680/a1d8e443-448d-483b-9ad7-b284bde6a1e6)
- Also create an additional table for the caching functionality under the name **doc_search_cache**. The table is as described below:
![cache schema](https://github.com/Gokul-GMenon/VLib-Vector-Database-for-College-Library/assets/76942680/b4e1c340-315e-4b51-900d-0b186204b9f3)

## How to use:
1. Create a PSQL database and all the tables as per the schema shown above with the mentioned names.
2. Add the name of the postgres sql database, username, password, host and other details about the postgres server to settings.py.
3. Paste your together.ai api key in the **together_api_key.txt** file.
4. Add the required ip addresses in **ALLOWED_HOSTS** in the settings.py file.
5. Create a virtual environment and install all the required libraries as mentioned in requirements.txt file.
6. Run the server and use the front end for first populating the database with data and then all the other library management systems.
7. Enjoy!!
