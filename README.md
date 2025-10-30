# ✈️ FlightFinder: Secure Cross-Platform Flight Booking App

**FlightFinder** is a modern, cross-platform mobile application developed using **React Native** and the **Expo framework** to provide a secure and efficient experience for searching and viewing flight options. It implements a complete architecture for mobile development, from front-end search logic and responsive UI to external API integration and backend services.

-----

## ✨ Detailed Features

The application's core functionality is centered on a robust flight search mechanism and seamless user experience:

  * **Intelligent Flight Search Interface:**

      * Supports searching for both **one-way** and **round-trip** flights via a toggleable radio group.
      * Allows customization of the search based on origin, destination, departure date, and number of passengers.
      * Displays fetched flight results with key details such as airline, route, time, price, and duration.

  * **Real-time Airport/City Typeahead:**

      * Implements a debounced text input mechanism to query the flight API as the user types.
      * Uses the `/api/v1/flights/searchAirport` endpoint of the RapidAPI to retrieve location suggestions, improving search accuracy.

  * **Native Date Picker Integration:**

      * Leverages `@react-native-community/datetimepicker` for a native, platform-consistent date selection experience.
      * Enforces logical date constraints, ensuring the return date cannot be before the departure date.

  * **Modular Architecture:**

      * Utilizes **Expo Router** for a simple, file-system based routing structure, organizing the app into authenticated tabs (`/(tabs)/index.jsx`, `/(tabs)/bookings.jsx`, etc.).
      * API logic is abstracted into `services/flightApi.js` to handle key resolution, caching, network requests, and error handling (including retry logic for rate limits/transient errors).

-----

## 🛠️ Tech Stack & Architecture

| Category | Technology | Purpose and Details |
| :--- | :--- | :--- |
| **Mobile Framework** | **React Native (Expo)** | Core platform for building native applications from a single codebase. Uses Expo's managed workflow with the new Architecture enabled (`"newArchEnabled": true`). |
| **Data API** | **RapidAPI (Sky Scrapper)** | Provides real-time, comprehensive flight data. Used for both fuzzy airport/city search (`/searchAirport`) and structured flight itinerary search (`/searchFlights`). |
| **Backend Services** | **Firebase** | Initializes core Firebase services including **Authentication**, **Firestore** (Database), and **Storage** for a scalable backend. |
| **Routing** | **Expo Router** | A modern, high-performance router that handles navigation, linking, and deep linking using a file-system convention. |
| **State Management**| **React Context** | Manages global user details (e.g., `UserDetailContext`) to maintain state across different screens.|

-----

## 🚀 Getting Started

### Prerequisites

1.  Node.js (LTS version)
2.  Expo CLI (`npm install -g expo-cli`)

### Installation

1.  Clone the repository and install dependencies:
    ```bash
    npm install
    ```

### Configuration

The application requires configuration for both Firebase and the RapidAPI key.

#### 1\. Configure Firebase Services

```javascript
// config/firebaseConfig.jsx
const firebaseConfig = {
  apiKey: "YOUR_API_KEY", 
  authDomain: "YOUR_AUTH_DOMAIN", 
  projectId: "YOUR_PROJECT_ID",
  // ...other fields
};
```

#### 2\. Configure RapidAPI Key

Obtain an API key for the flight search service and set it as an environment variable named `EXPO_PUBLIC_RAPIDAPI_KEY`. This key is essential for fetching real-time flight data.

*Example `.env` file:*

```
EXPO_PUBLIC_RAPIDAPI_KEY="YOUR_RAPIDAPI_KEY_HERE"
```

### Running the Project

Start the Expo development server:

```bash
npm start
```

You can then run the application on your preferred platform using the commands below:

| Script | Platform | Description |
| :--- | :--- | :--- |
| `npm start` | All | Starts the Expo development server and opens the DevTools. |
| `npm run android` | Android | Runs the app on a connected Android device or emulator. |
| `npm run ios` | iOS | Runs the app in an iOS simulator or on a connected device. |
| `npm run web` | Web | Runs the application as a web app. |