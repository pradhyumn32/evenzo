import React, { useState, useEffect } from 'react';
import './styles/UserDashboard.css';
import { auth, database } from './../firebase.js';
import { ref, onValue } from 'firebase/database';
import { useNavigate } from 'react-router-dom';
import Note from './Note.jsx';
import logo from './../logo.jpg';
import icon from './../285645_user_icon.png';

function UserDashboard() {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState([]);

    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    };

    // Sample event data (replace with your dynamic data from Firebase)
    useEffect(() => {
        const eventsRef = ref(database, 'posts/');

        console.log("Fetching events from:", eventsRef);

        // Fetch event data from Firebase
        onValue(eventsRef, (snapshot) => {
            console.log("Snapshot exists? ", snapshot.exists());
            console.log("Snapshot value: ", snapshot.val());

            if (snapshot.exists()) {
                const data = snapshot.val();

                // Convert object to array for rendering
                const eventList = Object.keys(data).map((key) => ({
                    id: key,
                    ...data[key],
                }));

                console.log("Processed event list: ", eventList);
                setEvents(eventList);
            } else {
                console.log("No events found");
                setEvents([]);
            }
        });
    }, []);

    // Filter events based on the search term
    const filteredEvents = events.filter((event) =>
        event.eventname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventdes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                {/* Navigation Tabs */}
                <img src={logo} alt='logo' />

                {/* Search Bar */}
                <input
                    className='search'
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <nav className="nav-tabs">
                    <button onClick={() => navigate('/dashboard')}>Home</button>
                    <button onClick={() => navigate('/dashboard/myevents')}>My Events</button>
                    <button onClick={() => navigate('/dashboard/profile')}>Profile</button>
                </nav>

                {/* User Panel with Dropdown */}
                <div className="user-panel">
                    <button onClick={() => setShowDropdown(!showDropdown)}><img src={icon}/></button>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <p>User Name</p>
                            <p>Email@example.com</p>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    )}
                </div>
            </header>

            <main className="dashboard-content">
                <h1>Find your nearby events.</h1>

                <div className='event-notes'>
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                            <Note
                                key={event.eventid}
                                eventname={event.eventname}
                                src={event.poster}
                                eventdes={event.eventdes}
                            />
                        ))
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default UserDashboard;
