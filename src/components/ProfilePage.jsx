import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { ref, get, update } from 'firebase/database';
import { database } from './../firebase';
import './styles/ProfilePage.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const [userData, setUserData] = useState({ username: '', email: '' });
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const auth = getAuth();

        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                const userRef = ref(database, `users/${user.uid}`);
                try {
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setUserData(snapshot.val());
                    } else {
                        console.warn("User data not found");
                    }
                } catch (error) {
                    console.error("Error fetching user data:", error);
                }
            } else {
                navigate('/');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserData({ ...userData, [name]: value });
    };

    const handleSave = async () => {
        const auth = getAuth();
        const user = auth.currentUser;

        if (user) {
            try {
                await update(ref(database, `users/${user.uid}`), userData);
                alert("Profile updated successfully!");
                setIsEditing(false);
            } catch (error) {
                console.error("Error updating profile:", error);
            }
        }
    };

    return (
        <div className="profile-container">
            <h1>Your Profile</h1>

            <img src={userData.profilepic} alt="Profile" />

            <div className="profile-form">
                <label>Username:</label>
                {isEditing ? (
                    <input
                        type="text"
                        name="username"
                        value={userData.username}
                        onChange={handleInputChange}
                    />
                ) : (
                    <p>{userData.username}</p>
                )}

                <label>Email:</label>
                <p>{userData.email}</p>
                <label>Organization:</label>
                <p>{userData.org}</p>
                <label>Role:</label>
                <p>{userData.role}</p>
                <label>Address:</label>
                <p>{userData.address}</p>
            </div>

            <div className="button-container">
                {isEditing ? (
                    <button onClick={handleSave}>Save Changes</button>
                ) : (
                    <button className='edit-button' onClick={() => setIsEditing(true)}>Edit Profile</button>
                )}

                <button className='save-button' onClick={() => navigate(-1)}>Back to Dashboard</button>
            </div>
            <button className='logout-button' onClick={() => navigate('/')}>Log Out</button>
        </div>
    );
};

export default ProfilePage;
