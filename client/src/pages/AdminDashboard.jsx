import React, { useEffect, useState } from 'react'
import api from '../utils/api'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import { Bar } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

export default function AdminDashboard(){
  const [stats, setStats] = useState(null)
  const [orders, setOrders] = useState([])

  useEffect(()=>{
    const fetch = async ()=>{
      try{
        const { data } = await api.get('/admin/analytics')
        setStats(data)
      }catch(err){ console.error(err) }
    }
    fetch()

    const fetchOrders = async () => {
      try{
        const { data } = await api.get('/orders')
        setOrders(data)
      }catch(err){ console.error(err) }
    }
    fetchOrders()
  },[])

  if(!stats) return <div>Loading analytics...</div>

  const data = {
    labels: stats.months,
    datasets: [{ label: 'Revenue', data: stats.revenue, backgroundColor: 'rgba(54, 162, 235, 0.5)' }]
  }

  const updateStatus = async (orderId, status) => {
    try{
      const { data } = await api.put(`/orders/${orderId}/status`, { status })
      setOrders(orders.map(o => o._id === data._id ? data : o))
      alert('Order updated')
    }catch(err){ console.error(err); alert('Update failed') }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded">Total Sales: ${(stats.totalSales/100).toFixed(2)}</div>
        <div className="bg-white p-4 rounded">Total Orders: {stats.totalOrders}</div>
        <div className="bg-white p-4 rounded">Total Users: {stats.totalUsers}</div>
      </div>
      <div className="bg-white p-4 rounded mb-4">
        <Bar data={data} />
      </div>

      <h2 className="text-xl font-bold mb-2">Recent Orders</h2>
      {orders.map(o => (
        <div key={o._id} className="bg-white p-4 rounded mb-2">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">Order {o._id}</div>
              <div className="text-sm text-gray-600">User: {o.user && o.user.name}</div>
            </div>
            <div className="text-right">
              <div className="font-bold">{o.status}</div>
              <div className="mt-2 flex gap-2">
                <button className="btn" onClick={()=> updateStatus(o._id,'Shipped')}>Set Shipped</button>
                <button className="btn" onClick={()=> updateStatus(o._id,'Delivered')}>Set Delivered</button>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-600 mt-2">Total: ${(o.totalPrice/100).toFixed(2)}</div>
        </div>
      ))}
    </div>
  )
}
