# BatwaraNow

**Developed by Umair**

*Built with React Native and Expo*

A modern, mobile-friendly React Native app for splitting expenses between friends and family during trips and events.
 This project is for learning/demo purposes only. Unauthorized reuse, distribution, or modification of this code without permission is prohibited.
 
## Features

### ✈️ Trip Management
- Create trips with custom names
- Add multiple participants to each trip
- View all your trips in a clean list
- Settlement History (if someone pays back it will have a record in this section )

### 💰 Expense Tracking
- Add expenses with descriptions and amounts
- Specify who paid for each expense
- Choose who should split each expense
- Automatic date tracking

### 🎨 Modern UI
- Clean, responsive design with soft colors
- Smooth navigation between screens
- Intuitive user experience
- Mobile-optimized interface

## Technical Details

### Built With
- **React Native** - Cross-platform mobile development
- **TypeScript** - Type safety and better development experience
- **Expo** - Development platform and tools
- **React Navigation** - Screen navigation

### State Management
- React's `useState` and `useEffect` hooks
- Local state management (no backend required)
- Temporary data storage in component state

### Components
- `TripListScreen` - Main trips overview
- `TripDetailScreen` - Individual trip details
- `AddExpenseScreen` - Expense creation form
- `CreateTripScreen` - Trip creation form
- `BalanceSummary` - Balance display component

### Utilities
- `balanceCalculator.ts` - Automatic balance calculation algorithm

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

1. Clone the repository:
```bash
git clone <https://github.com/Umairmaqsood00/BatwaraNow>
cd expensetracker
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```
4. Run on your preferred platform:
- Press `i` for iOS simulator
- Press `a` for Android emulator
- Scan QR code with Expo Go app on your phone


## Future Enhancements

- [ ] Persistent data storage
- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Export functionality
- [ ] Currency support
- [ ] Photo receipts
- [ ] Payment integration
- [ ] Group chat features
   



