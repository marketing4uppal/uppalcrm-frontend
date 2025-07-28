// src/components/ContactForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    leadId: '', // To link this contact to a lead
  });

  const { firstName, lastName, email, phone, leadId } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const backendUrl = 'https://uppalcrm-backend-mscu.onrender.com/api/contacts';
    try {
      const res = await axios.post(backendUrl, formData);
      console.log('Contact created:', res.data);
      alert('Contact created successfully!');
      setFormData({ firstName: '', lastName: '', email: '', phone: '', leadId: '' });
    } catch (error) {
      console.error('Error creating contact:', error.response.data);
      alert('Error: ' + error.response.data.message);
    }
  };

  return (
    <form onSubmit={onSubmit} style={{ marginTop: '20px' }}>
      <div style={{ marginBottom: '10px' }}>
        <input type="text" placeholder="First Name" name="firstName" value={firstName} onChange={onChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="text" placeholder="Last Name" name="lastName" value={lastName} onChange={onChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="email" placeholder="Email Address" name="email" value={email} onChange={onChange} required />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="text" placeholder="Phone" name="phone" value={phone} onChange={onChange} />
      </div>
      <div style={{ marginBottom: '10px' }}>
        <input type="text" placeholder="Lead ID to associate with" name="leadId" value={leadId} onChange={onChange} required />
      </div>
      <button type="submit">Add Contact</button>
    </form>
  );
};

export default ContactForm;