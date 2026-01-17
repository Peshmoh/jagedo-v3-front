import React, { useState } from 'react';

interface DeliveryAddress {
    address: string;
}


interface DeliveryAddressModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (address: DeliveryAddress) => void;
    initialData: DeliveryAddress;
}


const DeliveryAddressModal: React.FC<DeliveryAddressModalProps> = ({ isOpen, onClose, onSave, initialData }) => {
    const [formData, setFormData] = useState<DeliveryAddress>(initialData);

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
                <h2 className="modal-title">Edit Delivery Details</h2>
                <div className="form-group">
                    <label htmlFor="address">Enter Delivery Address</label>
                    <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} placeholder="e.g. Kondele, Kisumu" />
                </div>
                <div className="modal-actions">
                    <button onClick={handleSave} className="modal-btn save-btn">Save</button>
                    <button onClick={onClose} className="modal-btn cancel-btn">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default DeliveryAddressModal;