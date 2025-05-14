import {useState} from 'react';
import '../styles/RequestForm.css';
import {API_URL} from '../config.js';

export default function Home() {

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrors([]);

        const newErrors = [];

        if (name.length < 3 || name.length > 15) {
            newErrors.push('Name should be between 3 and 15 characters');
        }
        if (!email.match(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
            newErrors.push('Please enter a valid email');
        }
        if (message.length < 15 || message.length > 255) {
            newErrors.push('Message should be between 15 and 255 characters');
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            return;
        }


        const response = await fetch(`${API_URL}/requests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({name, email, message}),
        });

        if (response.ok) {
            alert('Request created');
            setName('');
            setEmail('');
            setMessage('');
        } else {
            alert('Something went wrong. Please try again');
        }

    };

    return (
        <form onSubmit={handleSubmit}>
            {errors.length > 0 && (
                <ul style={{color: 'red'}}>
                    {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            )}
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                required
            />
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email"
                required
            />
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Your message"
                required
            ></textarea>
            <button type="submit">Submit Request</button>
        </form>
    );
}
