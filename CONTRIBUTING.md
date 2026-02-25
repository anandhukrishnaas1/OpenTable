# Contributing to OpenTable

Thank you for your interest in contributing to OpenTable! This guide will help you get started.

## 🚀 Quick Start

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/OpenTable.git`
3. Install dependencies: `npm install`
4. Create a `.env` file from `.env.example`
5. Start the dev server: `npm run dev`

## 📋 Development Guidelines

### Code Style
- **TypeScript** is required for all `.tsx` and `.ts` files
- Use **functional components** with React hooks
- Follow the existing **naming conventions** (PascalCase for components, camelCase for functions)
- Use **Tailwind CSS** classes for styling — avoid inline styles

### Commit Convention
Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add new volunteer notification system
fix: resolve donation status not updating
docs: update API documentation
refactor: simplify auth flow logic
```

### Branch Naming
```
feature/volunteer-notifications
fix/donation-status-bug
docs/api-reference
```

## 🧪 Before Submitting

- [ ] Run `npx tsc --noEmit` to verify type safety
- [ ] Test all user flows (Donor, Volunteer, Admin)
- [ ] Ensure no `console.log` statements in production code
- [ ] Update documentation if you changed any APIs

## 📝 Pull Request Process

1. Update the README.md with details of changes if applicable
2. Ensure the build passes with zero TypeScript errors
3. Request review from a maintainer
4. PRs require at least 1 approval before merging

## 🐛 Reporting Bugs

Open an issue with:
- **Description**: What happened vs. what you expected
- **Steps to Reproduce**: Numbered step-by-step guide
- **Environment**: Browser, OS, device type
- **Screenshots**: If applicable

## 💡 Feature Requests

Open an issue with:
- **Problem**: What problem does this solve?
- **Proposed Solution**: How should it work?
- **Alternatives Considered**: Other approaches you thought of

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.
