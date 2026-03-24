import React, { useState } from 'react';

export default function DealSubmissionPage() {
    const [url, setUrl] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert('Deal submitted successfully! Our team will review it.');
        setUrl('');
    };

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-black mb-4">Submit a Deal</h1>
            <p className="text-gray-600 mb-8">Found a great deal? Share it with the community!</p>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Deal URL</label>
                    <input
                        required
                        type="url"
                        className="w-full rounded-xl border-gray-200 p-4 text-sm focus:ring-2 focus:ring-primary outline-none bg-gray-50"
                        placeholder="https://amazon.in/..."
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                    />
                </div>
                <div className="p-4 bg-blue-50 rounded-xl text-blue-700 text-sm">
                    <strong>Tip:</strong> Ensure the link is valid and the product is currently in stock.
                </div>
                <button type="submit" className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/30 hover:bg-blue-700 transition-all">
                    Submit Deal
                </button>
            </form>
        </div>
    );
}
