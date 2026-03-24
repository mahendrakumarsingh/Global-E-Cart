import React from 'react';

export default function PrivacyPolicyPage() {
    return (
        <div className="max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-4xl font-black mb-8">Privacy Policy</h1>
            <div className="prose prose-lg dark:prose-invert space-y-6">
                <p className="text-gray-600">Last updated: February 09, 2026</p>

                <section>
                    <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                    <p>We collect information you provide directly to us, such as when you create an account, update your profile, make a purchase, or communicate with us.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                    <p>We use the information we collect to provide, maintain, and improve our services, such as to process transactions, send you related information, and respond to your comments.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">3. Sharing of Information</h2>
                    <p>We do not share your personal information with third parties except as described in this policy or with your consent.</p>
                </section>

                <section>
                    <h2 className="text-2xl font-bold mb-4">4. Security</h2>
                    <p>We take reasonable measures to help protect information about you from loss, theft, misuse and unauthorized access.</p>
                </section>
            </div>
        </div>
    );
}
