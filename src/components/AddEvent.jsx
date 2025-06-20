import React, { useState, useEffect } from "react";
import { database, storage } from "../firebase"; // Import storage
import { ref as dbRef, push, set } from "firebase/database";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { ref, onValue, get, remove } from 'firebase/database';
import { ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage"; // Import storage functions
import "./styles/AddEvent.css";

function AddEvent() {
    const [event, setEvent] = useState({
        eventid: "",
        eventname: "",
        date: "",
        time: "",
        poster: "", // Will store image URL after upload
        eventdes: "",
        cheif: "",
        location: "",
        filetype: "",
        createrid: "",
        creatername: "",
        profilepic: "",
    });

    const [user, setUser] = useState(null); // Store user data

    //user fetch
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

    const [file, setFile] = useState(null); // Store selected file
    const [uploading, setUploading] = useState(false); // Upload status

    // Handle text input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setEvent((prev) => ({ ...prev, [name]: value }));
    };

    // Handle file selection
    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    // Upload Image to Firebase Storage
    const uploadImage = async () => {
        if (!file) return null;

        setUploading(true);
        const imageRef = storageRef(storage, `eventPosters/${file.name}`);

        try {
            await uploadBytes(imageRef, file); // Upload image
            const downloadURL = await getDownloadURL(imageRef); // Get URL
            setUploading(false);
            return downloadURL;
        } catch (error) {
            console.error("🔥 Error uploading image:", error);
            setUploading(false);
            return null;
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            let imageUrl = event.poster;

            // If a file is selected, upload and get URL
            if (file) {
                imageUrl = await uploadImage();
            }

            const eventRef = dbRef(database, "posts");
            const newEventRef = push(eventRef);

            await set(newEventRef, { 
                ...event, 
                eventid: newEventRef.key,
                poster: imageUrl || "", // Save uploaded image URL
                createrid: user.userId,
                creatername:user.username,
                profilepic:user.profilePic,
            });

            alert("✅ Event added successfully!");
            setEvent({
                eventid: "",
                eventname: "",
                date: "",
                time: "",
                poster: "",
                eventdes: "",
                cheif: "",
                location: "",
                filetype: "",
                createrid: "",
                creatername: "",
                profilepic: "",
            });
            setFile(null);
        } catch (error) {
            console.error("🔥 Error adding event:", error);
            alert("❌ Failed to add event!");
        }
    };

    return (
        <div className="add-event-container">
            <h2 className="add-event-title">Add New Event</h2>
            <form onSubmit={handleSubmit} className="add-event-form">
                <input type="text" name="eventname" placeholder="Event Name" value={event.eventname} onChange={handleChange} required />
                <input type="date" name="date" placeholder="Date" value={event.date} onChange={handleChange} required />
                <input type="time" name="time" placeholder="Time" value={event.time} onChange={handleChange} required />
                
                {/* File Upload for Poster */}
                <input type="file" accept="image/*" onChange={handleFileChange} />
                
                {/* Show preview if file selected */}
                {file && <p>📂 Selected file: {file.name}</p>}
                
                <textarea name="eventdes" placeholder="Event Description" value={event.eventdes} onChange={handleChange} required />
                <input type="text" name="cheif" placeholder="Chief Guest" value={event.cheif} onChange={handleChange} required />
                <input type="text" name="location" placeholder="Location" value={event.location} onChange={handleChange} required />

                <button type="submit" className="submit-button" disabled={uploading}>
                    {uploading ? "Uploading..." : "Add Event"}
                </button>
            </form>
        </div>
    );
}

export default AddEvent;
