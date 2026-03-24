import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
    return (
        <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-background-dark py-12 px-4 md:px-10">
            <div className="mx-auto max-w-[1440px] grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-white">
                            <span className="material-symbols-outlined text-sm">shopping_cart</span>
                        </div>
                        <h2 className="text-lg font-bold">Global E-Cart</h2>
                    </div>
                    <p className="text-gray-500 dark:text-gray-400 max-w-sm mb-6">
                        The ultimate destination for the best deals across Amazon, Flipkart, Myntra and more. We aggregate the highest discounts so you don't have to.
                    </p>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Quick Links</h4>
                    <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                        <li><Link className="hover:text-primary" to="/about">About Us</Link></li>
                        <li><Link className="hover:text-primary" to="/submit-deal">Deal Submission</Link></li>
                        <li><Link className="hover:text-primary" to="/contact">Contact Support</Link></li>
                        <li><Link className="hover:text-primary" to="/privacy">Privacy Policy</Link></li>
                    </ul>
                </div>
                <div>
                    <h4 className="font-bold mb-4">Newsletter</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Get daily top deals straight to your inbox.</p>
                    <div className="flex gap-2">
                        <input className="w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 px-3 py-2 text-sm focus:ring-primary outline-none" placeholder="Email address" type="email" />
                        <button className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white">Subscribe</button>
                    </div>
                </div>
            </div>
            <div className="mx-auto max-w-[1440px] mt-12 pt-8 border-t border-gray-100 dark:border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400 uppercase tracking-widest font-medium">
                <p>© 2026 Global E-Cart Aggregator. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#">Twitter</a>
                    <a href="https://www.instagram.com/basicideas2/">Instagram</a>
                    <a href="#">Facebook</a>
                </div>
            </div>
        </footer>
    )
}
