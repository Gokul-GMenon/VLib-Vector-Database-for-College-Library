import React from "react";
import './styles.css';
import PdfUpload from "../../components/pdf-upload";
import RecentUpdates from "../../components/recent-updates";



export default function AdminPdfUpload() 
{

    return <div className="pdf-upload">
            <PdfUpload />   
            <RecentUpdates/>                
            
    </div>
}