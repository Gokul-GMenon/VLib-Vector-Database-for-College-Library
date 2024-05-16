
import React from "react";
import Navbar from "../../components/navbar";
import NavbarMain from "../../components/navbar-main";
import "./view.css";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { BlobProvider, Document, Page, pdfjs } from '@react-pdf/renderer';
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
//import { useHistory } from 'react-router-dom';



import 'viewerjs/dist/viewer.css';
import Viewer from 'viewerjs';


export default function PdfView() {
    const history = useNavigate();
    const location = useLocation();
    const { pdfDataURL, pdfData, bookDetails } = location.state || {};

    const [isLoading, setIsLoading] = useState(false);
    const [downloadError, setDownloadError] = useState(null);

    const [blobURL, setBlobURL] = useState(null);
    const [pdfFile, setPdfFile] = useState(null);
    const [pdfDocument, setPdfDocument] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);

    console.log(pdfDataURL.length)
    console.log("pdf data ", pdfData)
    console.log(pdfData.size)

    const pdfViewerRef = useRef(null);
    const [pdfBlobUrl, setPdfBlobUrl] = useState(null);




    useEffect(() => {
        const fetchPdf = async () => {
            if (pdfData) {
                setIsLoading(true);
                try {
                    // Convert binary data to Blob object
                    const blob = new Blob([pdfData], { type: 'application/pdf' });

                    // Generate Blob URL
                    const blobUrl = URL.createObjectURL(blob);
                    setPdfBlobUrl(blobUrl);
                    console.log("blob url : ", blobUrl)


                } catch (error) {
                    console.error('Error fetching PDF:', error);
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchPdf();

        // Clean up Blob URL when component unmounts
        return () => {
            if (pdfBlobUrl) {
                URL.revokeObjectURL(pdfBlobUrl);
            }
        };
    }, [pdfData]);

    useEffect(() => {
        if (pdfBlobUrl && pdfViewerRef.current) {
            // Render PDF using Viewer.js
            const viewer = new Viewer(pdfViewerRef.current, {
                url: pdfBlobUrl,
            });

            return () => {
                viewer.destroy();
            };
        }
    }, [pdfBlobUrl]);


    // useEffect(() => {
    //     const fetchPdf = async () => {
    //       if (pdf_url) {
    //         setIsLoading(true);
    //         try {
    //           const response = await fetch(pdf_url);

    //           console.log(response.url)
    //           if (response.ok) {
    //             const blob = await response.blob();
    //             const url = window.URL.createObjectURL(blob);
    //             setBlobURL(url);
    //             setPdfFile(url); // Set pdfFile for rendering
    //           } else {
    //             throw new Error("Failed to fetch PDF");
    //           }
    //         } catch (error) {
    //           console.error("Error fetching PDF:", error);
    //           setDownloadError(error.message);
    //         } finally {
    //           setIsLoading(false);
    //         }
    //       }
    //     };

    //     fetchPdf();
    //   }, [pdf_url]);




    const handleDownloadClick = async () => {
        if (pdfDataURL) {
            setIsLoading(true);

            const filename = `book-${bookDetails?.id || "unknown"}.pdf`;

            try {
                const response = await fetch(pdfDataURL, {
                    method: "GET",
                    responseType: "blob",
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const url = window.URL.createObjectURL(blob);

                    const link = document.createElement("a");
                    link.href = url;
                    link.download = filename;
                    link.click();

                    window.URL.revokeObjectURL(url);
                } else {
                    throw new Error("Failed to download PDF");
                }
            } catch (error) {
                setDownloadError(error.message);
                console.error("Download error:", error);
            } finally {
                setIsLoading(false);
            }
        }
    };


    const handleBack = () => {
        history(-1); // Use useHistory to navigate back
      };


    return (
        <div className="main-container-pdfview">
            <div className="nav-container">
                <NavbarMain />
            </div>
        <div className="back-btn" onClick={handleBack}>
        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9.55663 16.6667L17.2793 24.3894L16.3286 25.3334L6.9953 16.0001L16.3286 6.66675L17.2793 7.61075L9.55663 15.3334H25.662V16.6667H9.55663Z" fill="#2C2D3C"/>
</svg>

            <span>Back</span>
        </div>
            <div className="pdf-view-container">
                <div className="pdf-preview" ref={pdfViewerRef} >

                    {/* {pdfFile && (
                        <Document file={pdfFile}>
                            <Page size="A4" />
                        </Document>
                    )}

                    {!pdfFile && (
                        <div className="no-preview">
                            <h2>No PDF Preview Available</h2>
                            <p>The PDF preview could not be loaded.</p>
                        </div>
                    )} */}

                    {pdfBlobUrl ? (
                        <embed className="embed-pdf"src={pdfBlobUrl} type="application/pdf" width="60%" height="600px"/>
                    ) : (
                        <p>PDF data is missing.</p>
                    )}

                    


                </div>

                <div className="pdf-details">
                    {pdfDataURL ? (
                        <div className="details">
                            {isLoading && <p>Downloading PDF...</p>}
                            {downloadError && <p>Error downloading PDF: {downloadError}</p>}

                           

                            <div className="book-details">
        
                                <ul>
                                    {/* <li>ID: {bookDetails?.id || "NA"}</li> */}
                                    <li className="Title-book"> {bookDetails?.title || "NA"}</li>
                                    <li className="author">{bookDetails?.author || "NA"}</li>
                                    {/* Add other details as needed */}
                                </ul>
                            </div> 
                            <button className="primary btn" type="button" onClick={handleDownloadClick} disabled={isLoading}>
                            <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M16.3286 22.0002V5.00024M9.32861 16.0002L16.3286 23.0002L23.3286 16.0002M9.32861 27.0002H23.3286" stroke="#FCFDFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
Download PDF
                            </button>
                        </div>
                    ) : (
                        <div className="no-pdf">
                            <h2>Couldn't retrieve PDF</h2>
                            <p>There might be an issue fetching the PDF. Please try again.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
