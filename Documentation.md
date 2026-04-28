Xylo Apparel — System Documentation
Members:
John Reanne P. Viray
Christopher B. Raper
Section: IT-32
System Link (Deployed): https://xyl-apparel-production.up.railway.app
Github Repository Link: https://github.com/Jovi0125/XYL-Apparel


1. Introduction
Xylo Apparel (XYL-Apparel) is a web-based e-commerce system designed to sell clothing products online. The system provides a modern shopping experience for customers and an efficient management system for administrators, logistics staff, and delivery riders.
It is developed using Laravel, React, and Inertia.js, and follows a structured workflow for handling orders, inventory, and last-mile deliveries through an in-house rider fulfillment system.

2. Objectives
The system aims to:
Provide customers with an easy and smooth online shopping experience
Allow users to browse, add to cart, and purchase products
Help administrators manage products, orders, and users efficiently
Implement a structured order process (approval, packing, and delivery)
Enable in-house delivery fulfillment through a dedicated Rider Portal
Ensure secure access through role-based accounts

3. Scope of the System
The system includes the following features:
Product browsing by category (Women, Men, Unisex)
User registration and login
Shopping cart and checkout system
Order tracking and history
Wishlist and product reviews
Admin dashboard for managing products, orders, and reports
Logistics system for warehouse packing and rider assignment
Rider portal for last-mile delivery management
External services used:
Cloudinary for image storage

4. System Users
The system has four types of users:
Buyer – Can browse products, place orders, and manage their account
Admin – Manages products, orders, users, riders, and reports
Logistics Staff – Handles warehouse packing and assigns riders to shipments
Delivery Rider – Manages assigned deliveries from pickup to drop-off via a dedicated portal

5. System Features
5.1 Buyer Features
Register and login
Browse and search products
Add items to cart and checkout
Apply discount codes
Track orders with real-time status updates (Placed → Preparing → Ready for Pickup → Out for Delivery → Delivered)
View assigned rider information on orders
Add products to wishlist
Submit product reviews
5.2 Admin Features
Manage products and categories
Approve or reject orders
Monitor inventory
Manage users
Create and manage rider accounts (auto-generated RDR-XXX identifiers)
View reports and analytics
Handle discounts and promotions
Monitor all shipments with rider assignment details
5.3 Logistics Features
View approved orders
Update warehouse status (Preparing → Ready for Pickup)
Assign delivery riders to packed shipments
5.4 Rider Features
Dedicated login portal (XYLO.RIDER)
View assigned deliveries on a personal dashboard
Update delivery status (Out for Delivery → Delivered)
Real-time delivery card interface optimized for mobile use

6. Order Process
The system follows a step-by-step order workflow:
Customer places an order
Admin reviews and approves the order
Logistics prepares the shipment in the warehouse
Logistics marks the shipment as "Ready for Pickup" and assigns a rider
Rider picks up the package and marks it as "Out for Delivery"
Rider delivers and marks the shipment as "Delivered"
Payment is automatically marked as completed (COD)

7. Technology Used
Backend:
Laravel (PHP)
MySQL
Frontend:
React
Tailwind CSS
Inertia.js
Tools & Services:
Cloudinary (image storage)

8. Security Features
Passwords are encrypted
Role-based access control with four distinct roles (buyer, admin, logistics, rider)
Separate login portals for each staff role
Input validation on all forms
Protection against unauthorized access
Session and authentication security

9. Key Rules of the System
Only buyers can register accounts; staff and rider accounts are created by admins
Orders must be approved before shipping
Logistics can only update warehouse statuses (Preparing and Ready for Pickup)
Riders can only update delivery statuses (Out for Delivery and Delivered)
Payments are recorded after delivery (COD)
Stock is reduced when an order is placed
Reviews are only allowed after delivery
Each rider is identified by a unique rider number (e.g., RDR-001)

10. Conclusion
Xylo Apparel is a complete e-commerce system that provides a user-friendly shopping experience and efficient management tools. It features an in-house delivery rider system that separates warehouse operations from last-mile delivery, ensuring organized order processing, secure transactions, and a scalable system design suitable for real-world use.
