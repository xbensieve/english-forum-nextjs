# The Forum

The Forum is a modern, full-stack social networking platform built with Next.js, MongoDB, and TypeScript. It allows users to connect, share posts, and interact with content in a scalable and responsive environment.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Scripts](#scripts)
- [Deployment](#deployment)
- [License](#license)
- [Acknowledgments](#acknowledgments)

---

## Features

- **User Authentication**: Google OAuth integration using NextAuth.js.
- **Post Creation**: Users can create posts with text and images.
- **Video Sharing**: Upload and share videos with titles and descriptions.
- **Comments and Likes**: Engage with posts through comments and likes.
- **Chat Communication**: Real-time text chat with message history, Voice call in real-time.
- **Search**: User search to easily connect with others
- **News and Trends**: Dedicated sections for news and trending topics.
- **Responsive Design**: Optimised for both desktop and mobile devices.
- **Real-Time Updates**: Hot Module Replacement (HMR) for seamless development.

---

## Tech Stack

**Frontend:**
- [React](https://reactjs.org/)
- [Next.js](https://nextjs.org/)
- [Ant Design](https://ant.design/)
- [Tailwind CSS](https://tailwindcss.com/)

**Backend:**
- [Node.js](https://nodejs.org/)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [NextAuth.js](https://next-auth.js.org/)

**Other Tools:**
- [Cloudinary](https://cloudinary.com/) (for media uploads)
- [Axios](https://axios-http.com/) (for HTTP requests)
- [Turbopack](https://turbo.build/pack) (for fast bundling)
- [TypeScript](https://www.typescriptlang.org/) (for type safety)  

---

## Project Structure

```
.
├── .next/                     # Next.js build output
├── public/                    # Static assets
├── src/                       # Source code
│   ├── app/                   # Next.js app directory
│   │   ├── api/               # API routes
│   │   ├── components/        # Reusable UI components
│   │   ├── layout.tsx         # Application layout
│   │   ├── page.tsx           # Main page
│   │   └── videos/            # Videos page
│   ├── lib/                   # Utility libraries (e.g., MongoDB connection)
│   ├── models/                # Mongoose models (User, Post, Comment, Like)
│   └── styles/                # Global styles
├── .env                       # Environment variables
├── package.json               # Project dependencies
├── postcss.config.mjs         # PostCSS configuration
├── tailwind.config.js         # Tailwind CSS configuration
└── README.md                  # Project documentation
```

---

## Getting Started

### Prerequisites

Before running the project, make sure you have the following:

- **Node.js** (v16 or higher)  
- **MongoDB Atlas** account and cluster (for `MONGODB_URI`)  
- **Google OAuth Credentials** (Client ID and Client Secret from Google Cloud Console)  
- **Cloudinary Account** (Cloud name, API key, and API secret for media uploads)  
- **Firebase Project** (API Key, Auth Domain, Database URL, Project ID, Storage Bucket, Messaging Sender ID, App ID, and Measurement ID)  
- **NextAuth Secret** (for session security)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/xbensieve/the-forum-nextjs.git
   cd the-forum-nextjs
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory and add the following:

   ```
   MONGODB_URI=your-mongodb-connection-string
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-nextauth-secret

   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret

   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   NEXT_PUBLIC_CLOUDINARY_API_KEY=your-cloudinary-api-key
   NEXT_PUBLIC_CLOUDINARY_API_SECRET=your-cloudinary-api-secret

   NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   NEXT_PUBLIC_FIREBASE_DATABASE_URL=your-firebase-database-url
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   NEXT_PUBLIC_FIREBASE_APP_ID=your-firebase-app-id
   NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Environment Variables

| Variable                           | Description                                      |
|------------------------------------|--------------------------------------------------|
| `MONGODB_URI`                      | MongoDB Atlas connection string                  |
| `NEXTAUTH_URL`                     | Base URL for NextAuth.js                         |
| `NEXTAUTH_SECRET`                  | Secret key for NextAuth session encryption       |
| `GOOGLE_CLIENT_ID`                 | Google OAuth client ID                           |
| `GOOGLE_CLIENT_SECRET`             | Google OAuth client secret                       |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`| Cloudinary cloud name                            |
| `NEXT_PUBLIC_CLOUDINARY_API_KEY`   | Cloudinary API key                               |
| `NEXT_PUBLIC_CLOUDINARY_API_SECRET`| Cloudinary API secret                            |
| `NEXT_PUBLIC_FIREBASE_API_KEY`     | Firebase API key                                 |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase authentication domain                   |
| `NEXT_PUBLIC_FIREBASE_DATABASE_URL`| Firebase Realtime Database URL                   |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID`  | Firebase project ID                              |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket                       |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID             |
| `NEXT_PUBLIC_FIREBASE_APP_ID`      | Firebase app ID                                  |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase measurement ID                       |

---

## Scripts

- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm start` — Start the production server
- `npm run lint` — Run ESLint

---

## Deployment

The easiest way to deploy your Next.js app is to use [Vercel](https://vercel.com/new). For more details, see the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying).

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Ant Design](https://ant.design/)
- [NextAuth.js](https://next-auth.js.org/)

---

**Thanks for visiting**
