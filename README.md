# VERVE RUN CLUB 🏃‍♂️💨

A high-performance, aesthetically driven platform for the Verve Run Club, featuring real-time Strava integration, XP-based progression, and an industrial-minimalist aesthetic.

## ✨ Features
- **Strava Integration:** Real-time activity syncing and authentication.
- **Dynamic Leaderboards:** Compete with the club in a sleek, high-fidelity interface.
- **XP & Badges:** Earn XP and unlock achievements based on your running performance.
- **Premium UI:** Built with custom animations, glassmorphism, and Bebas Neue typography.

## 🛠 Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS + Framer Motion
- **Database/Auth:** Supabase
- **API Integration:** Strava OAuth2
- **Deployment:** Vercel

## 🚀 Getting Started for the Team

### 1. Clone the repository
```bash
git clone https://github.com/ammanojha10/Verve.git
cd Verve
```

### 2. Set up Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Fill in the values in `.env.local`. You will need:
- **Supabase** credentials (URL, Anon Key, Service Role Key)
- **Strava** API credentials (Client ID, Secret, Verify Token)

### 3. Install dependencies
```bash
npm install
```

### 4. Run the development server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to see the result.

## 📁 Project Structure
- `/app`: Next.js App Router pages and API routes.
- `/components`: Reusable UI components (Nav, Leaderboard, etc.).
- `/lib`: Utility functions and API clients (Strava, Supabase).
- `/supabase`: Database schemas and migrations.

## 🤝 Contributing
1. Create a new branch: `git checkout -b feature/your-feature-name`
2. Commit your changes: `git commit -m 'Add some feature'`
3. Push to the branch: `git push origin feature/your-feature-name`
4. Open a Pull Request.

---
*Built with ❤️ by the Verve Development Team.*
