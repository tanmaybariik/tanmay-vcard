# 📱 Tanmay Barik - Digital Visiting Card

A premium, highly interactive Digital Visiting Card built with Next.js, TailwindCSS, and Framer Motion. This project features a stunning glassmorphism design inspired by Apple's UI, complete with a Music Player, Games Hub, World Clock, and seamless smooth animations.

## ✨ Features

- **Apple Glass Design:** Translucent UI elements with beautiful mesh gradient backgrounds that animate smoothly at 60 FPS.
- **Interactive Music Player:** Play songs directly from YouTube using a custom, hidden YouTube iframe player, complete with synced scrolling lyrics.
- **Games Hub:** Play mini-games without leaving the page.
- **World Clock:** View multiple time zones dynamically.
- **Add to Contacts:** Instantly download a `.vcf` file to add Tanmay to your phone's address book.
- **Performance Optimized:** Features lazy loading, dynamic imports, and optimized next/image components for maximum performance.

## 🚀 Tech Stack

- **Framework:** Next.js (React)
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Icons:** Lucide React
- **Media:** react-youtube (for Music Player)

## 💻 Getting Started

To run the project locally on your machine:

1. **Install dependencies:**
   ```bash
   npm install
   # or yarn / pnpm install
   ```

2. **Run the development server:**
   ```bash
   npm run dev
   # or yarn dev / pnpm dev
   ```

3. **Open the app:**
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

---

## 🎵 How to Add a New Song to the Music Player

The Music Player in this project plays songs using YouTube video IDs. To add or update a song, you only need to modify the `initialPlaylists` object inside `components/MusicPlayer.tsx`.

### Step-by-Step Guide:

**1. Find your song on YouTube**
Go to YouTube and find the song you want to add. Look at the URL in your browser.
Example URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

**2. Copy the YouTube ID (`ytId`)**
The `ytId` is the string of characters after `v=`. 
In the example above, the `ytId` is **`dQw4w9WgXcQ`**.

**3. Open `components/MusicPlayer.tsx`**
Find the `initialPlaylists` object at the top of the file. It is divided by categories (e.g., Bengali, Hindi, English).

**4. Add the new song object**
Add a new entry to the array of the language/category you prefer using this exact format:

```typescript
{ 
  id: 'unique_id', // Give it a unique ID (e.g., 'e4' or 'h4')
  title: 'Song Name', 
  artist: 'Artist Name', 
  ytId: 'dQw4w9WgXcQ', // Paste the YouTube ID here
  lyrics: "Line 1 of lyrics...\n\nLine 2 of lyrics...\nLine 3 of lyrics..." // Use \n for line breaks
}
```

**Example:**
```typescript
const initialPlaylists = {
  English: [
    // ... existing songs ...
    { 
      id: 'e4', 
      title: 'Never Gonna Give You Up', 
      artist: 'Rick Astley', 
      ytId: 'dQw4w9WgXcQ', 
      lyrics: "We're no strangers to love\nYou know the rules and so do I\n\nA full commitment's what I'm thinking of\nYou wouldn't get this from any other guy" 
    },
  ]
};
```

**5. Save the file!**
The app will automatically reload, and your new song will be ready to play, complete with dynamic lyrics and automatically fetched album art from YouTube!
