# Airbnb Clone (Full-Stack Web Application)

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-lightgrey?style=for-the-badge&logo=ejs&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)
![Passport.js](https://img.shields.io/badge/Passport.js-34E27A?style=for-the-badge&logo=passport&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![Joi](https://img.shields.io/badge/Joi-white?style=for-the-badge&logo=joi&logoColor=black)

---

## 📄 Project Overview

This is a full-stack web application built with **Node.js** and **Express.js** that mimics Airbnb's core functionality. Users can create, view, edit, and delete property listings, as well as leave reviews for properties. The application includes complete user authentication, authorization, and file upload capabilities, providing a robust platform for managing rental properties.

---

## ✨ Live Demo & Repository

* **Live Demo:** [**Add Your Live Demo URL Here**](YOUR_LIVE_DEMO_URL_HERE) 
* **GitHub Repository:** [https://github.com/Moiz0/airbnb-clone](https://github.com/Moiz0/airbnb-clone) (Update this if your repo name is different)

---
## ⚙️ Setup & Installation

Follow these steps to get a development copy of the project running on your local machine.


### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Moiz0/airbnb-clone.git](https://github.com/Moiz0/airbnb-clone.git)
    cd airbnb-clone
    ```
2.  **Install backend dependencies:**
    ```bash
    npm install  # or yarn install
    ```
3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory of the project. This file will store your sensitive information.
    ```
    PORT=8080
    DB_URL="your_DB_URL" 
    SECRET="your_secret_string"
    CLOUDINARY_NAME="your_cloudinary_cloud_name"
    CLOUDINARY_API_KEY="your_cloudinary_api_key"
    CLOUDINARY_API_SECRET="your_cloudinary_api_secret"
    ```
    * **MongoDB Atlas:** Get your `DB_URL` from your MongoDB Atlas dashboard (replace `<username>`, `<password>`, `your_database_name`).
    * **Cloudinary:** Sign up for a free Cloudinary account to get your `CLOUDINARY_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET`.
    * **Secrets:** Generate strong, random strings for `JWT_SECRET` and `SESSION_SECRET`.

4.  **Initialize the Database (Seed Data):**
    To populate your database with sample listings:
    ```bash
    node init/index.js
    ```
    *(Note: This script assigns a default owner ID from the `init/data.js` file. You may need to replace this with a valid User ID from your database if you encounter ownership-related errors after seeding.)*

5.  **Run the Application:**
    ```bash
    node app.js
    ```
    The application should now be running on `http://localhost:4000` (or the port specified in your `.env` file).



---

## 🛠️ Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** MongoDB (via MongoDB Atlas) with Mongoose ODM
* **Authentication:** Passport.js (Local Strategy)
* **File Upload:** Multer, Cloudinary
* **Templating:** EJS, EJS-Mate
* **Validation:** Joi
* **Session Management:** Express-session, Connect-Mongo
* **Styling:** Bootstrap, Custom CSS
* **Development Tools:** Git, GitHub

---
## 🚀 Key Features

* **User Authentication:** Secure local strategy with Passport.js, session management, automatic login after registration, and secure password hashing.
* **Authorization:** Role-based access control with `isLoggedIn`, `isOwner`, and `isReviewAuthor` middleware to protect routes and ensure data integrity.
* **CRUD Operations:** Full Create, Read, Update, and Delete functionality for property listings and reviews.
* **File Uploads:** Integrated Multer for handling image uploads, with Cloudinary for cloud storage and image transformation.
* **Data Validation:** Robust server-side validation using Joi schemas to ensure data consistency and integrity.
* **Error Handling:** Custom error classes (`ExpressError`), an async error wrapper (`wrapAsync`), and a global error handler for comprehensive error management and user-friendly error pages.
* **Flash Messages:** Session-based success/error notifications with Bootstrap styling for improved user feedback.
* **Database Relationships:** Implemented one-to-many relationships (User to Listings, Listing to Reviews) with efficient Mongoose population and cascade deletion of associated data.
* **Search Functionality:** Allows users to search listings by location, country, or title.
* **Responsive Design:** Mobile-friendly interface with Bootstrap styling and responsive image handling.
* **Security:** Utilizes HTTP-only cookies, session expiration, and method override for basic CSRF protection.



## 📁 Architecture & File Structure
  




### Prerequisites

* [Git](https://git-scm.com/downloads)
* [Node.js](https://nodejs.org/en/download/) (LTS version recommended)
* [MongoDB](https://www.mongodb.com/try/download/community) (Local instance or MongoDB Atlas account)


## 🤝 Contributing

Feel free to fork the repository and submit pull requests. For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details. 

---

## 🧑‍💻 Author

**Abdul Moiz**
* [GitHub](https://github.com/Moiz0)
* [LinkedIn](https://www.linkedin.com/in/abdul-moiz-82357724b/) 

---