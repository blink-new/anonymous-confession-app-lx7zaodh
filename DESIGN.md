
# Anonymous Confession App - Design Document

## Overview
The Anonymous Confession App is a mobile application that allows users to share their thoughts and confessions anonymously. The app provides a safe space for honest expression with optional location tagging, while limiting users to one post per day to encourage thoughtful sharing.

## Core Features

### 1. Anonymous Confessions
- Users can post anonymous confessions once per day
- Confessions can include text content up to 500 characters
- Optional location tagging for context
- Each confession is displayed in a card-based UI with subtle anonymity indicators

### 2. Location Integration
- Users can optionally add their current location to confessions
- Location is displayed as a text description and map view
- Privacy is maintained by showing only general location information

### 3. Engagement Features
- Like system for showing support for confessions
- Comment system for discussion while maintaining anonymity
- View trending confessions (sorted by likes)
- View recent confessions (sorted by time)

### 4. User Authentication
- Email and password authentication
- User profiles store minimal information
- One confession per day limit enforced by tracking last confession date

## User Experience

### User Journey
1. **Sign Up/Sign In**: Users create an account or sign in with email and password
2. **Browse Confessions**: Users can view recent or trending confessions
3. **Post Confession**: Users can share their own confession once per day
4. **Engage**: Users can like confessions and comment on them
5. **Settings**: Users can manage their account and preferences

### Design Elements
- **Dark Theme**: A dark color palette with purple accents creates a safe, intimate atmosphere
- **Mask Imagery**: Subtle mask icons reinforce the anonymous nature of the app
- **Card-Based UI**: Each confession is displayed in a card with consistent styling
- **Location Pins**: Visual indicators for location-tagged confessions
- **Animations**: Subtle animations for interactions to enhance the user experience

## Technical Architecture

### Database Schema
- **Profiles**: Stores user information and tracks last confession date
- **Confessions**: Stores confession content, location data, and engagement metrics
- **Comments**: Stores comments on confessions

### Authentication
- Supabase authentication with email/password
- Row-level security policies to protect user data

### Data Flow
1. User authenticates through Supabase Auth
2. App fetches confessions from Supabase database
3. User interactions (likes, comments) update the database
4. Daily posting limit is enforced through database functions

## Future Enhancements
- Social sharing options
- Content moderation system
- Additional authentication methods
- Notification system for likes and comments
- Enhanced privacy features
- Customizable themes