import React, { useEffect, useState, useContext } from 'react'
import api from '../utils/api'
import CartContext from '../context/CartContext'
import { useNavigate } from 'react-router-dom'

// Helper Component for Countdown
const CountdownTimer = ({ targetDate }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetDate) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60))),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      };
    } else {
      timeLeft = { hours: 0, minutes: 0, seconds: 0 };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  const pad = (n) => n < 10 ? `0${n}` : n;

  return (
    <span>
      {pad(timeLeft.hours)}:{pad(timeLeft.minutes)}:{pad(timeLeft.seconds)}
    </span>
  );
};

export default function Home() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All Deals');
  const [visibleCount, setVisibleCount] = useState(8);
  const [sortOrder, setSortOrder] = useState('Trending'); // 'Trending', 'Highest Discount', 'Newest'

  // Hero Carousel State
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const heroDeals = deals.filter(d => d.isHeroDeal);

  const { dispatch } = useContext(CartContext);
  const navigate = useNavigate();

  // Carousel Auto-Slide
  useEffect(() => {
    if (heroDeals.length > 1) {
      const interval = setInterval(() => {
        setCurrentHeroIndex((prev) => (prev + 1) % heroDeals.length);
      }, 5000); // Change slide every 5 seconds
      return () => clearInterval(interval);
    }
  }, [heroDeals.length]);

  useEffect(() => {
    const fetchDeals = async () => {
      try {
        console.log('Fetching deals from API...');
        const { data } = await api.get('/deals');
        console.log('Deals fetched:', data);
        setDeals(data);
      } catch (error) {
        console.error('Failed to fetch deals:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDeals();
  }, []);

  const addToCart = (deal) => {
    dispatch({
      type: 'ADD_ITEM',
      payload: {
        product: deal._id,
        name: deal.title,
        image: deal.image,
        price: deal.price,
        deal: deal._id,
        qty: 1
      }
    });
  };

  const handleBuyNow = (deal) => {
    addToCart(deal);
    navigate('/cart');
  };

  const filteredDeals = deals.filter(deal => {
    if (activeCategory === 'All Deals') return true;
    if (activeCategory === 'Fashion') return deal.category.includes('Fashion') || deal.category.includes('Accessories');
    if (activeCategory === 'Electronics') return deal.category.includes('Electronics') || deal.category.includes('Computing') || deal.category.includes('Gaming');
    return deal.category.includes(activeCategory);
  });

  const sortedDeals = [...filteredDeals].sort((a, b) => {
    if (sortOrder === 'Highest Discount') {
      const discountA = (a.originalPrice - a.price) / a.originalPrice;
      const discountB = (b.originalPrice - b.price) / b.originalPrice;
      return discountB - discountA;
    } else if (sortOrder === 'Newest') {
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    return 0; // Trending (default order)
  });

  return (
    <div className="w-full">
      {/* Category Strip */}
      <div className="bg-white border-b border-[#f0f2f4]">
        <div className="mx-auto max-w-[1440px] flex gap-3 p-3 overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveCategory('All Deals')}
            className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 transition-colors ${activeCategory === 'All Deals' ? 'bg-primary/10 text-primary' : 'bg-[#f0f2f4] hover:bg-gray-200'}`}
          >
            <span className="material-symbols-outlined text-lg">local_fire_department</span>
            <span className="text-sm font-semibold">All Deals</span>
          </button>
          {['Fashion', 'Electronics', 'Home Decor', 'Appliances', 'Sports'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex h-10 shrink-0 items-center justify-center gap-2 rounded-xl px-4 transition-colors ${activeCategory === cat ? 'bg-primary/10 text-primary' : 'bg-[#f0f2f4] hover:bg-gray-200'}`}
            >
              <span className="text-sm font-medium">{cat}</span>
            </button>
          ))}
        </div>
      </div>

      <main className="mx-auto w-full max-w-[1440px] px-4 md:px-10 py-6">
        {/* Hero Section */}
        <section className="mb-10 overflow-hidden rounded-2xl relative group">
          {heroDeals.length > 0 ? (
            <div className="relative min-h-[400px] flex flex-col justify-end p-8 md:p-12 transition-all duration-700">
              {/* Background Image with Fade */}
              <div className="absolute inset-0 z-0">
                <img
                  key={heroDeals[currentHeroIndex]._id}
                  alt={heroDeals[currentHeroIndex].title}
                  className="h-full w-full object-cover animate-fadeIn"
                  src={heroDeals[currentHeroIndex].heroImage || heroDeals[currentHeroIndex].image}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-2xl animate-slideUp">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-red-600/20">
                  <span className="material-symbols-outlined text-xs">timer</span>
                  Ending in <CountdownTimer targetDate={heroDeals[currentHeroIndex].endTime} />
                </div>
                <h1 className="text-3xl md:text-5xl font-black text-white leading-tight mb-4 drop-shadow-sm line-clamp-2">
                  {heroDeals[currentHeroIndex].title}
                </h1>
                <p className="text-lg md:text-xl text-gray-200 mb-8 font-medium drop-shadow-sm">
                  Get it now for <span className="text-yellow-400 font-bold">₹{heroDeals[currentHeroIndex].price}</span>
                  <span className="text-sm text-gray-400 line-through ml-2">₹{heroDeals[currentHeroIndex].originalPrice}</span>
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => handleBuyNow(heroDeals[currentHeroIndex])}
                    className="flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white transition-all hover:bg-blue-600 hover:shadow-lg hover:shadow-primary/30 active:scale-95"
                  >
                    Shop Now
                  </button>
                  <button
                    onClick={() => addToCart(heroDeals[currentHeroIndex])}
                    className="flex h-12 w-12 items-center justify-center rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white transition-all hover:bg-white/20"
                  >
                    <span className="material-symbols-outlined">shopping_cart</span>
                  </button>
                </div>
              </div>

              {/* Carousel Indicators */}
              <div className="absolute bottom-6 right-8 flex gap-2 z-20">
                {heroDeals.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentHeroIndex(idx)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentHeroIndex ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            // Fallback Skeleton/Static if no deals logic fails (safety net)
            <div className="relative min-h-[400px] flex flex-col justify-end p-8 md:p-12 bg-gray-900">
              <div className="absolute inset-0 flex items-center justify-center text-white/20">
                <span className="material-symbols-outlined text-6xl animate-pulse">local_offer</span>
              </div>
            </div>
          )}
        </section>

        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Top Deals from Amazon, Flipkart & Myntra</h2>
            <p className="text-gray-500">Curated daily for the maximum savings.</p>
          </div>
          <div className="flex border-b border-gray-200">
            {['Trending', 'Highest Discount', 'Newest'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSortOrder(tab)}
                className={`px-4 py-2 text-sm font-bold transition-colors ${sortOrder === tab ? 'border-b-2 border-primary text-primary' : 'font-medium text-gray-500 hover:text-gray-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {loading ? (
            <div className="col-span-full h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : sortedDeals.length > 0 ? sortedDeals.slice(0, visibleCount).map(deal => (
            <div key={deal._id} className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-xl transition-all duration-300">
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img src={deal.image} alt={deal.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute top-3 left-3 flex flex-col gap-2">
                  <span className="rounded bg-red-600 px-2 py-1 text-xs font-bold text-white uppercase shadow-sm">{deal.discount}</span>
                  <span className={`flex items-center gap-1 rounded bg-white px-2 py-1 text-[10px] font-bold text-${deal.color} uppercase shadow-sm`}>
                    <span className="material-symbols-outlined text-xs">shopping_bag</span> {deal.source}
                  </span>
                </div>
              </div>
              <div className="flex flex-1 flex-col p-4">
                <p className="text-xs text-gray-500 mb-1">{deal.category}</p>
                <h3 className="font-semibold text-gray-900 line-clamp-2 mb-3">{deal.title}</h3>
                <div className="mt-auto">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold text-primary">₹{deal.price.toFixed(2)}</span>
                    <span className="text-sm text-gray-400 line-through">₹{deal.originalPrice.toFixed(2)}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => addToCart(deal)}
                      className="flex items-center justify-center rounded-lg border border-primary py-2.5 text-sm font-bold text-primary transition-colors hover:bg-primary/5"
                    >
                      Add to Cart
                    </button>
                    <button
                      onClick={() => handleBuyNow(deal)}
                      className="flex items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-bold text-white transition-colors hover:bg-primary/90"
                    >
                      Buy Now <span className="material-symbols-outlined text-base">open_in_new</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-12 text-center text-gray-500">
              No deals found in this category.
            </div>
          )}
        </div>

        {/* Load More */}
        {sortedDeals.length > visibleCount && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisibleCount(prev => prev + 8)}
              className="flex items-center gap-2 rounded-lg border border-gray-300 px-6 py-2 text-sm font-bold transition-colors hover:bg-gray-50"
            >
              Load More Deals
            </button>
          </div>
        )}
      </main>
    </div>
  )
}
