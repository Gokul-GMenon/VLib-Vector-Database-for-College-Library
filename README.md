# VLIB - A College Library Management System built on Vector Database 💪💪
A library management platform that simplifies the search experience in a library by allowing any user to use any basic natural query to find the most appropriate resource 🧠. Simply put, the goal is to design a system that improves the search experience for users and make it easier to find 🔍 what they are looking for.

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
- LRU based semantic caching has been enabled for getting quicker results. It caches the most common search queries (eg: most beginner users search the same topics in the library) and loads it in when a queery of high semantic similarity is typed in.

## Setting up the frontend:
1. Install all packages with `npm install`
2. Add the backend API url in `src/pages/consts.js`
3. Run the server with `npm start`
4. Enjoy!!
