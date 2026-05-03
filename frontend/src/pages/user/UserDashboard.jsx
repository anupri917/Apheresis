import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import GoogleMapComponent from '../../components/maps/GoogleMapComponent';
import { useNavigate } from 'react-router-dom';

const UserDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [donations, setDonations] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProfile();
    fetchDonations();
    fetchMyRequests();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/user/me');
      setProfile(res.data);
    } catch (e) {
      console.error('Error fetching profile', e);
    }
  };

  const fetchDonations = async () => {
    try {
      const res = await api.get('/user/donations');
      setDonations(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const res = await api.get('/requests/my-requests');
      setMyRequests(res.data);
    } catch (e) {
      console.error(e);
    }
  };


  const getLastEligibleDate = () => {
    if (!donations || donations.length === 0) return 'Eligible Now';

    const sorted = [...donations].sort((a, b) => new Date(b.donationDate) - new Date(a.donationDate));
    const last = sorted[0];
    if (last.nextEligibleDate) {
      const nextDate = new Date(last.nextEligibleDate);
      if (nextDate <= new Date()) return 'Eligible Now';
      return `Next Eligible: ${nextDate.toISOString().substring(0, 10)}`;
    }
    return 'Unknown';
  };

  return (
    <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>User Dashboard</h2>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn-primary" onClick={() => navigate('/donate')}>Donate Blood</button>
          <button className="btn-secondary" onClick={() => navigate('/request')}>Request Blood</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        <div className="card glass">
          <h3>Profile Info</h3>
          {profile ? (
            <div style={{ marginTop: '1rem', lineHeight: '1.8' }}>
              <p><strong>Username:</strong> {profile.username}</p>
              <p><strong>Blood Group:</strong> <span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>{profile.bloodGroup}</span></p>
              <p><strong>Eligibility Status:</strong> <span style={{ color: 'var(--success)' }}>{getLastEligibleDate()}</span></p>
              {profile.isEmergencyDonor && <p><strong>Status:</strong> <span style={{ color: 'var(--danger)' }}>Emergency Donor</span></p>}
            </div>
          ) : <p>Loading...</p>}
        </div>

        <div className="card glass">
          <h3>Find Us</h3>
          <p style={{ marginBottom: '1rem' }}>Visit our center to donate or collect blood.</p>
          <div style={{ height: '200px' }}>
            <GoogleMapComponent />
          </div>
        </div>
      </div>

      <div className="card glass">
        <h3>My Donation History</h3>
        <div className="table-container" style={{ marginTop: '1rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Blood Group</th>
                <th>Component</th>
                <th>Units</th>
              </tr>
            </thead>
            <tbody>
              {donations.map(d => (
                <tr key={d.id}>
                  <td>{d.donationDate}</td>
                  <td>{d.bloodGroup}</td>
                  <td>{d.bloodComponentType}</td>
                  <td>{d.units}</td>
                </tr>
              ))}
              {donations.length === 0 && (
                <tr>
                  <td colSpan="4">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="card glass">
        <h3>My Requests</h3>
        <div className="table-container" style={{ marginTop: '1rem' }}>
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Blood Group</th>
                <th>Component</th>
                <th>Units</th>
                <th>Urgency</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myRequests.map(r => (
                <tr key={r.id}>
                  <td>{r.requestDate?.substring(0, 10)}</td>
                  <td>{r.bloodGroup}</td>
                  <td>{r.bloodComponentType}</td>
                  <td>{r.quantityUnits}</td>
                  <td>
                    <span style={{
                      color: r.urgency === 'Critical' ? 'var(--danger)' : r.urgency === 'Urgent' ? 'var(--warning)' : 'inherit',
                      fontWeight: r.urgency !== 'Normal' ? 'bold' : 'normal'
                    }}>
                      {r.urgency}
                    </span>
                  </td>
                  <td>{r.status}</td>
                </tr>
              ))}
              {myRequests.length === 0 && (
                <tr>
                  <td colSpan="6">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;