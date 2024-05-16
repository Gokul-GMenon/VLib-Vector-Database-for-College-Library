import React from "react";
import { NavLink } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import "./styles.css";
import Navbar from "../../components/navbar";


export default function AdminPdfUpload3() {

    const navigate = useNavigate();



    function handleOnClick() {
        navigate("/dashboard");

    }

    return (
        <div>
            <div>
            <Navbar/>
            </div> 
              <div className="container2">
            
            
            <div className="success-detail">

                <div className="message">
                    <span className="message-title">Book published successfully</span>
                    <span className="message-subtitle">Your book is available in the digital library</span>
                </div>
                <div className="book-img">
                    <svg width="152" height="121" viewBox="0 0 152 121" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="45.9277" y="5.53822" width="75.2194" height="104.774" rx="5.5" stroke="#DAE2FF" stroke-width="5" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M110.027 26.6276H43.4278V36.1767H110.027V26.6276ZM110.026 49.4699H43.4277V59.019H110.026V49.4699ZM43.4277 72.3122H110.026V81.8613H43.4277V72.3122ZM110.026 95.1544H43.4277V104.704H110.026V95.1544Z" fill="url(#paint0_linear_370_205)" />
                        <rect x="36.1567" y="11.2785" width="79.2194" height="108.774" rx="7.5" fill="url(#paint1_linear_370_205)" stroke="#DAE2FF" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M110.027 31.4022C110.027 28.7652 107.889 26.6276 105.252 26.6276H48.2024C45.5655 26.6276 43.4278 28.7652 43.4278 31.4022C43.4278 34.0391 45.5655 36.1767 48.2024 36.1767H105.252C107.889 36.1767 110.027 34.0391 110.027 31.4022ZM110.026 54.2444C110.026 51.6075 107.889 49.4699 105.252 49.4699H48.2023C45.5654 49.4699 43.4277 51.6075 43.4277 54.2444C43.4277 56.8814 45.5654 59.019 48.2023 59.019H105.252C107.889 59.019 110.026 56.8814 110.026 54.2444ZM43.4277 77.0867C43.4277 74.4498 45.5654 72.3122 48.2023 72.3122H105.252C107.889 72.3122 110.026 74.4498 110.026 77.0867C110.026 79.7236 107.889 81.8613 105.252 81.8613H48.2023C45.5654 81.8613 43.4277 79.7236 43.4277 77.0867ZM110.026 99.929C110.026 97.2921 107.889 95.1544 105.252 95.1544H48.2023C45.5654 95.1544 43.4277 97.2921 43.4277 99.929C43.4277 102.566 45.5654 104.704 48.2023 104.704H105.252C107.889 104.704 110.026 102.566 110.026 99.929Z" fill="url(#paint2_linear_370_205)" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M17.8425 36.1284C27.681 36.1284 35.6567 28.1527 35.6567 18.3142C35.6567 8.47569 27.681 0.5 17.8425 0.5C8.00401 0.5 0.0283203 8.47569 0.0283203 18.3142C0.0283203 28.1527 8.00401 36.1284 17.8425 36.1284ZM25.9762 15.1805C26.7573 14.3994 26.7573 13.1331 25.9762 12.3521C25.1952 11.571 23.9288 11.571 23.1478 12.3521L15.4661 20.0337L12.5372 17.1048C11.7562 16.3238 10.4898 16.3238 9.70879 17.1049C8.92774 17.8859 8.92774 19.1522 9.70879 19.9333L14.0519 24.2764C14.8329 25.0574 16.0993 25.0574 16.8803 24.2764L25.9762 15.1805Z" fill="#797DD5" />
                        <path fill-rule="evenodd" clip-rule="evenodd" d="M139.686 118.814C146.124 118.814 151.343 113.595 151.343 107.157C151.343 100.719 146.124 95.5 139.686 95.5C133.247 95.5 128.028 100.719 128.028 107.157C128.028 113.595 133.247 118.814 139.686 118.814ZM145.008 105.107C145.519 104.595 145.519 103.767 145.008 103.256C144.497 102.745 143.668 102.745 143.157 103.256L138.13 108.282L136.214 106.366C135.703 105.855 134.874 105.855 134.363 106.366C133.852 106.877 133.852 107.706 134.363 108.217L137.205 111.059C137.716 111.57 138.545 111.57 139.056 111.059L145.008 105.107Z" fill="#797DD5" />
                        <defs>
                            <linearGradient id="paint0_linear_370_205" x1="43.4277" y1="105.098" x2="110.026" y2="105.098" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#EFEFFF" />
                                <stop offset="1" stop-color="#D3D2FF" />
                            </linearGradient>
                            <linearGradient id="paint1_linear_370_205" x1="75.7664" y1="10.7785" x2="75.7664" y2="120.553" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#7073CA" />
                                <stop offset="1" stop-color="#8487E2" />
                            </linearGradient>
                            <linearGradient id="paint2_linear_370_205" x1="43.4277" y1="105.098" x2="110.026" y2="105.098" gradientUnits="userSpaceOnUse">
                                <stop stop-color="#EFEFFF" />
                                <stop offset="1" stop-color="#D3D2FF" />
                            </linearGradient>
                        </defs>
                    </svg>
                </div>


            </div>

            {/* <div className="book-details">
                <div className="circle-img">
                    <svg width="85" height="86" viewBox="0 0 85 86" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.185547" y="0.552582" width="84.5205" height="84.5205" rx="42.2603" fill="#D9D9D9" />
                    </svg>
                </div>

                <div className="title">
                    Book title
                    <span>Author</span>
                    <span>Genre</span>
                </div>
            </div> */}

            <div className="return">
                <button className="CTA" onClick={handleOnClick}>Back to Dashboard</button>
                {/* <button className="CTA-NBG">Update details</button> */}
            </div>

        </div>
        </div>
          
        
    )
}