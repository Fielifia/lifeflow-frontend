# LifeFlow Frontend
Frontend for the LifeFlow Fitness project.
This is a React application created with Create React App.

> Note: The main React app lives in the `my-app/` folder. All commands below should be run inside `my-app/`.

## Requirements
- Node.js (recommended v18+)
- npm

## Installation
Clone the repository and install dependencies:

```bash
git clone <repo-url>
cd lifeflow-frontend/my-app
npm install
```

## Run the development server
Start the app with:

```bash
npm start
```
The server will run on:
```
http://localhost:3000
```
The frontend communicates with the backend API at http://localhost:5000

## API
The frontend uses a simple API wrapper in `src/api.js`:
```javascript
import axios from 'axios'

const API_URL = 'http://localhost:5000'

export const getTestMessage = async () => {
    try {
        const response = await axios.get(`${API_URL}/`)
        return response.data
    } catch (error) {
        console.error('Error fetching test message:', error)
        return null
    }
}
```

### Example endpoint
- `GET /` — test endpoint to verify backend connectivity.

## Environment variables
You can create a `.env` file in  `my-app` if needed (e.g., to configure the API URL).

Example:

```bash
REACT_APP_API_URL=http://localhost:5000
```

## Available scripts
| Script          | Description                                 |
| --------------- | ------------------------------------------- |
| `npm start`     | Runs the app in development mode            |
| `npm test`      | Launches test runner                        |
| `npm run build` | Builds the app for production               |
| `npm run eject` | Ejects CRA configuration (use with caution) |
