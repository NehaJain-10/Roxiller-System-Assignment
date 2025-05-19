
A full-stack Role-Based Management System built with **React.js**, **Express.js**, and **MySQL**.  
It allows different types of users (Admin, Normal User, Store Owner) to interact with stores and ratings based on their roles.

## 📌 Features

### 🔐 Authentication (JWT Based)
- Signup & login for all users
- Role-based redirection: Admin, User, Store Owner

### 👤 Admin
- Add new users and stores
- View all users and apply filters by name, email, address, role
- View store owner ratings
- Logout

### 🧑‍💼 Store Owner
- View store details and customer ratings
- Update password
- Logout

### 🙋 Normal User
- Search stores by name or address
- Rate or update rating for stores
- Update password
- Logout


##   1. Backend Setup--->
In Terminal

cd backend
cp .env.example .env       # Create a .env file with your DB credentials

npm install
node server.js             # Start backend at http://localhost:5000


## 2.Frontend Setup
In Terminal

cd frontend


npm install
npm start                 # Starts React app at http://localhost:3000



## MySQL Database Setup
Create the database using the provided roxiller.sql:

-- In MySQL CLI or Workbench----->

SOURCE path/to/roxiller.sql;  #Or create tables manually