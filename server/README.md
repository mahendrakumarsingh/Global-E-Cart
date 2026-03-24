# E-Commerce Backend

Features implemented:
- JWT auth (register/login)
- Products CRUD (admin protected)
- Cart sync endpoints
- Orders (create, list user orders, admin list & update status)
- Razorpay Payment Integration (Order creation & Verification)
- Seed script to create admin and sample products

.env variables required:
- MONGO_URI
- JWT_SECRET
- RAZORPAY_KEY_ID
- RAZORPAY_KEY_SECRET

Run:
- npm install
- npm run seed
- npm run dev
