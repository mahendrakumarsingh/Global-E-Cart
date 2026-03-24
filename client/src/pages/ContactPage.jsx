import React, { useState } from 'react';

export default function ContactPage() {
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for contacting us! We will get back to you shortly.');
        setFormData({ name: '', email: '', message: '' });
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-black mb-4">Contact Support</h1>
            <p className="text-gray-600 mb-8">Have a question or need assistance? Fill out the form below and we'll help you out.</p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Name</label>
                    <input
                        required
                        type="text"
                        className="w-full rounded-xl border-gray-200 p-4 text-sm focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                        placeholder="Your Name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Email</label>
                    <input
                        required
                        type="email"
                        className="w-full rounded-xl border-gray-200 p-4 text-sm focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                    <textarea
                        required
                        rows="5"
                        className="w-full rounded-xl border-gray-200 p-4 text-sm focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                        placeholder="How can we help you?"
                        value={formData.message}
                        onChange={e => setFormData({ ...formData, message: e.target.value })}
                    ></textarea>
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-blue-700 transition-all">
                    Send Message
                </button>
            </form>
        </div>
    );
}
