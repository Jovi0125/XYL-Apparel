import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import DashboardLayout from "../../layouts/DashboardLayout";
import LogisticsSidebar from "../partials/Sidebar";

export default function ShipmentsShow() {
    const { id } = useParams();
    const [shipment, setShipment] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [updateForm, setUpdateForm] = useState({ status: "", location_text: "", remarks: "" });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        axios.get('/logistics/shipments/' + id).then(res => {
            setShipment(res.data.shipment);
        }).catch(() => {});
    }, [id]);

    const handleUpdateSubmit = (e) => {
        e.preventDefault();
        setSubmitting(true);
        axios.post('/logistics/shipments/' + id + '/tracking', updateForm)
            .then(res => {
                if (res.data.success) {
                    // Update state dynamically
                    setShipment(prev => ({
                        ...prev,
                        delivery_status: res.data.status,
                        status: res.data.status,
                        tracking_events: [res.data.event, ...(prev.tracking_events || [])]
                    }));
                    setUpdateForm({ status: "", location_text: "", remarks: "" });
                    setIsUpdating(false);
                }
            })
            .catch(err => {
                alert("Failed to update status. Please check your inputs.");
            })
            .finally(() => {
                setSubmitting(false);
            });
    };

    if (!shipment) return <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle="Shipment"><p>Loading...</p></DashboardLayout>;   

    return (
        <DashboardLayout sidebar={<LogisticsSidebar />} pageTitle={"Shipment #" + shipment.tracking_number}>
            <div className="shipping-details-grid">
                <div className="shipping-main-column">
                    {/* Shipment Details */}
                    <div className="stat-card">
                        <h3 className="card-title">Details</h3>
                        <dl className="info-list">
                            <div><dt>Order</dt><dd>#{shipment.order?.order_number}</dd></div>
                            <div><dt>Status</dt><dd className="status-badge">{(shipment.delivery_status || shipment.status || "Unknown").replace("_", " ")}</dd></div>
                            <div><dt>Customer</dt><dd>{shipment.order?.shipping_name}</dd></div>
                            <div><dt>Phone</dt><dd>{shipment.order?.shipping_phone}</dd></div>
                            <div className="full-width"><dt>Address</dt><dd>{shipment.order?.shipping_address}, {shipment.order?.shipping_city}</dd></div>
                        </dl>
                    </div>

                    {/* Tracking Timeline */}
                    <div className="stat-card">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="card-title">Tracking Events</h3>
                            <button onClick={() => setIsUpdating(!isUpdating)} className="btn-link">
                                {isUpdating ? "Cancel Update" : "+ Inline Update"}
                            </button>
                        </div>
                        
                        {/* Dynamic Update Form */}
                        {isUpdating && (
                            <form onSubmit={handleUpdateSubmit} className="inline-update-form">
                                <h4>Post a new update</h4>
                                <div className="form-group-row">
                                    <select required value={updateForm.status} onChange={e => setUpdateForm({...updateForm, status: e.target.value})} className="form-input">
                                        <option value="">Select Status</option>
                                        <option value="in_transit">In Transit</option>
                                        <option value="out_for_delivery">Out for Delivery</option>
                                        <option value="delayed">Delayed</option>
                                        <option value="delivered">Delivered</option>
                                    </select>
                                    <input type="text" placeholder="Location" value={updateForm.location_text} onChange={e => setUpdateForm({...updateForm, location_text: e.target.value})} className="form-input" />
                                </div>
                                <textarea placeholder="Remarks (optional)" value={updateForm.remarks} onChange={e => setUpdateForm({...updateForm, remarks: e.target.value})} className="form-input" rows="2"></textarea>
                                <button type="submit" disabled={submitting} className="btn-primary">
                                    {submitting ? "Updating..." : "Save Status"}
                                </button>
                            </form>
                        )}

                        <div className="tracking-timeline">
                            {(shipment.tracking_events || []).map((event, i) => (
                                <div key={i} className="tracking-event">
                                    <div>
                                        <p className="event-status">{event.status?.replace("_", " ")}</p>
                                        <p className="event-location">{(event.location_text || event.location)} &middot; {event.remarks}</p>
                                        <p className="event-time">{event.created_at ? new Date(event.created_at).toLocaleString() : "Just now"}</p>
                                    </div>
                                </div>
                            ))}
                            {(!shipment.tracking_events || shipment.tracking_events.length === 0) && (
                                <p>No tracking events yet.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="shipping-sidebar-column">
                    <Link to={'/logistics/tracking/create/' + shipment.id} className="btn-primary w-full text-center mb-4">
                        Go to Dedicated Update Page
                    </Link>
                    {shipment.status !== "delivered" && (
                        <Link to={'/logistics/pod/create/' + shipment.id} className="btn-secondary w-full text-center">
                            Record Delivery (POD)
                        </Link>
                    )}
                </div>
            </div>

            <div style={{ marginTop: '1rem' }}>
                <Link to="/logistics/shipments" className="btn-link">&larr; Back to Shipments</Link>
            </div>
        </DashboardLayout>
    );
}
