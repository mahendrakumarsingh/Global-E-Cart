import React, { useContext, useState, useEffect } from 'react'
import api from '../utils/api'
import { useNavigate } from 'react-router-dom'
import CartContext from '../context/CartContext'

// Order Summary Component
function OrderSummary({ cartItems, total, processingFee }) {
  const discount = 231.00; // Mock discount for now
  const shipping = 5.00;
  const grandTotal = total - discount + shipping + processingFee;

  return (
    <div className="bg-white p-6 h-full flex flex-col">
      <h2 className="text-xl font-bold mb-2">Order Summary</h2>
      <p className="text-sm text-gray-500 mb-6">Review items before shipping</p>

      <div className="flex-1 overflow-y-auto space-y-6 mb-6 pr-2">
        {cartItems.map((item) => (
          <div key={item.product} className="flex gap-4">
            <div className="h-16 w-16 shrink-0 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
              <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</p>
              <p className="text-sm font-bold text-blue-600 mt-1">₹{item.price.toFixed(2)}</p>
              <p className="text-xs text-gray-500 mt-1">Qty: {item.qty}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-6 space-y-3">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Subtotal</span>
          <span className="font-bold">₹{total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Discount</span>
          <span className="font-bold text-green-600">-₹{discount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Shipping</span>
          <span className="font-bold">₹{shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm text-gray-600">
          <span>Processing Fee</span>
          <span className="font-bold text-gray-900">₹{processingFee.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-xl font-bold text-blue-700 pt-3 border-t border-gray-100 mt-3">
          <span>Total</span>
          <span>₹{grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

function CheckoutForm({ shippingAddress, setStep, total, paymentMethod, setPaymentMethod, processingFee }) {
  const { state, dispatch } = useContext(CartContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  const [cardHolderName, setCardHolderName] = useState('');

  const discount = 231.00;
  const shipping = 5.00;
  const grandTotal = total - discount + shipping + processingFee;

  const handlePayment = async () => {
    setLoading(true);
    try {
      // 1. Create Order on Backend
      const { data: order } = await api.post('/payments/create-order', {
        amount: Math.round(grandTotal),
        currency: 'INR'
      });

      // 2. Open Razorpay Modal
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_YourKeyHere',
        amount: order.amount,
        currency: order.currency,
        name: "Global E-Cart",
        description: "Order Payment",
        order_id: order.id,
        handler: async function (response) {
          try {
            // 3. Verify Payment
            const verifyRes = await api.post('/payments/verify-payment', response);

            if (verifyRes.data.success) {
              // 4. Create Order in DB
              const orderData = {
                orderItems: state.cartItems.map(i => ({
                  product: i.product, name: i.name, price: i.price, qty: i.qty, image: i.image
                })),
                shippingAddress: {
                  fullName: shippingAddress.fullName,
                  address: `${shippingAddress.flat}, ${shippingAddress.area}`,
                  city: shippingAddress.city,
                  postalCode: shippingAddress.pinCode,
                  country: 'India'
                },
                totalPrice: grandTotal,
                paymentMethod: 'Razorpay',
                paid: true
              };

              await api.post('/orders', orderData);
              dispatch({ type: 'CLEAR_CART' });
              alert('Payment successful & order placed!');
              navigate('/orders');
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error(error);
            alert('Payment verification failed: ' + error.message);
          }
        },
        prefill: {
          name: shippingAddress.fullName,
          email: "user@example.com",
          contact: shippingAddress.mobile
        },
        theme: {
          color: "#3399cc"
        },
        // Filter methods based on selection
        method: paymentMethod === 'card' ? { card: true, netbanking: false, wallet: false, upi: false } : { upi: true, card: false, netbanking: false, wallet: false }
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on('payment.failed', function (response) {
        alert(response.error.description);
      });
      rzp1.open();

    } catch (err) {
      console.error(err);
      alert('Payment initialization failed: ' + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto py-8">
      {/* Payment Method Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          type="button"
          onClick={() => setPaymentMethod('card')}
          className={`flex-1 py-4 px-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'}`}
        >
          <span className="material-symbols-outlined text-2xl">credit_card</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">Card</span>
        </button>
        <button
          type="button"
          onClick={() => setPaymentMethod('upi')}
          className={`flex-1 py-4 px-2 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-all duration-200 ${paymentMethod === 'upi' ? 'border-blue-600 bg-blue-50/50 text-blue-700' : 'border-gray-200 bg-white text-gray-400 hover:border-gray-300'}`}
        >
          <span className="material-symbols-outlined text-2xl">qr_code_scanner</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">UPI</span>
        </button>
        <button
          type="button"
          disabled
          className="flex-1 py-4 px-2 rounded-2xl border-2 border-gray-100 flex flex-col items-center justify-center gap-2 text-gray-300 cursor-not-allowed"
        >
          <span className="material-symbols-outlined text-2xl">account_balance_wallet</span>
          <span className="text-[10px] font-bold tracking-widest uppercase">Wallet</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-100">

        {/* CARD CONTENT */}
        {paymentMethod === 'card' && (
          <div className="space-y-5">
            <div>
              <input
                type="text"
                placeholder="Name on Card"
                value={cardHolderName}
                onChange={(e) => setCardHolderName(e.target.value)}
                className="w-full h-14 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400 font-medium text-gray-700"
              />
            </div>

            <div className="relative">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full h-14 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400 font-medium text-gray-700"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1">
                <div className="w-8 h-5 bg-gray-200 rounded"></div>
                <div className="w-8 h-5 bg-gray-300 rounded"></div>
              </div>
            </div>

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="MM/YY"
                className="flex-1 h-14 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400 font-medium text-gray-700"
              />
              <input
                type="text"
                placeholder="CVV"
                className="flex-1 h-14 rounded-xl border border-gray-200 px-4 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400 font-medium text-gray-700"
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-bold text-gray-600">Save card for future use</span>
              <div className="w-12 h-7 bg-blue-600 rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 size-5 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>
          </div>
        )}

        {/* UPI CONTENT */}
        {paymentMethod === 'upi' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                  <span className="material-symbols-outlined">qr_code_2</span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">UPI</h3>
                  <p className="text-xs text-gray-500">Scan or Pay with VPA</p>
                </div>
              </div>
              <div className="size-5 rounded-full border-[5px] border-blue-600"></div>
            </div>

            <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 bg-gray-50/50">
              <span className="material-symbols-outlined text-6xl text-gray-300">qr_code_scanner</span>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest text-center">Scan QR with any UPI App</p>
            </div>

            <div className="relative flex items-center gap-4">
              <div className="h-px bg-gray-100 flex-1"></div>
              <span className="text-xs font-bold text-gray-400 uppercase">OR</span>
              <div className="h-px bg-gray-100 flex-1"></div>
            </div>

            <div className="relative">
              <label className="absolute -top-2.5 left-3 bg-white px-1 text-[10px] font-bold text-blue-600">Enter VPA ID</label>
              <input
                type="text"
                placeholder="user@okaxis"
                className="w-full h-14 rounded-xl border border-gray-200 pl-4 pr-20 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all placeholder-gray-400 font-medium text-gray-700"
              />
              <button
                type="button"
                className="absolute right-2 top-2 bottom-2 px-4 rounded-lg text-blue-600 text-xs font-bold hover:bg-blue-50 transition-colors"
              >
                VERIFY
              </button>
            </div>
          </div>
        )}

        {/* Fee Information & Total */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs font-semibold text-gray-500">Processing Fee ({paymentMethod === 'card' ? '2%' : 'Free'})</span>
            <span className={`text-sm font-bold ${paymentMethod === 'card' ? 'text-gray-800' : 'text-green-600'}`}>
              {paymentMethod === 'card' ? `₹${processingFee.toFixed(2)}` : 'FREE'}
            </span>
          </div>

          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-bold text-gray-400">Total amount</span>
            <span className="text-2xl font-black text-gray-900">₹{grandTotal.toFixed(2)}</span>
          </div>

          <button
            className="w-full rounded-2xl bg-blue-600 py-4 text-white font-bold text-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-600/50 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group"
            type="button"
            onClick={handlePayment}
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Place Order'}
            {!loading && <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>}
          </button>
          <button type="button" onClick={() => setStep(1)} className="w-full mt-4 text-xs font-bold text-gray-400 hover:text-gray-600 uppercase tracking-widest">Back</button>
        </div>
      </div>
    </div>
  )
}

function AddressForm({ setShippingAddress, setStep, initialAddress }) {
  const [addresses, setAddresses] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'add'
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    fullName: '', mobile: '', pinCode: '', flat: '', area: '', city: '', state: '', addressType: 'Home'
  });
  const [loadingPin, setLoadingPin] = useState(false);

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/users/address');
      setAddresses(data);
      // Auto-select default or first address
      const defaultAddr = data.find(a => a.isDefault);
      if (defaultAddr) setSelectedId(defaultAddr._id);
      else if (data.length > 0) setSelectedId(data[0]._id);

      if (data.length === 0) setView('add'); // No addresses, show add form
    } catch (error) {
      console.error('Failed to fetch addresses', error);
    } finally {
      setLoading(false);
    }
  };

  // Auto-fill logic
  useEffect(() => {
    if (formData.pinCode.length >= 5) {
      const fetchPinDetails = async () => {
        setLoadingPin(true);
        try {
          const res = await fetch(`https://api.postalpincode.in/pincode/${formData.pinCode}`);
          const data = await res.json();
          if (data && data[0].Status === 'Success') {
            const details = data[0].PostOffice[0];
            setFormData(prev => ({
              ...prev,
              city: details.District,
              state: details.State,
            }));
          }
        } catch (error) {
          // console.error('Failed to fetch pin code', error);
        } finally {
          setLoadingPin(false);
        }
      };
      fetchPinDetails();
    }
  }, [formData.pinCode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSaveAddress = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/users/address', formData);
      setAddresses(data);
      setView('list');
      // Select the newly added address (last one)
      if (data.length > 0) setSelectedId(data[data.length - 1]._id);
      // Reset form
      setFormData({ fullName: '', mobile: '', pinCode: '', flat: '', area: '', city: '', state: '', addressType: 'Home' });
    } catch (error) {
      console.error('Save address error:', error);
      alert(error.response?.data?.message || 'Failed to save address');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this address?')) return;
    try {
      const { data } = await api.delete(`/users/address/${id}`);
      setAddresses(data);
      if (selectedId === id) setSelectedId(null);
      if (data.length === 0) setView('add');
    } catch (error) {
      alert('Failed to delete address');
    }
  };

  const handleContinue = () => {
    const selected = addresses.find(a => a._id === selectedId);
    if (selected) {
      setShippingAddress(selected);
      setStep(2);
    } else {
      alert('Please select an address');
    }
  };

  if (loading) return <div className="py-10 text-center text-gray-500">Loading addresses...</div>;

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Shipping Address</h1>
        <p className="text-gray-500">Where should we deliver your order?</p>
      </div>

      {view === 'list' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses.map((addr) => (
              <div
                key={addr._id}
                onClick={() => setSelectedId(addr._id)}
                className={`p-5 rounded-xl relative cursor-pointer shadow-sm transition-all border-2 ${selectedId === addr._id ? 'border-primary bg-blue-50/30' : 'border-transparent bg-white hover:border-gray-200'}`}
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={(e) => handleDelete(e, addr._id)} className="text-gray-400 hover:text-red-500 transition-colors p-1" title="Delete Address">
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                  {selectedId === addr._id && <span className="material-symbols-outlined text-xl text-primary">check_circle</span>}
                </div>
                <div className="font-bold text-gray-900 mb-1">{addr.fullName}</div>
                <p className="text-sm text-gray-600 leading-relaxed mb-3">
                  {addr.flat}, {addr.area}, {addr.city}, {addr.state} - {addr.pinCode}
                </p>
                <div className="flex items-center gap-2">
                  <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded ${addr.addressType === 'Home' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'}`}>
                    {addr.addressType}
                  </span>
                  <span className="text-xs text-gray-500">Mobile: {addr.mobile}</span>
                </div>
              </div>
            ))}

            <div
              onClick={() => setView('add')}
              className="border-2 border-dashed border-gray-200 bg-gray-50 p-5 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all flex flex-col items-center justify-center text-gray-400 min-h-[140px]"
            >
              <div className="bg-white p-2 rounded-full mb-2 shadow-sm">
                <span className="material-symbols-outlined text-2xl text-blue-600">add</span>
              </div>
              <span className="text-sm font-bold text-gray-600">Add New Address</span>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              onClick={handleContinue}
              disabled={!selectedId}
              className="bg-blue-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Payment <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      )}

      {view === 'add' && (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-800">Add New Address</h3>
            {addresses.length > 0 && (
              <button onClick={() => setView('list')} className="text-sm font-semibold text-gray-500 hover:text-gray-800">
                Cancel
              </button>
            )}
          </div>

          <form onSubmit={handleSaveAddress} className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-blue-600 mb-1.5">Full Name</label>
              <input required name="fullName" value={formData.fullName} onChange={handleChange} className="w-full rounded-xl border-gray-200 p-3.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-gray-50" placeholder="John Doe" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-blue-600 mb-1.5">Mobile Number</label>
                <input required name="mobile" value={formData.mobile} onChange={handleChange} className="w-full rounded-xl border-gray-200 p-3.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-gray-50" placeholder="1234567890" />
              </div>
              <div>
                <label className="block text-xs font-bold text-blue-600 mb-1.5">Pincode / ZIP Code</label>
                <div className="relative">
                  <input required name="pinCode" value={formData.pinCode} onChange={handleChange} className="w-full rounded-xl border-gray-200 p-3.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-gray-50" placeholder="90001" />
                  {loadingPin && <span className="absolute right-4 top-3.5 size-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></span>}
                </div>
              </div>
            </div>

            <div>
              <input required name="flat" value={formData.flat} onChange={handleChange} className="w-full rounded-xl border-gray-200 p-3.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-gray-50" placeholder="Flat, House no., Building, Company, Apartment" />
            </div>

            <div>
              <input required name="area" value={formData.area} onChange={handleChange} className="w-full rounded-xl border-gray-200 p-3.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-gray-50" placeholder="Area, Street, Sector, Village" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <input required name="city" value={formData.city} onChange={handleChange} className="w-full rounded-xl border-gray-200 p-3.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-gray-50" placeholder="Town/City" />
              </div>
              <div>
                <input required name="state" value={formData.state} onChange={handleChange} className="w-full rounded-xl border-gray-200 p-3.5 text-sm focus:ring-2 focus:ring-blue-100 focus:border-blue-500 transition-all outline-none bg-gray-50" placeholder="State" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-3">Address Type</label>
              <div className="flex gap-4">
                <button type="button" onClick={() => setFormData({ ...formData, addressType: 'Home' })} className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${formData.addressType === 'Home' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <span className="material-symbols-outlined text-lg">home</span> Home <span className="text-[10px] font-normal ml-1 text-gray-500">All day delivery</span>
                </button>
                <button type="button" onClick={() => setFormData({ ...formData, addressType: 'Office' })} className={`flex-1 py-3 px-4 rounded-xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${formData.addressType === 'Office' ? 'border-blue-600 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                  <span className="material-symbols-outlined text-lg">work</span> Office <span className="text-[10px] font-normal ml-1 text-gray-500">10 AM - 6 PM</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end pt-6">
              <button type="submit" className="bg-blue-600 text-white font-bold py-4 px-12 rounded-xl shadow-lg shadow-blue-600/30 hover:bg-blue-700 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                Save & Continue
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default function CheckoutPage() {
  const [step, setStep] = useState(1);
  const [shippingAddress, setShippingAddress] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const { state } = useContext(CartContext);
  const total = state.cartItems.reduce((s, i) => s + i.price * i.qty, 0);

  // Lifted Payment State
  const [paymentMethod, setPaymentMethod] = useState('card');
  const processingFee = paymentMethod === 'card' ? (total * 0.02) : 0;

  // Enforce Login
  useEffect(() => {
    if (!token) {
      navigate('/login?redirect=/checkout');
    }
  }, [token, navigate]);

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Left Sidebar - Order Summary */}
      <div className="w-full lg:w-[400px] border-r border-gray-200 bg-white sticky top-0 h-screen overflow-hidden hidden lg:block">
        <OrderSummary cartItems={state.cartItems} total={total} processingFee={processingFee} />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4 lg:p-12 overflow-y-auto h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Stepper */}
          <div className="flex justify-center mb-12">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>1</div>
                <span className="font-bold text-sm">Address</span>
              </div>
              <div className={`w-16 h-1 rounded ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              <div className={`flex items-center gap-2 ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`size-8 rounded-full flex items-center justify-center font-bold text-sm ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>2</div>
                <span className="font-bold text-sm">Payment</span>
              </div>
            </div>
          </div>

          {step === 1 && (
            <AddressForm
              setShippingAddress={setShippingAddress}
              setStep={setStep}
              initialAddress={shippingAddress}
            />
          )}
          {step === 2 && (
            <CheckoutForm
              shippingAddress={shippingAddress}
              setStep={setStep}
              total={total}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              processingFee={processingFee}
            />
          )}
        </div>
      </div>
    </div>
  );
}
