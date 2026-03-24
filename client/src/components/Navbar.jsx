import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import CartContext from '../context/CartContext'

export default function Navbar() {
  const navigate = useNavigate();
  const { state } = useContext(CartContext);
  const cartItemCount = state.cartItems.reduce((acc, item) => acc + item.qty, 0);
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    window.location.href = '/';
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-solid border-[#f0f2f4] dark:border-gray-800 bg-white dark:bg-background-dark px-4 md:px-10 py-3">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-white">
            <span className="material-symbols-outlined">shopping_cart</span>
          </div>
          <h2 className="hidden text-xl font-bold leading-tight tracking-tight sm:block">Global E-Cart</h2>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl">
          <label className="flex w-full items-center h-10">
            <div className="flex w-full items-stretch rounded-lg h-full overflow-hidden border border-[#dbdfe6] dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-center pl-4 text-gray-400">
                <span className="material-symbols-outlined text-xl">search</span>
              </div>
              <input className="w-full border-none bg-transparent px-4 text-base focus:ring-0 placeholder:text-gray-400 outline-none" placeholder="Search deals across Amazon, Flipkart, Myntra..." />
            </div>
          </label>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4 md:gap-8">
          <nav className="hidden lg:flex items-center gap-6">
            <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">Home</Link>

            <Link to="/cart" className="relative text-sm font-medium hover:text-primary transition-colors">
              Cart
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-3 flex size-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white">
                  {cartItemCount}
                </span>
              )}
            </Link>
            <Link to="/orders" className="text-sm font-medium hover:text-primary transition-colors">Orders</Link>
            <Link to="/admin" className="text-sm font-medium hover:text-primary transition-colors">Admin</Link>
          </nav>

          {token ? (
            <button onClick={handleLogout} className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-transform hover:scale-105 active:scale-95">
              Logout
            </button>
          ) : (
            <Link to="/login" className="flex min-w-[84px] items-center justify-center rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold transition-transform hover:scale-105 active:scale-95">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
