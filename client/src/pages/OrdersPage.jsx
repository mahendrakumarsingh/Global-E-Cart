import React, { useEffect, useState } from 'react'
import api from '../utils/api'

export default function OrdersPage() {
  const [orders, setOrders] = useState([])

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get('/orders/myorders')
        setOrders(data)
      } catch (err) { console.error(err) }
    }
    fetch()
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      {orders.map(o => (
        <div key={o._id} className="bg-white p-4 rounded mb-2">
          <div className="flex justify-between">
            <div>Order #{o._id}</div>
            <div>{o.status}</div>
          </div>
          <div className="text-sm text-gray-600">Total: ₹{(o.totalPrice / 100).toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
