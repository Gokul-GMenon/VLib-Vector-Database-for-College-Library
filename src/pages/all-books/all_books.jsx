// import React from 'react'
// import NavbarDashboard from '../../components/navbar-dashboard'
// import { useEffect, useState } from 'react'
// import './all_books.css'
// import IP_ADDRESS from '../consts'


// export default function AllBooks() {

//     const [totalBooks, setTotalBooks] = useState([]);


//     useEffect(() => {
//         fetchTotalBooks();
//     }, []);


//     const fetchTotalBooks = async () => {
//         try {
//             const response = await fetch(`${IP_ADDRESS}/findBook/getAllBooks`);
//             if (!response.ok) {
//                 throw new Error('Failed to fetch data');
//             }
//             const data = await response.json();

//             // console.log(data['result']);
//             setTotalBooks(data['result']);
//         } catch (error) {
//             console.error('Error fetching data:', error);
//         }
//     };


//     return (
//         <div className='main-container-all-books'>
//             <div>
//                 <NavbarDashboard />
//             </div>

//             <div className="table table-margin">
//                 <table className="table-books" border={1}>
//                     <thead>
//                         <tr>
//                             <th>Books</th>
//                             <th>Publishing Year</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {totalBooks.map((book, index) => (
//                             <tr className="table-row" key={index}>
//                                 <td className="book-details "><span className="book-name">
//                                     {book[1]}</span>
//                                     <span className="book-author ">{book[2]}</span></td>

//                                 <td className="book-year">{book[3]}</td>
//                             </tr>
//                         ))}
//                     </tbody>

//                 </table>
//             </div>


//         </div>
//     )
// }


import React, { useState, useEffect } from 'react';
import NavbarDashboard from '../../components/navbar-dashboard';
import IP_ADDRESS from '../consts';
import './all_books.css';

export default function AllBooks() {
    const [totalBooks, setTotalBooks] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetchTotalBooks();
    }, []);

    const fetchTotalBooks = async () => {
        try {
            const response = await fetch(`${IP_ADDRESS}/findBook/getAllBooks`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setTotalBooks(data['result']);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const filteredBooks = totalBooks.filter(book =>
        book[1].toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleSearchChange = event => {
        setSearchQuery(event.target.value);
    };

    return (
        <div className='main-container-all-books'>
            <NavbarDashboard />
            <div className="search-bar">
                <input 
                    className="search-input"
                    type="text"
                    placeholder="Search books..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
            </div>
            <div className="table table-margin">
                <table className="table-books" border={1}>
                    <thead>
                        <tr>
                            <th>Books</th>
                            <th>Publishing Year</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredBooks.map((book, index) => (
                            <tr className="table-row" key={index}>
                                <td className="book-details ">
                                    <span className="book-name">{book[1]}</span>
                                    <span className="book-author ">{book[2]}</span>
                                </td>
                                <td className="book-year">{book[3]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
