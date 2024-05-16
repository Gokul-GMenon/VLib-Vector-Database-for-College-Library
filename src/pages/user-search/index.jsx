import React from "react";
import NavbarMain from "../../components/navbar-main";
import "./styles.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IP_ADDRESS from "../consts";


export default function UserSearch() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const [text_area, setText_area] = useState('');
    const [genre, setGenre] = useState('');

    const navigate = useNavigate();

    const genre_list=[];



    async function handleOnSubmit(event) {
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

            // console.log("genre is :  ",data['genre']);
            genre_list.push(data['genre']);
            

            


            navigate("/results", {
                state: {
                    apiResponse: data,
                    textAreaValue: text_area,
                },
            });
        }

        catch (error) {
            console.error(error);
            setError('Error submitting form.');
            <h1>Error Occurred</h1>

            setLoading(false); // Reset loading state

        }

        finally {
            setLoading(false); // Reset loading state
        }


    }




    return (

        <div className="MainContainer">
            <div>
                <NavbarMain />
            </div>

            <div className="container4">
                <h1 className="Hero-header">No more keywords.<br></br>
                    Search whatever you like.</h1>

                <div className="search-space">
                    <form onSubmit={handleOnSubmit}>
                        <div className="search-space-1">
                            <div className="content">
                                <svg className="searchIcon" width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect x="0.328613" width="32" height="32" rx="16" fill="#6C70BF" />
                                    <path d="M15.3286 22C19.1946 22 22.3286 18.866 22.3286 15C22.3286 11.134 19.1946 8 15.3286 8C11.4626 8 8.32861 11.134 8.32861 15C8.32861 18.866 11.4626 22 15.3286 22Z" stroke="white" stroke-width="2" />
                                    <path d="M24.3286 24L21.3286 21" stroke="white" stroke-width="2" stroke-linecap="round" />
                                </svg>
                                <textarea className="text-area" placeholder="I want to know more about Artificial Intelligence..." onChange={e => setText_area(e.target.value)}></textarea>
                            </div>
                            {/* <div className="genre">
                                <label htmlFor="genre">Genre</label>
                                <input className="genre-input" type="text" placeholder="Type genres you are searching for(optional)" onChange={e => setGenre(e.target.value)} />
                            </div> */}

                            <div className="search-space-2">
                                <button className="primary" type="submit" disabled={loading}>

                                    {loading ? "Searching" : "Search"}
                                </button>
                            </div>
                        </div>
                    </form>



                </div>
            </div>
        </div>

    )
}