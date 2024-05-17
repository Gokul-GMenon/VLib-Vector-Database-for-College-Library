import React from "react";
import NavbarMain from "../../components/navbar-main";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import "./results.css";
import { useState } from "react";
import { navigate } from "react-router-dom";
import { Document, Page } from '@react-pdf/renderer';
import IP_ADDRESS from "../consts";
import { useEffect } from "react";
import { BarLoader, CircleLoader, ClipLoader, BeatLoader, RotateLoader, ScaleLoader, HashLoader } from "react-spinners";
import Typewriter from 'typewriter-effect';


export default function Results() {
    const location = useLocation();

    const { apiResponse, textAreaValue } = location.state || {};

    const [text_area, setText_area] = useState(textAreaValue);
    const [isFocused, setIsFocused] = useState(false);
    const [loading, setLoading] = useState(false);
    const [filtered, setFiltered] = useState(false);
    const [allBooks, setallBooks] = useState([]);


    const [selectedGenres, setSelectedGenres] = useState([]);
    const [startYear, setStartYear] = useState(1970);
    const [endYear, setEndYear] = useState(2024);

    const [summary, setSummary] = useState('');
    const [loadingSummary, setLoadingSummary] = useState(false);
    const [showText, setShowText] = useState(false);


    const [isTyping, setIsTyping] = useState(false); // Initially not typing

    console.log("api response is ", !(apiResponse['result']));

    if(!(apiResponse['result'])){
        console.log("no books available")
    }

    useEffect(() => {
        if (loadingSummary) {
            // Reset states on loading start
            setIsTyping(false);
            setShowText(false);
        } else if (summary) {
            // Trigger animation only once
            setIsTyping(true);
            const timeout = setTimeout(() => {
                setIsTyping(false); // Set isTyping to false after animation
                setShowText(true); // Show static text after timeout
            }, 30 * summary.length);
            return () => clearTimeout(timeout);
        }
    }, [loadingSummary, summary]);






    // Fetch genre list from an API
    useEffect(() => {
        const fetchGenreList = async () => {

            setGenreList(apiResponse['genre']);
            setallBooks(apiResponse.result);
        };

        fetchGenreList();
    }, [textAreaValue]);

    let filteredBooks = allBooks;


    const [genreList, setGenreList] = useState([]);

    const handleGenreChange = (event) => {
        const genre = event.target.value;

        if (selectedGenres.includes(genre)) {
            setSelectedGenres(selectedGenres.filter((g) => g !== genre));
        } else {
            setSelectedGenres([...selectedGenres, genre]);
        }



    };

    const handleStartYearChange = (event) => {
        setStartYear(parseInt(event.target.value));
    };

    const handleEndYearChange = (event) => {
        setEndYear(parseInt(event.target.value));
    };


    // Filter the books based on the selected genre and publishing year range
    filteredBooks = filteredBooks.filter((book) => {

        if (selectedGenres.length === 0) {

            const bookYear = parseInt(book[3].slice(0, 4));
            // const isBookInSelectedGenres = (bookYear >= startYear &&  bookYear <= endYear) ? book : '';
            // return isBookInSelectedGenres;
            if (bookYear >= startYear && bookYear <= endYear) {
                return book;
            }

        }

        const bookGenres = book[6]?.split(",") || [];
        const bookYear = parseInt(book[3].slice(0, 4));
        const isBookInSelectedGenres =
            ((bookYear >= startYear &&
                bookYear <= endYear) ?
                bookGenres.every((g) => selectedGenres.includes(g)) : "");
        return isBookInSelectedGenres;
    });


    const navigate = useNavigate();

    async function handleButtonClick(event) {
        event.preventDefault(); // Prevent default form submission



        setLoading(true); // Set loading state

        const formData = new FormData();

        try {
            formData.append('query', text_area);
            // formData.append('genre', genre);


            var requestOptions1 = {
                method: 'POST',
                body: formData,
                headers: {
                    'Origin': `${IP_ADDRESS}` // Replace with your React app's origin
                },
                // redirect: 'follow'
            };

            const response = await fetch(`${IP_ADDRESS}/findBook/querySearch`, requestOptions1)
            const data = await response.json();
            // navigate("/upload-success")
            console.log(data);



            navigate("/results", {
                state: {
                    apiResponse: data,
                    textAreaValue: text_area,
                },
            });
        }

        catch (error) {
            console.error(error);
            <h1>Error Occurred</h1>
            // setLoading(false); // Reset loading state
        }
        finally {
            setLoading(false); // Reset loading state
        }
    }


    async function handleTitleClick(bookId, title, author, pdf_url) { // Use bookId instead of location
        try {
            console.log(bookId);

            const formData = new FormData();
            formData.append('id', bookId);

            var requestOptions = {
                method: 'POST',
                body: formData,
                headers: {
                    'Origin': `${IP_ADDRESS}`, // Replace with your React app's origin
                },
                // redirect: 'follow'
            };

            const response = await fetch(`${IP_ADDRESS}/findBook/getPDF`, requestOptions)

            if (!response.ok) {
                throw new Error("Failed to fetch PDF"); // Handle errors gracefully
            }
            const pdfData = await response.blob();


            const reader = new FileReader();
            reader.readAsDataURL(pdfData); // Read the PDF data as a data URL


            reader.onload = function (event) {
                const pdfDataURL = event.target.result; // Get the data URL


                navigate("/view-pdf", {
                    state: {
                        apiResponse,
                        pdfDataURL,
                        pdfData,
                        bookDetails: {
                            id: bookId, // Include book ID in details
                            // title: apiResponse.result[bookId][1], // Assuming title is at index 1
                            // author: apiResponse.result[bookId][2], // Assuming author is at index 2
                            // ... Add other details as needed
                            title: title,
                            author: author,
                        },


                    },
                });
            }

            reader.onerror = function (error) {
                console.error("Error reading PDF:", error);
                // Handle errors gracefully
            };
        } catch (error) {
            console.error(error);
            // Handle errors, e.g., display an error message
        }
    }


    async function handleSummary() {

        if (apiResponse['answer']) {
            setLoadingSummary(false);
            setSummary(apiResponse['answer']);

        }

        else {
            try {

                setLoadingSummary(true); // Set loading state

                const formData = new FormData();
                formData.append('id', apiResponse['result'][0][0]);
                formData.append('query', apiResponse['query']);
                formData.append('keywords_query', apiResponse['keywords_query'])

                var requestOptions2 = {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Origin': `${IP_ADDRESS}`,
                    },

                };

                const response1 = await fetch(`${IP_ADDRESS}/findBook/getSummary`, requestOptions2)

                if (!response1.ok) {
                    throw new Error("failed"); // Handle errors gracefully
                }

                console.log(response1)

                const data1 = await response1.json();

                setSummary(data1['answer']);
            }
            catch (e) {
                console.log(e)
            }
            finally {
                setLoadingSummary(false); // Reset loading state
            }
        }
    }


    return (
        <div className="main-container6">
            <div className="nav">
                <NavbarMain />
            </div>
            <div className="search-div"><div className="searchbar">
                <div className="content">
                    <svg className="searchIcon" width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="0.328613" width="32" height="32" rx="16" fill="#6C70BF" />
                        <path d="M15.3286 22C19.1946 22 22.3286 18.866 22.3286 15C22.3286 11.134 19.1946 8 15.3286 8C11.4626 8 8.32861 11.134 8.32861 15C8.32861 18.866 11.4626 22 15.3286 22Z" stroke="white" stroke-width="2" />
                        <path d="M24.3286 24L21.3286 21" stroke="white" stroke-width="2" stroke-linecap="round" />
                    </svg>
                    <textarea className="text-area"
                        name="query" id="" onChange={e => setText_area(e.target.value)}

                        onClick={() => setIsFocused(true)}
                    //onBlur={() => setIsFocused(false)}

                    >

                        {textAreaValue}




                    </textarea>


                    {/* <div className="button-container">
                            <button type="submit" disabled={isLoading} onClick={handleButtonClick}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M11 18C14.866 18 18 14.866 18 11C18 7.13401 14.866 4 11 4C7.13401 4 4 7.13401 4 11C4 14.866 7.13401 18 11 18Z" stroke="white" stroke-width="2" />
                                    <path d="M20 20L17 17" stroke="white" stroke-width="2" stroke-linecap="round" />
                                </svg>

                                {isLoading ? "Searching...." : "Search"}
                            </button>
                        </div> */}





                    {/* <div className="genre">
                            <label htmlFor="genre">Genre</label>
                        </div> */}

                    {
                        loading && (
                            <ScaleLoader color="#424587" size={100} />
                        )
                    }

                </div>
                <div className="search-space-2">
                    <button className="primary" type="submit" disabled={loading} onClick={handleButtonClick}>

                        {loading ? "Searching" : "Search"}
                    </button>

                </div>
            </div>
            </div>

            <div className="container-result">
                <div className="filter">
                    <span className="Filter-Header">Filter</span>
                    <div className="filtercontent">



                        <div className="genre-filter">
                            <span className="genre-label">Genre:</span>
                            {genreList.map((genre) => (
                                <div key={genre} className="genre-checkbox" onClick={() => setFiltered(true)}>
                                    <input className="genre-items"
                                        type="checkbox"
                                        value={genre}
                                        checked={selectedGenres.includes(genre)}
                                        onChange={handleGenreChange}
                                    />
                                    <label htmlFor={genre}>{genre}</label>
                                </div>
                            ))}
                        </div>
                        <div className="year-filter">
                            <span className="year-label">Publishing Year:</span>
                            <div className="year-input"><input
                                type="number"
                                value={startYear}
                                min={1970}
                                max={endYear}
                                onChange={handleStartYearChange}
                            />
                                <span> - </span>
                                <input
                                    type="number"
                                    value={endYear}
                                    min={startYear}
                                    max={2024}
                                    onChange={handleEndYearChange}
                                /></div>
                        </div>







                    </div>
                </div>

                <div className="result-part">

                    <div className="result-show">
                        <span className="results-header">Results</span>
                        <div className="display">
                            {/* {apiResponse && apiResponse.result && ( // Check for both apiResponse and result */}



                            <ul className="search-result">
                                {/* Loop through each item in apiResponse.result */}
                                {/* {apiResponse.result.map((item, index) => ( */}
                                {filteredBooks &&
                                    filteredBooks.map((item, index) => (

                                        <li className="results-detail" key={index}>
                                            <div className="book-image">
                                                <svg width="99" height="123" viewBox="0 0 99 123" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4.90473 113.219H84.904L88.526 109.092L89.026 109.092V109.091L89.0309 5.46188C89.0309 3.18533 87.1805 1.33496 84.904 1.33496H4.90473C2.6282 1.33496 0.777832 3.18533 0.777832 5.46186V109.092C0.777832 111.368 2.6282 113.219 4.90473 113.219ZM80.7488 108.441H9.05015C7.11715 108.441 5.55015 106.874 5.55015 104.941L5.55004 9.61213C5.55004 7.67913 7.11704 6.11213 9.05004 6.11213H80.7533C82.6863 6.11213 84.2534 7.67923 84.2533 9.61229L84.2488 104.942C84.2487 106.874 82.6817 108.441 80.7488 108.441Z" fill="#6F72B7" stroke="#6F72B7" />
                                                    <path d="M11.7312 110.829V110.829L11.7263 119.044C11.7263 119.044 11.7263 119.044 11.7263 119.044M11.7312 110.829L98.4843 119.044C98.4795 121.039 96.8529 122.671 94.8525 122.671H14.8532C12.8528 122.671 11.2263 121.044 11.2263 119.044L11.7263 119.044M11.7312 110.829C11.7312 110.061 12.3521 109.44 13.1198 109.44C13.8875 109.44 14.5083 110.061 14.5085 110.828C14.5085 110.828 14.5085 110.829 14.5085 110.829L14.506 114.891C14.5045 117.377 16.5197 119.393 19.006 119.393H90.7023C93.1875 119.393 95.2022 117.379 95.2023 114.893L95.2067 19.5643C95.2069 17.0789 93.1921 15.064 90.7067 15.064H86.6424C85.8746 15.064 85.2537 14.4431 85.2537 13.6754C85.2537 12.9077 85.8747 12.2867 86.6424 12.2867H94.8575C96.5817 12.2867 97.9843 13.6894 97.9843 15.4136V119.042M11.7312 110.829L97.9843 119.042M11.7263 119.044C11.7265 120.768 13.1291 122.171 14.8532 122.171H94.8525C96.576 122.171 97.9802 120.763 97.9843 119.042M11.7263 119.044L97.9843 119.042" fill="#6F72B7" stroke="#6F72B7" />
                                                    <path d="M74.5087 69.5505H15.2988C14.2549 69.5505 13.4102 68.7057 13.4102 67.6618C13.4102 66.618 14.255 65.7732 15.2988 65.7732H74.5087C75.5525 65.7732 76.3973 66.618 76.3973 67.6618C76.3925 68.7057 75.5477 69.5505 74.5087 69.5505Z" fill="#BEC0E7" />
                                                    <path d="M74.5081 79.9361H48.6972C47.6534 79.9361 46.8086 79.0913 46.8086 78.0475C46.8086 77.0036 47.6534 76.1588 48.6972 76.1588H74.5081C75.552 76.1588 76.3968 77.0036 76.3968 78.0475C76.3919 79.0865 75.5471 79.9361 74.5081 79.9361Z" fill="#BEC0E7" />
                                                    <path d="M74.5081 90.3165H48.6972C47.6534 90.3165 46.8086 89.4717 46.8086 88.4278C46.8086 87.384 47.6534 86.5392 48.6972 86.5392H74.5081C75.552 86.5392 76.3968 87.384 76.3968 88.4278C76.3919 89.4717 75.5471 90.3165 74.5081 90.3165Z" fill="#BEC0E7" />
                                                    <path d="M74.5081 100.702H48.6972C47.6534 100.702 46.8086 99.8573 46.8086 98.8135C46.8086 97.7696 47.6534 96.9248 48.6972 96.9248H74.5081C75.552 96.9248 76.3968 97.7696 76.3968 98.8135C76.3919 99.8573 75.5471 100.702 74.5081 100.702Z" fill="#BEC0E7" />
                                                    <path d="M74.5087 59.1656H15.2988C14.2549 59.1656 13.4102 58.3208 13.4102 57.2769C13.4102 56.2331 14.255 55.3883 15.2988 55.3883H74.5087C75.5525 55.3883 76.3973 56.2331 76.3973 57.2769C76.3925 58.3208 75.5477 59.1656 74.5087 59.1656Z" fill="#BEC0E7" />
                                                    <path d="M74.5087 48.7799H15.2988C14.2549 48.7799 13.4102 47.935 13.4102 46.8912C13.4102 45.8474 14.255 45.0026 15.2988 45.0026H74.5087C75.5525 45.0026 76.3973 45.8474 76.3973 46.8912C76.3925 47.9351 75.5477 48.7799 74.5087 48.7799Z" fill="#BEC0E7" />
                                                    <path d="M74.5081 38.3996H48.6972C47.6534 38.3996 46.8086 37.5548 46.8086 36.511C46.8086 35.4671 47.6534 34.6223 48.6972 34.6223H74.5081C75.552 34.6223 76.3968 35.4671 76.3968 36.511C76.3919 37.55 75.5471 38.3996 74.5081 38.3996Z" fill="#BEC0E7" />
                                                    <path d="M74.5081 17.629H48.6972C47.6534 17.629 46.8086 16.7842 46.8086 15.7403C46.8086 14.6965 47.6534 13.8517 48.6972 13.8517H74.5081C75.552 13.8517 76.3968 14.6965 76.3968 15.7403C76.3919 16.7842 75.5471 17.629 74.5081 17.629Z" fill="#BEC0E7" />
                                                    <path d="M74.5081 28.0139H48.6972C47.6534 28.0139 46.8086 27.1691 46.8086 26.1252C46.8086 25.0814 47.6534 24.2366 48.6972 24.2366H74.5081C75.552 24.2366 76.3968 25.0814 76.3968 26.1252C76.3919 27.1691 75.5471 28.0139 74.5081 28.0139Z" fill="#BEC0E7" />
                                                    <path d="M39.9835 38.3999H15.3C14.2562 38.3999 13.4114 37.5551 13.4114 36.5113V15.9344C13.4114 14.8906 14.2562 14.0458 15.3 14.0458H39.9835C41.0274 14.0458 41.8722 14.8906 41.8722 15.9344V36.5063C41.8722 37.5502 41.0274 38.3999 39.9835 38.3999ZM17.1869 30.6237C17.1875 32.8323 18.9782 34.6225 21.1869 34.6225H34.0981C36.3077 34.6225 38.0987 32.8309 38.0981 30.6213L38.0955 21.8218C38.0949 19.6131 36.3042 17.8229 34.0955 17.8229H21.1843C18.9748 17.8229 17.1837 19.6145 17.1843 21.8241L17.1869 30.6237Z" fill="#BEC0E7" />
                                                    <path d="M39.9835 100.507H15.3C14.2562 100.507 13.4114 99.6617 13.4114 98.6179V78.046C13.4114 77.0021 14.2562 76.1573 15.3 76.1573H39.9835C41.0274 76.1573 41.8722 77.0022 41.8722 78.046V98.6179C41.8722 99.6569 41.0274 100.507 39.9835 100.507ZM17.188 92.7291C17.188 94.9382 18.9789 96.7291 21.188 96.7291H34.0992C36.3084 96.7291 38.0992 94.9382 38.0992 92.7291V83.9345C38.0992 81.7254 36.3084 79.9345 34.0992 79.9345H21.188C18.9789 79.9345 17.188 81.7254 17.188 83.9345V92.7291Z" fill="#BEC0E7" />
                                                </svg>
                                            </div>


                                            {/* Access and display properties of each item */}
                                            <span className="Title-name" onClick={() => handleTitleClick(item[0], item[1], item[2], item[5])}>{item[1]}</span>
                                            <span className="Author-name">{item[2]}</span>
                                            {/* <span className="Doc-type">{item[3]}</span> */}
                                            <span className="year-of-publish">{item[3]}</span>
                                            {/* <p>
                                                    Download Link:{" "}
                                                    <a href={item[4]}>{item[0] || item[1]}</a>
                                                </p> */}
                                        </li>
                                    ))}
                            </ul>
                            {/* )} */}
                        </div>
                    </div>
                </div>

                <div className="get-summary">
                    <span className="gts-title">Want a quick answer ?</span>
                    <span className="gts-subtitle">Get quick answerss for your queries in seconds</span>
                    <button className="button-glow btn"  onClick={handleSummary}>

                        {loadingSummary ? "Generating" : "Generate Answer"}
                        
                        {
                        loadingSummary &&
                        (
                            <div className="loading">
                                <HashLoader color="#8487E2" size={"25"} />
                            </div>)
                    }



                    </button>

                    <div className="answer">
                        {/* {summary} */}


                        {
                            showText && (
                                <div className="summary-text">
                                    {summary}
                                </div>
                            )
                        }

                        {isTyping && ( // Display summary only if available
                            <Typewriter
                                options={{
                                    autoStart: true, // Start animation only when isTyping is true
                                    delay: 20,
                                    strings: [summary],
                                    cursor: "",
                                    loop: 0, // Set loop to 0 to disable looping
                                }}
                            />
                        )
                        }



                    </div>

                    {/* {
                        loadingSummary &&
                        (
                            <div className="loading">
                                <BeatLoader color="#424587" />
                            </div>)
                    }
 */}



                </div>



            </div>
        </div>

    );
}