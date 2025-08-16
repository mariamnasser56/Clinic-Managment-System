import React, { useEffect, useState } from "react";
import "./DoctorDashboard.css";
import { BASE_URL } from "../../api/baseURL";
import Loader from "../../Components/Loader";
const PatientBookings = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("token");

    fetch(`${BASE_URL}/Doctors/Bookings`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized or bad response");
        return res.json();
      })
      .then((data) => {
        setSlots(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching slots:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p><Loader/></p>;

  return (
    <div className="section patient-booking-container">
      <h3>Patient Bookings</h3>
      {slots.length === 0 && <p>No bookings found.</p>}
      {slots.map((slot) => (
        <div key={slot.id}>
          <strong>
            {new Date(slot.date).toLocaleDateString()} at {slot.time}
          </strong>
          {slot.patients ? (
            <ul>
              <li>
                {slot.patients.name} - {slot.patients.bookingTime} -{" "}
                {slot.patients.reaon} - {slot.patients.phoneNumber}
              </li>
            </ul>
          ) : (
            <p>No patient booked</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default PatientBookings;
