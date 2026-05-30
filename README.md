# LifeFlow Fitness Frontend

Frontend application for LifeFlow Fitness.

Built with:

- React
- React Router
- Axios
- DnD Kit
- Jest
- React Testing Library
- Playwright

## Features

- Authentication
- Dashboard
- Workout logging
- Workout history
- Workout templates
- Personal best feedback
- Exercise library
- Statistics and progress tracking
- Responsive design

## Requirements

- Node.js 18+
- npm

## Installation

```bash
git clone <repo-url>
cd app
npm install
```

## Environment Variables

Create a `.env` file:

```env
REACT_APP_API_URL=http://localhost:5000
```

## Development

```bash
npm start
```

## Production Build

```bash
npm run build
```

Frontend runs on:

`http://localhost:3000`

## Testing

Run unit tests:

```bash
npm test
```
Run CI test suite:

```bash
npm run rest:ci
```

Run end-to-end tests:

```bash
npx playwright test
```

## Code Quality

```bash
npm run lint
npm run lint:fix
```

## Docker

```bash
npm run docker:dev
npm run docker:prod
```

## Project structure

The frontend follows a feature-based architecture:

```bash
src/
├── features/
├── shared/
├── styles/
├── tests/
└── App.jsx
```

## Related Repositories

- [Backend](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-backend)
- [Deployment](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-deploy)
- [Project Hub](https://gitlab.lnu.se/1dv613/student/sa226jf/project-hub)