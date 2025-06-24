## Rate My Store

![Banner](https://github.com/MilakeSuraj/Tic_Tac_Toe_Game/blob/main/Beige%20Modern%20Elegant%20Personal%20LinkedIn%20Banner%20(1).png?raw=true)

# Project Overview

***A full-stack web application for rating stores, with role-based access for Admin, Store Owner, and Normal User.***

# User Roles & Permissions

### ***1. Normal User***
- **Register/Login:** Can register and log in directly.
- **Browse Stores:** Can view the list of stores and store details.
- **Rate Stores:** Can submit and update ratings for stores.
- **View Own Ratings:** Can see their own ratings.

### ***2. Store Owner***
- **Register/Login:** Must submit a registration request; access is granted after admin approval.
- **Dashboard:** Can view only their own stores and ratings.
- **Add Store:** Can add new stores (with name, email, address, image).
- **Delete Store:** Can delete only their own stores.
- **View Ratings:** Can see ratings for their stores.

### ***3. Admin***
- **Register/Login:** Only another Admin have access for the adding new admin.
- **Dashboard:** Can view statistics (total users, stores, ratings, pending requests).
- **Manage Users:** Can view, add, and delete any user. Can filter users by name, email, address, or role.
- **Manage Stores:** Can view, add, and delete any store.
- **View Ratings:** Can view all ratings, including user and store info.
- **Approve/Reject Requests:** Can approve or reject pending registration requests for Store Owners.

# Application Flow

### ***Registration***
- **Normal User:** Registers and can log in immediately.
- **Store Owner:** Registers as a request. Admin must approve before login is possible.
- **Admin:** Another admin can add.

### ***Login***
- Redirects users to their respective dashboards based on role.

### ***Admin Dashboard*** 
- Shows stats: total users, stores, ratings, and pending requests.
- Can navigate to manage users, stores, ratings, and requests.

### ***User Management (Admin)***
- View all users.
- Add new users (direct approval).
- Delete users.
- View user details, including average ratings for Store Owners.

### ***Store Management*** 
- **Admin:** Can view/add/delete any store.
- **Store Owner:** Can view/add/delete only their own stores.

### ***Ratings***
- **Normal User:** Can rate any store.
- **Store Owner/Admin:** Can view ratings for their stores (Owner) or all ratings (Admin).

### ***Requests (Admin)***
- View all pending registration requests.
- Approve or reject requests.

### ***API Endpoints (Backend)***

- `/api/auth/register` - Register user (direct for Normal User, request for store owner)
- `/api/auth/register-request` - Submit registration request (Store Owner)
- `/api/auth/pending-requests` - Get all pending requests (Admin)
- `/api/auth/approve-request/:id` - Approve a pending request (Admin)
- `/api/auth/reject-request/:id` - Reject a pending request (Admin)
- `/users` - List/filter users (Admin)
- `/users/:id` - Get user details (Admin)
- `/users/:id` (DELETE) - Delete user (Admin)
- `/api/stores` - List/add stores (role-based)
- `/api/stores/:id` (DELETE) - Delete store (role-based)
- `/api/ratings` - Submit/view ratings

### ***Technologies Used*** 

- **Frontend:** React, Bootstrap
- **Backend:** Node.js, Express, Sequelize,MySQL
- **Authentication:** JWT (JSON Web Token)
- **Role-based Access:** Enforced in both frontend routes and backend API

# How to Run

### ***Backend***
```sh
cd backend
npm install
npm start
```

### ***Frontend***
```sh
cd frontend
npm install
npm start
```

**Open [http://localhost:3001](http://localhost:3001) for frontend and [http://localhost:3000](http://localhost:3000) for backend (adjust ports as needed).**

---

# Summary Table

| ***Feature***          | ***Normal User***| ***Store Owner*** | ***Admin***               |
|------------------------|-------------|---------------------|----------------------|
| Register/Login         | Direct      | Request + Approval  | Approval             |
| View Stores            | Yes         | Own stores only     | All stores           |
| Add Store              | No          | Yes                 | Yes                  |
| Delete Store           | No          | Own stores only     | Any store            |
| Rate Store             | Yes         | No                  | Yes                  |
| View Ratings           | Own ratings | Own stores' ratings | All ratings          |
| Manage Users           | No          | No                  | Yes                  |
| Approve/Reject Users   | No          | No                  | Yes                  |

---

***For more details, see the code in [store-rating-app/frontend](https://github.com/MilakeSuraj/Rate_My_Shop/tree/master/store-rating-app/frontend) and [store-rating-app/backend](https://github.com/MilakeSuraj/Rate_My_Shop/tree/master/store-rating-app/backend).***
