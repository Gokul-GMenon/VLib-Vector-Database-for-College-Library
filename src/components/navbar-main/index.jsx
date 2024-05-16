import React from "react";
import './styles.css';
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";



export default function NavbarMain() {

    const navigate = useNavigate();

    return <div className="navbar-main">
        <div className="logo" onClick={() => { navigate("/") }}><svg width="68" height="40" viewBox="0 0 68 40" fill="none" xmlns="http://www.w3.org/2000/svg">
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
        <div className="nav-items">
            <div className="one">
                <NavLink to={'/journals'}>
                    Journals
                </NavLink>
            </div>

            <div className="two">
                <span>Books</span>
            </div>

            {/* <div className="three">
                <NavLink to={'/how'}>
                    <span>How it works</span>
                </NavLink>
            </div> */}

            <div className="login">
                <NavLink to={'/dashboard'}>Login</NavLink>
            </div>
        </div>
    </div>
}