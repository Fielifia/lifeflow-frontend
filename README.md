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
- Personal best detection
- Exercise library
- Statistics and progress tracking
- Responsive design

## Requirements

- Node.js 22+
- npm

## Installation

```bash
git clone <repo-url>
cd lifeflow-frontend/app
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

Frontend runs on:

`http://localhost:3000`

## Production Build

```bash
npm run build
```

The generated build folder is served through nginx in the production environment.

## Testing

Run unit tests:

```bash
npm test
```

Run CI test suite:

```bash
npm run test:ci
```

Run end-to-end tests:

```bash
npx playwright test
```

## CI/CD

The frontend is automatically validated through GitLab CI/CD.

Pipeline checks include:

- ESLint
- Jest
- React Testing Library
- Playwright end-to-end tests
- Production build verification

All checks must pass before deployment.

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

```txt
src/
├── features/
├── shared/
├── styles/
├── tests/
└── App.jsx
```

## License

This project is licensed under the MIT License. See the [LICENSE](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-frontend/-/edit/main/LICENSE?ref_type=heads) file for details.

## Related Repositories

- [Backend](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-backend)
- [Deployment](https://gitlab.lnu.se/1dv613/student/sa226jf/workspace/lifeflow-deploy)
- [Project Hub](https://gitlab.lnu.se/1dv613/student/sa226jf/project-hub)