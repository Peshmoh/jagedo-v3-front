import React, { useState } from 'react';

interface ContactDetailsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (details: ContactDetails) => void;
    initialData: ContactDetails;
}

interface ContactDetails {
    name: string;
    phone: string;
    email: string;
}

const ContactDetailsModal: React.FC<ContactDetailsModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<ContactDetails>(initialData);

    React.useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2 className="modal-title">Add Contact Details</h2>
                <div className="form-group">
                    <label htmlFor="name">Enter name</label>
                    <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="phone">Enter phone number</label>
                    <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Enter Email:</label>
                    <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} />
                </div>
                <div className="modal-actions">
                    <button onClick={handleSave} className="modal-btn save-btn">Save</button>
                    <button onClick={onClose} className="modal-btn cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default ContactDetailsModal;