import React, { useContext } from 'react'
import CartContext from '../context/CartContext'
import { Link } from 'react-router-dom'

export default function CartPage() {
  const { state, dispatch } = useContext(CartContext)
  const { cartItems } = state

  const remove = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQty = (id, qty) => dispatch({ type: 'UPDATE_QTY', payload: { product: id, qty } })

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0)

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Cart</h1>
      {cartItems.length === 0 ? <p className="text-gray-500">Your cart is empty</p> : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item.product} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-4 items-center">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 line-clamp-1">{item.name}</h3>
                  <div className="text-primary font-bold">₹{item.price.toFixed(2)}</div>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={item.qty}
                    min="1"
                    onChange={(e) => updateQty(item.product, Number(e.target.value))}
                    className="w-16 rounded-lg border-gray-200 p-2 text-center text-sm"
                  />
                  <button onClick={() => remove(item.product)} className="text-red-500 hover:text-red-700 p-2">
                    <span className="material-symbols-outlined">delete</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="h-fit bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="flex justify-between text-gray-600 mb-2">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600 mb-4">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg mb-6">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="block w-full rounded-lg bg-primary py-3 text-center text-sm font-bold text-white transition-transform hover:scale-[1.02] active:scale-[0.98]">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
