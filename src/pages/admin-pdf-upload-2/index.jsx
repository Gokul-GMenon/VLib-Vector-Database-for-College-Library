import React from "react";
import Navbar from "../../components/navbar";
import './styles.css';
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import IP_ADDRESS from "../consts";
import { BarLoader, CircleLoader, ClipLoader, RingLoader } from "react-spinners";

export default function AdminPdfUpload2() {

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filename, setfilename] = useState('Chose File');
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [year, setYear] = useState('');
    const [type, setType] = useState('');
    const [genre, setGenre] = useState('');
    const [file, setfile] = useState('');


    const [backgroundFade, setBackgroundFade] = useState(false);

    const navigate = useNavigate();

    const change = (e) => {
        setfile(e.target.files[0]);
        setfilename(e.target.files[0].name);
    }

    async function handleSubmit(event) {
        event.preventDefault(); // Prevent default form submission

        setLoading(true); // Set loading state

        const formData = new FormData();
        formData.append('file', file);

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

    useEffect(() => {
        // Update background fade based on loading state
        setBackgroundFade(loading);
    }, [loading]);


    return (
        <div className={`main-container ${backgroundFade ? "fade" : ""}`}>
            <div>
                <Navbar />
            </div>

            {/* {
                loading && (

                    <div className="overlay">

                        <div class="AnimationBox">
                            <div class="star">
                                <svg class="star1" width="33" height="34" viewBox="0 0 33 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M16.3474 0.943359V0.943359C18.5816 8.8037 24.7253 14.9475 32.5857 17.1816V17.1816V17.1816C24.7253 19.4158 18.5816 25.5595 16.3474 33.4199V33.4199V33.4199C14.1132 25.5595 7.96948 19.4158 0.109131 17.1816V17.1816V17.1816C7.96948 14.9475 14.1132 8.8037 16.3474 0.943359V0.943359Z" fill="#797DD5" />
                                </svg>
                            </div>
                            <div class="book"> <svg class="book" width="89" height="119" viewBox="0 0 89 119" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="10.5793" y="3.16602" width="75.2194" height="104.774" rx="5.5" stroke="#DAE2FF" stroke-width="5" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M74.6782 24.2559H8.07946V33.805H74.6782V24.2559ZM74.6781 47.0981H8.07935V56.6473H74.6781V47.0981ZM8.07935 69.9404H74.6781V79.4895H8.07935V69.9404ZM74.6781 92.7827H8.07935V102.332H74.6781V92.7827Z" fill="url(#paint0_linear_607_682)" />
                                <rect x="0.808105" y="8.90625" width="79.2194" height="108.774" rx="7.5" fill="url(#paint1_linear_607_682)" stroke="#DAE2FF" />
                                <path fill-rule="evenodd" clip-rule="evenodd" d="M74.6782 29.0294C74.6782 26.3925 72.5405 24.2549 69.9036 24.2549H12.854C10.2171 24.2549 8.07946 26.3925 8.07946 29.0294V29.0294C8.07946 31.6664 10.2171 33.804 12.854 33.804H69.9036C72.5405 33.804 74.6782 31.6664 74.6782 29.0294V29.0294ZM74.6781 51.8717C74.6781 49.2348 72.5404 47.0972 69.9035 47.0972H12.8539C10.217 47.0972 8.07935 49.2348 8.07935 51.8717V51.8717C8.07935 54.5086 10.217 56.6463 12.8539 56.6463H69.9035C72.5404 56.6463 74.6781 54.5086 74.6781 51.8717V51.8717ZM8.07935 74.714C8.07935 72.0771 10.217 69.9394 12.8539 69.9394H69.9035C72.5404 69.9394 74.6781 72.0771 74.6781 74.714V74.714C74.6781 77.3509 72.5404 79.4886 69.9035 79.4886H12.8539C10.217 79.4886 8.07935 77.3509 8.07935 74.714V74.714ZM74.6781 97.5563C74.6781 94.9194 72.5404 92.7817 69.9035 92.7817H12.8539C10.217 92.7817 8.07935 94.9194 8.07935 97.5563V97.5563C8.07935 100.193 10.217 102.331 12.8539 102.331H69.9035C72.5404 102.331 74.6781 100.193 74.6781 97.5563V97.5563Z" fill="url(#paint2_linear_607_682)" />
                                <defs>
                                    <linearGradient id="paint0_linear_607_682" x1="8.07935" y1="102.727" x2="74.6781" y2="102.727" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#EFEFFF" />
                                        <stop offset="1" stop-color="#D3D2FF" />
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_607_682" x1="40.4178" y1="8.40625" x2="40.4178" y2="118.18" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#7073CA" />
                                        <stop offset="1" stop-color="#8487E2" />
                                    </linearGradient>
                                    <linearGradient id="paint2_linear_607_682" x1="8.07935" y1="102.726" x2="74.6781" y2="102.726" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#EFEFFF" />
                                        <stop offset="1" stop-color="#D3D2FF" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            </div>
                            <div class="star down">
                                <svg class="star2" width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M9.59485 0.84668V0.84668C10.7986 5.08182 14.1089 8.39206 18.344 9.59583V9.59583V9.59583C14.1089 10.7996 10.7986 14.1098 9.59485 18.345V18.345V18.345C8.39109 14.1098 5.08084 10.7996 0.845703 9.59583V9.59583V9.59583C5.08084 8.39206 8.39109 5.08182 9.59485 0.84668V0.84668Z" fill="#797DD5" />
                                </svg>
                            </div>
                        </div>

                    </div>
                )
            } */}

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
                                <input type="text" id="book-name" name="book-name" placeholder="Name of the Book" onChange={e => setTitle(e.target.value)} />
                                <br />

                                <label htmlFor="author-name">Author Name</label>
                                <br />
                                <input type="text" id="author-name" name="author-name" placeholder="Name of the Author" onChange={e => setAuthor(e.target.value)} />
                                <br />

                                <label htmlFor="publish-year">Publish Year</label>
                                <br />
                                <input type="text" id="publish-year" name="publish-year" placeholder="Year of the Publishing" onChange={e => setYear(e.target.value)} />
                                <br />

                                <label htmlFor="type-of-doc">Type Of Doc</label>
                                <br />
                                <input type="drop-down" id="type-of-doc" name="type-of-doc" placeholder="Type of doc" onChange={e => setType(e.target.value)} />
                                <br />

                                <label htmlFor="genre">Genre</label>
                                <br />
                                <input type="text" id="genre" name="genre" placeholder="Genre" onChange={e => setGenre(e.target.value)} />
                                <br />
                            </div>

                            {/* <PdfUpload setFormData={setFormData} /> */}

                            <div className="upload">
                                <div className="drag-and-drop">
                                    <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.1714 17.3333H20.1714M12.1714 12H17.5047M12.1714 22.6667H17.5047" stroke="#B7B4FD" stroke-width="2.66667" stroke-linecap="round" />
                                        <path d="M25.5047 17.3333V20C25.5047 23.7707 25.5047 25.6573 24.3327 26.828C23.162 28 21.2754 28 17.5047 28H14.838C11.0674 28 9.18071 28 8.01004 26.828C6.83804 25.6573 6.83804 23.7707 6.83804 20V12C6.83804 8.22933 6.83804 6.34267 8.01004 5.172C9.18071 4 11.0674 4 14.838 4" stroke="#B7B4FD" stroke-width="2.66667" />
                                        <path d="M24.1714 4V12M28.1714 8H20.1714" stroke="#B7B4FD" stroke-width="2.66667" stroke-linecap="round" />
                                    </svg>
                                    <span className="drag-label">Drag & drop your books here</span>
                                </div>
                                <div className="or">or</div>

                                <div className="upload-button">
                                    <input type="file" id="file" name="file" accept=".pdf" className="file" onChange={change} />
                                </div>

                            </div>

                            <button type="submit" disabled={loading}>
                                {loading ? "Uploading...." : "Upload Book"}

                            </button>



                        </form>

                        {/* {
                            loading && (
                                <div className="loader">
                                    <RingLoader color={"#424587"} loading={loading} size={50} />
                                </div>
                            )
                        } */}
                    </div>

                </div>


            </div>
        </div>

    )
}