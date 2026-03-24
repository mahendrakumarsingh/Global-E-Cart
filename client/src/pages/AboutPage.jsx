import React from 'react';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-black mb-8">About Global E-Cart</h1>
            <div className="prose prose-lg dark:prose-invert">
                <p className="text-xl text-gray-600 mb-6">
                    Welcome to Global E-Cart, your number one source for all things tech, fashion, and home essentials. We're dedicated to giving you the very best of deals, with a focus on dependability, customer service, and uniqueness.
                </p>
                <p className="mb-4">
                    Founded in 2024, Global E-Cart has come a long way from its beginnings. When we first started out, our passion for "aggregating the best deals for you" drove us to do tons of research, so that Global E-Cart can offer you the world's most competitive prices. We now serve customers all over India and are thrilled that we're able to turn our passion into our own website.
                </p>
                <p>
                    We hope you enjoy our products as much as we enjoy offering them to you. If you have any questions or comments, please don't hesitate to contact us.
                </p>
                <p className="font-bold mt-8">Sincerely,<br />The Global E-Cart Team</p>
            </div>
        </div>
    );
}
