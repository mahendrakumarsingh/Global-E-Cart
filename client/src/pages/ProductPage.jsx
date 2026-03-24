import React, { useEffect, useState, useContext } from 'react'
import { useParams } from 'react-router-dom'
import api from '../utils/api'
import CartContext from '../context/CartContext'

export default function ProductPage() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const { dispatch } = useContext(CartContext)

  useEffect(() => {
    const fetch = async () => {
      const { data } = await api.get(`/products/${id}`)
      setProduct(data)
    }
    fetch()
  }, [id])

  const addToCart = () => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product: product._id,
        qty: 1,
        price: product.price,
        name: product.title,
        image: product.image
      }
    })
  }

  if (!product) return <div>Loading...</div>
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="col-span-2 bg-white p-4 rounded shadow">
        <img src={product.image} alt={product.title} className="w-full h-96 object-contain mb-4" />
        <h1 className="text-2xl font-bold mb-2">{product.title}</h1>
        <p className="text-gray-600">{product.description}</p>
      </div>
      <div className="bg-white p-6 rounded shadow h-fit">
        <div className="text-3xl font-bold text-primary mb-4">₹{product.price.toFixed(2)}</div>
        <p className="text-sm text-gray-500 mb-6">In Stock: {product.countInStock}</p>
        <button onClick={addToCart} className="w-full btn primary py-3 font-bold text-lg">Add to Cart</button>
      </div>
    </div>
  )
}
