# FormHook

The most powerful form builder for any site.

## Table of Contents

- [Features](#features)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Contributing](#contributing)
  - [Pull Requests](#pull-requests)
- [License](#license)

## Features

- Create usable forms in seconds
- Hosted forms for static sites
- Form UI templates
- Send email notifications, connect webhooks, & integrate with CRMs
- Custom field validation, bot protection, and file upload/storage

- Cooler features
  - Multi-step forms
  - Form success & redirects
  - Editable email templates
  - Cookies & UTM tracking
  - Exportable data
  - React SDK for form templates & validation (future)

## Project Structure

- `frontend` - Next.js app
- `api` - Workers API
- `packages/*` - Shared packages
  - `types/*` - Shared types
  - `ui/*` - UI components
  - `templates/*` - UI templates
  - `utils/*` - Shared utilities
- `cli` - CLI for managing Formhook
- `react` - React SDK

## Getting Started

1. Clone repository:

```bash
git clone https://github.com/dris-e/formhook.git
```

2. Install dependencies:

```bash
pnpm install
```

3. Generate Prisma client:

```bash
pnpm generate
```

4. Build packages:

```bash
pnpm build
```

5. Start development servers:

```bash
pnpm dev
```

6. Configure environment:

- Add your own bucket and database from Cloudflare to `api/wrangler.toml`.
- Add your own Resend API key and JWT secret to `api/.dev.vars.example` and rename it to `.dev.vars`.

## Usage

WIP

## Contributing

Contributions are welcome! Please feel free to [open an issue](https://github.com/dris-e/formhook/issues) or submit a [pull request](https://github.com/dris-e/formhook/pulls).

DM on Discord for questions (dris404).

Planning to launch end of Feb 2025?

### Pull Requests

1. Create a feature branch:

```bash
git checkout -b feature/new-feature
```

2. Make changes and commit:

```bash
git commit -m "feat: added new feature"
git commit -m "fix: fixed bug with..."
git commit -m "docs: updated readme"
```

3. Run checks before pushing:

```bash
pnpm lint        # lint
pnpm build       # see if it builds
pnpm test        # run tests (not yet added)
```

4. Push and create PR:

```bash
git push origin feature/new-feature
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
