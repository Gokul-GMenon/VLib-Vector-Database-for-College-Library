import React from "react";
import Navbar from "../../components/navbar";
import NavbarDashboard from "../../components/navbar-dashboard";
import { NavLink, Navigate } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./dashboard.css";
import IP_ADDRESS from "../consts";


export default function Dashboard() {

    const navigate = useNavigate();

    const [totalBooks, setTotalBooks] = useState(0);
    const [recentlyAddedBooks, setRecentlyAddedBooks] = useState([]);
    useEffect(() => {
        fetchTotalBooks();
        fetchRecentlyAddedBooks();
    }, []);

    const fetchTotalBooks = async () => {
        try {
            const response = await fetch(`${IP_ADDRESS}/findBook/getAllBooks`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            console.log(data['result'].length);
            setTotalBooks(data['result'].length);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchRecentlyAddedBooks = async () => {
        try {
            const response = await fetch(`${IP_ADDRESS}/findBook/getTenBooks`);
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();

            console.log("10 books :", data);
            setRecentlyAddedBooks(data['result']);
        } catch (error) {
            console.error('Error fetching recently added books:', error);
        }
    };


    const handleAllBook = () => 
    {
        navigate("/all-books");
    }


    return (
        <div className="main-container-dashboard">
            <div>
                <NavbarDashboard />
            </div>

            <div className="container-dashboard">
                {/* <div className="search">
                <svg width="25" height="28" viewBox="0 0 25 28" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.9858 20C15.8518 20 18.9858 16.866 18.9858 13C18.9858 9.13401 15.8518 6 11.9858 6C8.11985 6 4.98584 9.13401 4.98584 13C4.98584 16.866 8.11985 20 11.9858 20Z" stroke="#888990" stroke-width="2"/>
<path d="M20.9858 22L17.9858 19" stroke="#888990" stroke-width="2" stroke-linecap="round"/>
</svg>

                    <input className="search-input" type="text" placeholder="Search book" />
                </div> */}

                <div className="dashboard-items">
                    <div className="count">
                        {totalBooks}
                    </div>
                    <span className="descr">
                        Total Books
                    </span>

                </div>

                <div className="display-details">
                    <div className="table-heading">
                    <span className="table-header">Recently added</span>
                    <button className="text-button" onClick={handleAllBook}> View all books</button>
                    </div>
                    <div className="table">
                        <table className="table-books" border={1}>
                            <thead>
                                <tr>
                                    <th>Books</th>                
                                    <th>Publishing Year</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentlyAddedBooks.map((book, index) => (
                                    <tr className="table-row" key={index}>
                                        <td className="book-details "><span className="book-name">
                                        {book[1]}</span>
                                        <span className="book-author ">{book[2]}</span></td>
                                        
                                        <td className="book-year">{book[3]}</td>
                                    </tr>
                                ))}
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>
    )


}