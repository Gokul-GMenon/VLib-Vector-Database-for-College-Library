import React from "react";
import './styles.css';

export default function RecentUpdates()
{


    return (
    <div className="container1">
        <div className="recent-updates">
            Recent Updates
        </div>

        <div className="book-details">
            <div className="detail">
                <div className="book-name">Book name</div> 
                <div className="changes">New book added</div>
            </div>
            <div className="detail">
                <div className="book-name">Book name</div> 
                <div className="changes">Details updated</div>
            </div>
            <div className="detail">
                <div className="book-name">Book name</div> 
                <div className="changes">New book added</div>
            </div>
            <div className="detail">
                <div className="book-name">Book name</div> 
                <div className="changes">Details updated</div>
            </div>


        </div>
        

    </div>
    )
}