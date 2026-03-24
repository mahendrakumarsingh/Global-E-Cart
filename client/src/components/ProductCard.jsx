import React from 'react'
import { Link } from 'react-router-dom'

export default function ProductCard({ product }) {
  return (
    <div className="bg-white p-4 rounded shadow">
      <div className="h-40 bg-gray-100 mb-4 flex items-center justify-center">{product.image || 'Image'}</div>
      <h3 className="font-semibold">{product.title}</h3>
      <p className="text-sm text-gray-500">₹{(product.price / 100).toFixed(2)}</p>
      <Link to={`/product/${product._id}`} className="mt-2 inline-block text-sm text-blue-600">View</Link>
    </div>
  )
}
