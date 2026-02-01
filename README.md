# Online Medical Shop Backend

Welcome to the **Online Medical Shop Backend** project! This application allows users to purchase medicines, sellers to manage inventory, and admins to oversee users and orders.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Tech Stack](#tech-stack)
3. [Roles & Permissions](#roles--permissions)
4. [Installation](#installation)
5. [API Endpoints](#api-endpoints)
6. [Database Models](#database-models)
7. [Testing with Postman](#testing-with-postman)
8. [How to Contribute](#how-to-contribute)
9. [License](#license)

---

## Project Overview

This project is an **Online Medical Store** that allows **customers**, **sellers**, and **admins** to interact with a catalog of medicines. Customers can place orders, leave reviews, and manage their cart, while sellers can manage their inventory and orders. Admins can oversee the entire platform, including user and product management.

---

## Tech Stack

This project is built using the following technologies:

- **Express**: Web framework for building the RESTful API.
- **Prisma**: ORM for interacting with the PostgreSQL database.
- **BetterAuth**: Authentication system for managing user sessions and passwords.
- **PostgreSQL**: Relational database to store the data.
- **TypeScript**: For type safety and better developer experience.
- **Dotenv**: For managing environment variables.

---

### Development Dependencies


| **Role** | **Description**              | **Key Permissions**                                |
| -------- | ---------------------------- | -------------------------------------------------- |
| Customer | Users who purchase medicines | Browse, cart, order, track status, leave reviews   |
| Seller   | Medicine vendors/pharmacies  | Manage inventory, view orders, update order status |
| Admin    | Platform moderators          | Manage all inventory, users, oversee orders        |

-- 1. Clone the repository
git clone https://github.com/your-username/online-medical-store.git

-- 2. Install dependencies

```bash
cd online-medical-store
npm install
```

-- 3. Setup environment variables

```bash
DATABASE_URL=your-database-url
PORT=5000
```

-- 4. Run the server

```bash
npm run dev
```

-- 5. Run the server
```bash
npx prisma migrate dev
```
