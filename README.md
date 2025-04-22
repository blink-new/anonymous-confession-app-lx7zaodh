
# Anonymous Confession App

A mobile application for sharing anonymous confessions with optional location tagging. Built with React Native, Expo, and Supabase.

## Features

- **Anonymous Confessions**: Share your thoughts anonymously with the community
- **Location Tagging**: Optionally add your location to provide context
- **Daily Limit**: One confession per day to encourage thoughtful sharing
- **Trending & Recent Views**: Browse confessions by popularity or recency
- **Comments & Likes**: Engage with other users' confessions
- **Dark Theme**: Beautiful dark UI with mask imagery and card-based posts

## Tech Stack

- **Frontend**: React Native with Expo
- **Backend**: Supabase (Authentication, Database, Storage)
- **UI Components**: Custom components with Reanimated for animations
- **Maps**: React Native Maps for location visualization
- **State Management**: React Context API

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- npm or yarn
- Expo CLI
- Supabase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/anonymous-confession-app.git
   cd anonymous-confession-app
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```
   npm run dev
   ```

5. Open the app on your device using the Expo Go app or run on a simulator.

### Database Setup

The app requires the following tables in your Supabase database:

- `profiles`: Stores user information and tracks last confession date
- `confessions`: Stores confession content, location data, and engagement metrics
- `comments`: Stores comments on confessions

SQL scripts for creating these tables are included in the `supabase` directory.

## Usage

1. **Sign Up/Sign In**: Create an account or sign in with your email and password
2. **Browse Confessions**: View recent or trending confessions on the home screen
3. **Post a Confession**: Tap the plus icon to create a new confession (limited to one per day)
4. **Add Location**: Optionally add your current location to your confession
5. **Engage**: Like confessions and add comments to engage with the community
6. **Settings**: Manage your account settings and preferences

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Expo](https://expo.dev/)
- [React Native](https://reactnative.dev/)
- [Supabase](https://supabase.io/)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)