import React from "react";
import Navbar from "../../components/navbar";
import './styles.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import IP_ADDRESS from "../consts";

export default function AdminPdfUpload2() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filename,setfilename]=useState('Chose File');
    const [title,setTitle]=useState('');
    const [author,setAuthor]=useState('');
    const [year,setYear]=useState('');
    const [type,setType]=useState('');
    const [genre,setGenre]=useState('');
    const [file,setfile]=useState('');

    const navigate = useNavigate();

    const change = (e) => {
        setfile(e.target.files[0]);
        setfilename(e.target.files[0].name);
    }

    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        setLoading(true); // Set loading state

        const formData = new FormData();
        formData.append('file',file);
    
        try {

            // var metaData = {
            //     "title": title,
            //     "author": author,
            //     "year": year,
            //     "type": type,
            //     "genre": genre,
            // };
            // formData.append('metadata', metaData);
            formData.append('title', title);
            formData.append('author', author);
            formData.append('year', year);
            formData.append('genre', genre);
            formData.append('type', type);

            var requestOptions = {
                method: 'POST',
                body: formData, 
                headers: {
                    'Origin': `${IP_ADDRESS}` // Replace with your React app's origin
                  },
                // redirect: 'follow'
            };

            const response1 = await fetch(`${IP_ADDRESS}/addBook`, requestOptions)
            // .then(response => response.text())
            // .then(result => console.log(result))
            // .catch(error => console.log('error', error));


            // const response1 = await fetch("http://192.168.1.75:8000/addBook", {
            //     method: "POST",
            //     data: {
            //         "title": title,
            //         "author":author,
            //         "year"  :year,
            //         "type"  :type,
            //         "genre" :genre,
            //     },
            //     headers: {
            //         "Content-Type": "application/json",
            //     },

            // });

            console.log("successs")
            const data = await response1.text();
            console.log("successs")
            console.log(data);
            // Handle successful response (redirect, etc.)

            if (data) {
                navigate("/upload-success")
            }

        } catch (error) {
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
        <div className="main-container">
            <div>
                <Navbar />
            </div>

            <div className="container">

                <div className="add-details">
                    <div className="heading">
                        <div className="heading-title">
                            Add a new  book
                        </div>
                        <div className="heading-subheading">
                            Uploading books you want to add to library
                        </div>

                    </div>
                    <div className="details">
                        <form onSubmit={handleSubmit}>
                            <div className="form-textfield">

                                <label htmlFor="book-name">Book Name</label>
                                <br />
                                <input type="text" id="book-name" name="book-name" placeholder="Name of the Book" onChange={e=>setTitle(e.target.value)} />
                                <br />

                                <label htmlFor="author-name">Author Name</label>
                                <br />
                                <input type="text" id="author-name" name="author-name" placeholder="Name of the Author" onChange={e=>setAuthor(e.target.value)}/>
                                <br />

                                <label htmlFor="publish-year">Publish Year</label>
                                <br />
                                <input type="text" id="publish-year" name="publish-year" placeholder="Year of the Publishing" onChange={e=>setYear(e.target.value)}/>
                                <br />

                                <label htmlFor="type-of-doc">Type Of Doc</label>
                                <br />
                                <input type="drop-down" id="type-of-doc" name="type-of-doc" placeholder="Type of doc" onChange={e=>setType(e.target.value)}/>
                                <br />

                                <label htmlFor="genre">Genre</label>
                                <br />
                                <input type="text" id="genre" name="genre" placeholder="Genre" onChange={e=>setGenre(e.target.value)}/>
                                <br />
                            </div>

                            {/* <PdfUpload setFormData={setFormData} /> */}

                            <div className="upload">
                                <div className="drag-and-drop">
                                <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.1714 17.3333H20.1714M12.1714 12H17.5047M12.1714 22.6667H17.5047" stroke="#B7B4FD" stroke-width="2.66667" stroke-linecap="round"/>
<path d="M25.5047 17.3333V20C25.5047 23.7707 25.5047 25.6573 24.3327 26.828C23.162 28 21.2754 28 17.5047 28H14.838C11.0674 28 9.18071 28 8.01004 26.828C6.83804 25.6573 6.83804 23.7707 6.83804 20V12C6.83804 8.22933 6.83804 6.34267 8.01004 5.172C9.18071 4 11.0674 4 14.838 4" stroke="#B7B4FD" stroke-width="2.66667"/>
<path d="M24.1714 4V12M28.1714 8H20.1714" stroke="#B7B4FD" stroke-width="2.66667" stroke-linecap="round"/>
</svg>
                                    <span className="drag-label">Drag & drop your books here</span>
                                </div>
                                <div className="or">or</div>

                                <div className="upload-button">
                                    <input type="file" id="file" name="file" accept=".pdf" className="file" onChange={change}/>
                                </div>

                            </div>

                            <button type="submit" disabled={loading}>
                                {loading ? "Uploading...." : "Upload Book"}
                            </button>

                        </form>

                    </div>

                </div>


            </div>
        </div>

    )
}