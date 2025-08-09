import React, { useState, useEffect, useContext } from 'react';
import './DoctorDashboard.css';
import PatientBookings from './PatientBookings';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../../store/AuthContext';

const BASE_URL = 'http://clinicdev.runasp.net/api';
const token = localStorage.getItem('token');

const DoctorDashboard = () => {
  const [slots, setSlots] = useState([]);
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [date, setDate] = useState('');
  const [startTime, setTime] = useState('');
  const [sessionDuration, setSessionTime] = useState('');
  const [maxPatients, setMaxPatients] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [activePage, setActivePage] = useState('slots');

  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(() => {
    fetchDoctorInfo();
    fetchSlots();
  }, []);


  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const fetchDoctorInfo = async () => {
    try {
      const res = await fetch(`${BASE_URL}/Doctors/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setDoctorInfo(data);
    } catch (err) {
      console.error('Failed to fetch doctor info:', err);
    }
  };

  const fetchSlots = async () => {
    try {
      const res = await fetch(`${BASE_URL}/DoctorSlots`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      setSlots(data);
    } catch (err) {
      console.error('Failed to fetch slots:', err);
    }
  };

  const addOrEditSlot = async () => {
    
    if (!date || !startTime || !sessionDuration || !maxPatients) return;
    console.log();
    const slotData = {
      date,
      time: startTime ,
      sessionMinutes: parseInt(sessionDuration.substring(3,5)),
      maxPatients: parseInt(maxPatients),
      isActive: true,
    };


    try {

      let response;


      if (editingId !== null) {
        response = await fetch(`${BASE_URL}/DoctorSlots/${editingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(slotData),
        });
      } else {
        slotData.time = `${startTime}:00`;
        slotData.sessionMinutes = parseInt(sessionDuration);
        response = await fetch(`${BASE_URL}/DoctorSlots/add-slot`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(slotData),
        });
      }

      if (!response.ok) {
      const errorText = await response.text();
      alert(errorText);
      clearForm();
      return;
    }

      fetchSlots();
      clearForm();
    } catch (err) {
      console.log("error ",err)
      console.error('Failed to save slot:', err);
    }
  };

  const clearForm = () => {
    setDate('');
    setTime('');
    setSessionTime('');
    setMaxPatients('');
    setEditingId(null);
  };

  const toggleAvailability = async (slot) => {
    if (slot.numOfPatientsBooked > 0) {
      alert("You cannot delete this slot because it has existing bookings.");
      return;
    }
    try {
      await fetch(`${BASE_URL}/DoctorSlots/change-status?slotId=${slot.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSlots(doctorInfo.id);
    } catch (err) {
      console.error('Failed to update availability:', err);
    }
  };

  const cancelSlot = async (slot) => {
    if (slot.numOfPatientsBooked > 0) {
      alert("You cannot delete this slot because it has existing bookings.");
      return;
    }
    try {
      await fetch(`${BASE_URL}/DoctorSlots/${slot.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      fetchSlots();
    } catch (err) {
      console.error('Failed to delete slot:', err);
    }
  };

  const editSlot = (slot) => {
    setDate(slot.date);
    setTime(slot.time || slot.startTime);
    setSessionTime(slot.sessionMinutes?.toString() || slot.sessionDuration?.toString() || '');
    setMaxPatients(slot.maxPatients.toString());
    setEditingId(slot.id);
  };

  return (
    <div className="dashboard-container">
      <div className="sidebar">
      <div className="profile">
  <img
    src={doctorInfo?.profilePictureUrl || "https://cdn-icons-png.flaticon.com/512/3774/3774299.png"}
    alt="Doctor Profile"
    width="100"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = "https://cdn-icons-png.flaticon.com/512/3774/3774299.png";
    }}
  />
  {doctorInfo ? (
    <>
      <h2>Dr. {doctorInfo.name}</h2>
      <p><strong>Specialization:</strong> {doctorInfo.specializationName}</p>
      <p><strong>Bio:</strong> {doctorInfo.bio || 'No bio available'}</p>
    </>
  ) : (
    <p>Loading profile...</p>
  )}
</div>


        <br />

        <div className="nav-links">
          <button
            onClick={() => setActivePage('slots')}
            className={activePage === 'slots' ? 'active' : ''}
          >
            My Slots
          </button>
          <button
            onClick={() => setActivePage('bookings')}
            className={activePage === 'bookings' ? 'active' : ''}
          >
            Patient Bookings
          </button>
          <button className='logout-btn' onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>

      <div className="main-content">
        {activePage === 'slots' ? (
          <>
            <div className="section">
              <h2>{editingId ? 'Edit Slot' : 'Add Slot'}</h2>
              <div className="add-slot-form">
                <input type="date" value={date ? new Date(date).toISOString().split("T")[0] : ""} onChange={(e) => setDate(e.target.value)} />
                <input type="time" value={startTime} onChange={(e) => setTime(e.target.value)} />
                <input
                  type="text"
                  placeholder="Session Time (minutes)"
                  value={sessionDuration}
                  onChange={(e) => setSessionTime(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Max Patients"
                  value={maxPatients}
                  onChange={(e) => setMaxPatients(e.target.value)}
                />
                <button onClick={addOrEditSlot}>{editingId ? 'Update' : 'Add Slot'}</button>
              </div>
            </div>

            <div className="section">
              <h3>Upcoming Slots</h3>
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Session Time</th>
                    <th>Max Patients</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {slots.map(slot => (
                    <tr key={slot.id} className={!slot.isActive ? 'not-available' : ''}>
                      <td>{slot.date.substring(0,10)}</td>
                      <td>{slot.time || slot.startTime}</td>
                      <td>{slot.sessionMinutes || slot.sessionDuration}</td>
                      <td>{slot.maxPatients}</td>
                      <td>{slot.isActive ? 'Available' : 'Unavailable'}</td>
                      <td className="availability-actions">
                        <button onClick={() => toggleAvailability(slot)}>
                          {slot.isActive ? 'Mark Unavailable' : 'Mark Available'}
                        </button>
                        <button onClick={() => editSlot(slot)}>Edit</button>
                        <button className="cancel-btn" onClick={() => cancelSlot(slot)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                  {slots.length === 0 && (
                    <tr>
                      <td colSpan="6">No slots added yet.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <PatientBookings />
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
