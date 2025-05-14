import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Index.css';
import { API_URL, ADMIN_TOKEN } from '../../config';

const Index = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [userToken, setUserToken] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [tokenInput, setTokenInput] = useState('');

    const [actionState, setActionState] = useState({
        type: null, // "approve" | "reject" | "delete"
        requestId: null,
    });
    const [actionTokenInput, setActionTokenInput] = useState('');

    const fetchRequests = () => {
        setLoading(true);
        axios
            .get(`${API_URL}/requests`, {
                headers: { Authorization: `Bearer ${userToken}` },
            })
            .then((response) => {
                setRequests(response.data);
                setLoading(false);
            })
            .catch(() => {
                setError('Failed to load requests');
                setLoading(false);
            });
    };

    useEffect(() => {
        if (isAuthorized) {
            fetchRequests();
        }
    }, [isAuthorized]);

    const handleApproveReject = (id, status) => {
        axios
            .patch(
                `${API_URL}/requests/${id}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            )
            .then(() => {
                fetchRequests();
                resetActionState();
            })
            .catch(() => alert('Failed to update status'));
    };

    const handleDelete = (id) => {
        axios
            .delete(`${API_URL}/requests/${id}`, {
                headers: {
                    Authorization: `Bearer ${userToken}`,
                },
            })
            .then(() => {
                setRequests((prev) => prev.filter((req) => req.id !== id));
                resetActionState();
            })
            .catch(() => alert('Failed to delete request'));
    };

    const resetActionState = () => {
        setActionState({ type: null, requestId: null });
        setActionTokenInput('');
    };

    const confirmAction = () => {
        if (actionTokenInput !== ADMIN_TOKEN) {
            alert('Invalid token');
            return;
        }

        const { type, requestId } = actionState;
        if (type === 'approve') handleApproveReject(requestId, 'approve');
        else if (type === 'reject') handleApproveReject(requestId, 'reject');
        else if (type === 'delete') handleDelete(requestId);
    };

    if (!isAuthorized) {
        return (
            <div className="token-form">
                <h3>Enter Admin Token</h3>
                <input
                    type="password"
                    value={tokenInput}
                    onChange={(e) => setTokenInput(e.target.value)}
                    placeholder="Enter token"
                />
                <button
                    onClick={() => {
                        if (tokenInput === ADMIN_TOKEN) {
                            setUserToken(tokenInput);
                            setIsAuthorized(true);
                        } else {
                            alert('Invalid token');
                        }
                    }}
                >
                    Submit
                </button>
            </div>
        );
    }

    return (
        <div className="container">
            <h2>All Requests</h2>

            {requests.length === 0 ? (
                <p>No requests available</p>
            ) : (
                <ul className="request-list">
                    {requests.map((request) => (
                        <li key={request.id} className="request-item">
                            <p><strong>Name:</strong> {request.name}</p>
                            <p><strong>Email:</strong> {request.email}</p>
                            <p><strong>Message:</strong> {request.message}</p>
                            <p><strong>Status:</strong> {request.status}</p>

                            <div className="action-buttons">
                                <button
                                    className="button-approve"
                                    onClick={() =>
                                        setActionState({ type: 'approve', requestId: request.id })
                                    }
                                >
                                    Approve
                                </button>

                                <button
                                    className="button-reject"
                                    onClick={() =>
                                        setActionState({ type: 'reject', requestId: request.id })
                                    }
                                >
                                    Reject
                                </button>

                                <button
                                    className="button-delete"
                                    onClick={() =>
                                        setActionState({ type: 'delete', requestId: request.id })
                                    }
                                >
                                    Delete
                                </button>
                            </div>

                            {actionState.requestId === request.id && (
                                <div className="confirm-box">
                                    <input
                                        type="password"
                                        placeholder="Confirm token"
                                        value={actionTokenInput}
                                        onChange={(e) => setActionTokenInput(e.target.value)}
                                    />
                                    <button onClick={confirmAction}>Confirm</button>
                                    <button onClick={resetActionState}>Cancel</button>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Index;
