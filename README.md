# Expense Split App

**Developed by Umair**

A modern, mobile-friendly React Native app for splitting expenses between friends and family during trips and events.

## Features

### ✈️ Trip Management
- Create trips with custom names
- Add multiple participants to each trip
- View all your trips in a clean list

### 💰 Expense Tracking
- Add expenses with descriptions and amounts
- Specify who paid for each expense
- Choose who should split each expense
- Automatic date tracking

### ⚖️ Balance Calculation
- Automatic calculation of who owes whom
- Clear display of outstanding balances
- Optimized settlement suggestions

### 🎨 Modern UI
- Clean, responsive design with soft colors
- Smooth navigation between screens
- Intuitive user experience
- Mobile-optimized interface

## Screens

### 1. Trip List Screen
- View all created trips
- See total expenses and participant count for each trip
- Create new trips with the "+ New Trip" button

### 2. Create Trip Screen
- Enter trip name
- Add/remove participants
- Customize participant names

### 3. Trip Detail Screen
- View trip summary (total expenses, participants, expense count)
- See current balances between participants
- List all expenses with details
- Add new expenses

### 4. Add Expense Screen
- Enter expense description and amount
- Select who paid (dropdown)
- Choose who should split (checkboxes)
- Form validation

### 5. Settings Screen
- App information and features
- Usage instructions
- Data management options

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
git clone <https://github.com/Umairmaqsood00/ExpenseTracker_By_Umair>
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

## Usage

### Creating a Trip
1. Tap "+ New Trip" on the main screen
2. Enter a trip name (e.g., "Weekend Trip to Goa")
3. Add participants by typing their names
4. Tap "Create" to save

### Adding Expenses
1. Select a trip from the list
2. Tap "+ Add" in the trip detail screen
3. Fill in the expense details:
   - Description (e.g., "Hotel Booking")
   - Amount (e.g., 4500)
   - Who paid (select from dropdown)
   - Who should split (checkboxes)
4. Tap "Save"

### Viewing Balances
- Balances are automatically calculated and displayed
- Shows who owes whom and how much
- Updates in real-time as expenses are added

## Sample Data

The app comes with sample data to demonstrate functionality:
- **Weekend Trip to Goa** with 3 participants (Alice, Bob, Charlie)
- 2 sample expenses (Hotel Booking and Dinner)
- Automatic balance calculations

## Future Enhancements

- [ ] Persistent data storage
- [ ] User authentication
- [ ] Cloud synchronization
- [ ] Export functionality
- [ ] Currency support
- [ ] Photo receipts
- [ ] Payment integration
- [ ] Group chat features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

