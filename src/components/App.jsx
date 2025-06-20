import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage';
import UserDashboard from './UserDashboard';
import OrganizerDashboard from './OrganizerDashboard';
import EventDetails from './EventDetails';
import RSVP from './RSVP';
import AddEvent from './AddEvent';
import ProfilePage from './ProfilePage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/user-dashboard" element={<UserDashboard />} />
                <Route path="/organizer-dashboard" element={<OrganizerDashboard />} />
                <Route path="/event-details/:id" element={<EventDetails />} />
                <Route path='/RSVP' element = {<RSVP/>}/>
                <Route path="/add-event" element={<AddEvent />} />
                <Route path="/dashboard/profile" element={<ProfilePage />} />
            </Routes>
        </Router>
    );
}

export default App;
