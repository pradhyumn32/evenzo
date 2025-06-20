import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Note.css";

function Note({ eventid, eventname, src, eventdes }) {
    const navigate = useNavigate();

    const handleDetails = () => {
        navigate(`/event-details/${eventid}`, {
            state: { eventid, eventname, src, eventdes }
        });
    };

    return (
        <div className="note">
            <h1>{eventname}</h1>
            <img src={src} alt={eventname} />
            <p>{eventdes}</p>
            <button onClick={handleDetails}>Details</button>
        </div>
    );
}

export default Note;
