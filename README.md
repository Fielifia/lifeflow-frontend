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

## Application Screenshots

The following screenshots illustrate key workflows and functionality available in the final MVP release of LifeFlow Fitness.

<details>
<summary>LifeFlow Fitness Print Screens</summary>

<img width="271" height="600" alt="LifeFlow Fitness Dashboard" src="https://github.com/user-attachments/assets/927b1f53-ebd3-4a00-ae5d-3c779cbcc17e" />

**Dashboard** displaying workout statistics, recent activity, monthly goal progress, and an active workout session.

<img width="271" height="600" alt="LifeFlow Fitness Workout Templates Page" src="https://github.com/user-attachments/assets/008db3c1-ceb5-4d6b-bed2-5c753473e4e8" />

**Workout templates page** showing reusable workout routines and the ability to start a workout from scratch or a saved template. Or continue ongoing workout.

<img width="271" height="600" alt="LifeFlow Fitness Active Workout" src="https://github.com/user-attachments/assets/e6559e30-541c-4f1c-bb36-2e0b244100e4" />

**Active workout session** with exercise tracking, set logging, rest timers, and automatic personal best detection.

<img width="271" height="600" alt="LifeFlow Fitness Exercise Library" src="https://github.com/user-attachments/assets/3025ef47-2e4a-418f-9950-ef9744ea1099" />

**Exercise library** with search, filtering, favorites, and exercise selection during an active workout.

<img width="271" height="600" alt="LifeFlow Fitness Workout History Page" src="https://github.com/user-attachments/assets/6a0a7395-5bea-45e8-a3f1-ab7aa314742b" />

**Workout history page** showing completed workouts, workout details, and the ability to reuse previous sessions.

<img width="271" height="600" alt="LifeFlow Fitness Statistics Page" src="https://github.com/user-attachments/assets/fd38267b-8172-4822-8a45-cff283364218" />

**Statistics page** displaying workout volume, workout frequency, personal bests, and exercise insights.

<img width="271" height="600" alt="LifeFlow Fitness Profile Page" src="https://github.com/user-attachments/assets/46f4860f-cba7-4919-8610-443790a11939" />

**Profile page** with workout preferences, monthly goals, rest timer settings, and account-specific configuration.

</details>

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

Prerequisites:

- Frontend running on http://localhost:3000
- Backend running on http://localhost:5000
- Exercise database seeded

The test creates a temporary user automatically.

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

- [Backend](https://github.com/Fielifia/lifeflow-backend)
- [Deployment](https://github.com/Fielifia/lifeflow-deploy)
- [Project Documents](https://github.com/Fielifia/lifeflow-docs)
