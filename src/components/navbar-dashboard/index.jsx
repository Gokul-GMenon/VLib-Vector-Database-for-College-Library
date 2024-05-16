import React from "react";
import { NavLink, Navigate } from 'react-router-dom';
import './styles.css';
import { useNavigate } from "react-router-dom";



export default function NavbarDashboard() {


    const navigate = useNavigate();

    function handleOnButtonClick() {
        navigate("/admin")
    }

    return <div className="navbar">
        <div className="Logo" onClick={()=>{navigate("/")}}><svg width="68" height="40" viewBox="0 0 68 40" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_607_873)">
                <path d="M19.1731 4.9397H10.9738C10.6175 4.9397 10.3286 5.29339 10.3286 5.7297V35.5497C10.3286 35.986 10.6175 36.3397 10.9738 36.3397H19.1731C19.5294 36.3397 19.8182 35.986 19.8182 35.5497V5.7297C19.8182 5.29339 19.5294 4.9397 19.1731 4.9397Z" fill="#0B0075" />
                <path d="M51.6199 4.9397H43.4206C43.0642 4.9397 42.7754 5.29339 42.7754 5.7297V35.5497C42.7754 35.986 43.0642 36.3397 43.4206 36.3397H51.6199C51.9762 36.3397 52.265 35.986 52.265 35.5497V5.7297C52.265 5.29339 51.9762 4.9397 51.6199 4.9397Z" fill="#0B0075" />
                <path d="M42.1894 7.22168L34.7425 3.39939C34.4188 3.23329 33.995 3.4133 33.7958 3.80146L20.179 30.331C19.9798 30.7192 20.0806 31.1685 20.4042 31.3346L27.8512 35.1569C28.1748 35.323 28.5986 35.143 28.7979 34.7548L42.4146 8.22526C42.6139 7.8371 42.513 7.38778 42.1894 7.22168Z" fill="#0B0075" />
            </g>
            <defs>
                <clipPath id="clip0_607_873">
                    <rect width="47.23" height="32.7" fill="white" transform="translate(10.3286 3.6499)" />
                </clipPath>
            </defs>
        </svg></div>
        <div className="main-dashboard">
            <div className="dash-board">
                <NavLink to="/dashboard" className="nav-dashboard">Dashboard</NavLink>
            </div>

            <div className="logout">
                <NavLink to="/" className="nav-logout">Logout</NavLink>
            </div>

            <button className="primary" onClick={handleOnButtonClick}><svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M5.15784 4.172C3.98584 5.343 3.98584 7.229 3.98584 11V13C3.98584 16.771 3.98584 18.657 5.15784 19.828C6.32884 21 8.21484 21 11.9858 21H13.9858C17.7568 21 19.6428 21 20.8138 19.828C21.9858 18.657 21.9858 16.771 21.9858 13V11C21.9858 7.229 21.9858 5.343 20.8138 4.172C19.6428 3 17.7568 3 13.9858 3H11.9858C8.21484 3 6.32884 3 5.15784 4.172ZM11.9858 7V11H7.98584V13H11.9858V17H13.9858V13H17.9858V11H13.9858V7H11.9858Z" fill="white" />
            </svg>Add new book</button>


        </div>
    </div>
}