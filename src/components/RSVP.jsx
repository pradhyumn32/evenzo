import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ref, query, orderByChild, equalTo, get } from "firebase/database";
import { database } from "../firebase";
import "./styles/RSVP.css"; // Import the new CSS file

function RSVP() {
    const location = useLocation();
    const { eventname } = location.state || {};
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        console.log("🔍 RSVP: Event name received: ", eventname);
        if (!eventname) return;

        const fetchEventDetails = async () => {
            try {
                const eventRef = ref(database, "posts");
                const eventQuery = query(eventRef, orderByChild("eventname"), equalTo(eventname));
                
                const snapshot = await get(eventQuery);

                if (snapshot.exists()) {
                    const events = snapshot.val();
                    const eventList = Object.entries(events).map(([id, data]) => ({
                        id,
                        ...data,
                    }));
                    setEventData(eventList[0]); // Assuming the first match
                } else {
                    console.warn("❌ Event not found for:", eventname);
                }
            } catch (error) {
                console.error("🔥 Error fetching event data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEventDetails();
    }, [eventname]);

    if (loading) return <p>Loading event details...</p>;
    if (!eventData) return <p>Event not found.</p>;

    return (
        <div className="rsvp-container">
            <h1>RSVP for {eventData.eventname}</h1>
            <img src={eventData.poster} alt={eventData.eventname} />
            <div className="rsvp-details">
                <p><strong>Date:</strong> {eventData.date}</p>
                <p><strong>Time:</strong> {eventData.time}</p>
                <p><strong>Location:</strong> {eventData.location}</p>
                <p><strong>Description:</strong> {eventData.eventdes}</p>
                <p><strong>Organizer:</strong> {eventData.creatername}</p>
                {/* <img src={eventData.profilepic} alt={eventData.creatername} /> */}
            </div>
            <button className="rsvp-button">Confirm RSVP</button>
        </div>
    );
}

export default RSVP;
