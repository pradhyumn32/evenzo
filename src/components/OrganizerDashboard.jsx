import React, { useState, useEffect } from "react";
import './styles/UserDashboard.css';
import { auth, database } from './../firebase.js';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onValue, get, remove } from 'firebase/database'; // Import remove
import { useNavigate } from 'react-router-dom';
import Note from './Note.jsx';
import logo from './../logo.jpg';
import icon from './../285645_user_icon.png';

function OrganizerDashboard() {
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [events, setEvents] = useState([]);
    const [user, setUser] = useState(null);

    // Logout function
    const handleLogout = async () => {
        await auth.signOut();
        navigate('/');
    };

    // Fetch events from Firebase
    useEffect(() => {
        const eventsRef = ref(database, 'posts/');

        // Listen for event changes
        onValue(eventsRef, (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const eventList = Object.keys(data).map((key) => ({
                    eventid: key,
                    ...data[key],
                }));
                setEvents(eventList);
            } else {
                setEvents([]);
            }
        });
    }, []);

    // Fetch user details
    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            if (currentUser) {
                const userRef = ref(database, `users/${currentUser.uid}`);
                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setUser(snapshot.val());
                    }
                } catch (error) {
                    console.error("🔥 Error fetching user data:", error);
                }
            } else {
                setUser(null);
            }
        });

        return () => unsubscribe(); // Cleanup
    }, []);

    // Delete event from Firebase
    const handleDelete = async (eventid) => {
        const eventRef = ref(database, `posts/${eventid}`);

        try {
            await remove(eventRef); // Delete event
            setEvents((prevEvents) => prevEvents.filter((event) => event.eventid !== eventid)); // Update UI
            alert("✅ Event deleted successfully!");
        } catch (error) {
            console.error("🔥 Error deleting event:", error);
            alert("❌ Failed to delete event!");
        }
    };

    // Filter events based on search term
    const filteredEvents = events.filter((event) =>
        event.eventname.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.eventdes.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <img src={logo} alt='logo' />
                <input
                    className='search'
                    type="text"
                    placeholder="Search events..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />

                <nav className="nav-tabs">
                    <button onClick={() => navigate('/dashboard')}>Home</button>
                    <button onClick={() => navigate('/add-event')}>Add Event</button>
                    <button onClick={() => navigate('/dashboard/profile')}>Profile</button>
                </nav>

                {/* User Dropdown */}
                <div className="user-panel">
                    <button onClick={() => setShowDropdown(!showDropdown)}>
                        <img src={icon} alt="User Icon" />
                    </button>
                    {showDropdown && (
                        <div className="dropdown-menu">
                            <p>{user?.username}</p>
                            <p>{user?.email}</p>
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
                            <div key={event.eventid} className="event-card">
                                <Note
                                    eventname={event.eventname}
                                    src={event.poster}
                                    eventdes={event.eventdes}
                                />
                                <button className="delete-button" onClick={() => handleDelete(event.eventid)}>
                                    ❌ Delete
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No events found.</p>
                    )}
                </div>
            </main>
        </div>
    );
}

export default OrganizerDashboard;
