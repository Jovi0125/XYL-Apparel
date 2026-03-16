import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import LogisticsSidebar from './partials/Sidebar';
import UpdateStatusModal from './UpdateStatusModal';

export default function ShipmentDetails() {
    const { id } = useParams();
    const [shipment, setShipment] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchShipment = () => {
        axios.get(`/logistics/shipments/${id}`).then(res => setShipment(res.data.shipment)).catch(() => {});
    };

    useEffect(() => { fetchShipment(); }, [id]);

    if (!shipment) return <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Shipment Details"><p style={{color:'#999',padding:'2rem'}}>Loading...</p></DashboardLayout>;

    const timeline = [...(shipment.tracking_events || [])].reverse();

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Shipment Details">
            <div className="shipment-details">
                <div className="detail-header">
                    <div>
                        <h2 className="tracking-num">{shipment.tracking_number}</h2>
                        <span className={`status-badge lg ${shipment.delivery_status}`}>{shipment.delivery_status.replace('_', ' ')}</span>
                    </div>
                    <div className="header-actions">
                        <button className="btn-primary" onClick={() => setShowModal(true)}>Update Status</button>
                        <Link to="/logistics/shipments" className="btn-outline">← Back</Link>
                    </div>
                </div>

                <div className="detail-grid">
                    <div className="info-card">
                        <h4>Order Information</h4>
                        <div className="info-row"><span>Order ID</span><span>#{shipment.order_id}</span></div>
                        <div className="info-row"><span>Customer</span><span>{shipment.order?.customer?.name}</span></div>
                        <div className="info-row"><span>Pickup</span><span>{shipment.pickup_address}</span></div>
                        <div className="info-row"><span>Delivery</span><span>{shipment.delivery_address}</span></div>
                        <div className="info-row"><span>Attempts</span><span>{shipment.delivery_attempts || 0}</span></div>
                        {shipment.failed_reason && <div className="info-row"><span>Fail Reason</span><span className="danger-text">{shipment.failed_reason}</span></div>}
                        {shipment.notes && <div className="info-row"><span>Notes</span><span>{shipment.notes}</span></div>}
                    </div>

                    <div className="info-card">
                        <h4>Tracking Timeline</h4>
                        <div className="timeline">
                            {timeline.map((ev, i) => (
                                <div key={ev.id} className={`timeline-item ${i === timeline.length - 1 ? 'active' : ''}`}>
                                    <div className="timeline-dot"></div>
                                    <div className="timeline-content">
                                        <div className="timeline-status">{ev.status}</div>
                                        {ev.location_text && <div className="timeline-location">{ev.location_text}</div>}
                                        {ev.remarks && <div className="timeline-remarks">{ev.remarks}</div>}
                                        <div className="timeline-date">{new Date(ev.created_at).toLocaleString()}</div>
                                    </div>
                                </div>
                            ))}
                            {timeline.length === 0 && <p className="empty-cell">No tracking events yet</p>}
                        </div>
                    </div>
                </div>

                {shipment.proof_of_delivery && (
                    <div className="info-card pod-card">
                        <h4>Proof of Delivery</h4>
                        <div className="info-row"><span>Receiver</span><span>{shipment.proof_of_delivery.receiver_name}</span></div>
                        <div className="info-row"><span>Received At</span><span>{new Date(shipment.proof_of_delivery.received_at).toLocaleString()}</span></div>
                        {shipment.proof_of_delivery.photo_path && <img src={`/storage/${shipment.proof_of_delivery.photo_path}`} alt="POD" className="pod-image" />}
                    </div>
                )}

                {showModal && <UpdateStatusModal shipment={shipment} onClose={() => { setShowModal(false); fetchShipment(); }} />}
            </div>
        </DashboardLayout>
    );
}
