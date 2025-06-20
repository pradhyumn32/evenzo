import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./styles/EventDetails.css";

function EventDetails() {
    const location = useLocation();
    const navigate = useNavigate();
    const { eventid, eventname, src, eventdes } = location.state || {};

    console.log("Event Data from location.state:", location.state);

    const handleRSVP = () => {
        navigate("/rsvp", { state: { eventname } });
    };

    if (!eventname) {
        return <p>No event details available.</p>;
    }

    return (
        <div className="event-details-container">
            <div className="event-card">
                <img className="event-image" src={src} alt={eventname} />
                <div className="event-content">
                    <h1 className="event-title">{eventname}</h1>
                    <p className="event-description">{eventdes}</p>
                    <button className="back-button" onClick={() => navigate(-1)}>⬅️ Go Back</button>
                    <button className="back-button"
                     onClick={handleRSVP}>Attend the event</button>
                </div>
            </div>
        </div>
    );
}

export default EventDetails;
