# Contributing Guide

## Welcome Contributors!

Thank you for your interest in contributing to the Shop Management System. This document provides guidelines for contributing to the project.

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+
- Git

### Setup Development Environment

```bash
# 1. Fork the repository
# 2. Clone your fork
git clone https://github.com/yourusername/shop-management.git
cd shop-management

# 3. Install dependencies
cd app && npm install
cd ../server && npm install

# 4. Set up environment
cp .env.example .env
# Edit .env with your configuration

# 5. Run database migrations
npx prisma migrate dev

# 6. Seed database
npm run seed

# 7. Start development servers
# Terminal 1 - Frontend
cd app && npm run dev

# Terminal 2 - Backend
cd server && npm run dev
```

---

## Development Workflow

### Branch Naming

| Type | Pattern | Example |
|------|---------|---------|
| Feature | `feature/description` | `feature/qr-attendance` |
| Bug Fix | `fix/description` | `fix/login-redirect` |
| Hotfix | `hotfix/description` | `hotfix/security-patch` |
| Release | `release/version` | `release/v1.2.0` |

### Commit Messages

Follow conventional commits:

```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style (formatting)
- `refactor`: Code refactoring
- `test`: Test changes
- `chore`: Build/process changes

**Examples:**
```
feat(attendance): add QR code check-in functionality

Implement QR code generation and scanning for staff attendance.
Includes:
- QR code generation endpoint
- Scan and validate endpoint
- Real-time updates via WebSocket

Closes #123
```

```
fix(auth): resolve token refresh issue

Token refresh was failing due to expired refresh tokens not
being cleared from the database.

Fixes #456
```

---

## Code Standards

### TypeScript

```typescript
// ✅ Good - Explicit types
function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ❌ Bad - Implicit any
function calculateTotal(items) {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

// ✅ Good - Interface naming
interface UserProfile {
  id: number;
  name: string;
  email: string;
}

// ✅ Good - Enum naming
enum UserRole {
  Admin = 'admin',
  Operator = 'operator',
  Employee = 'employee',
}
```

### React Components

```typescript
// ✅ Good - Functional component with hooks
interface KPICardProps {
  title: string;
  value: string;
  trend?: { value: number; isPositive: boolean };
}

export function KPICard({ title, value, trend }: KPICardProps) {
  return (
    <div className="kpi-card">
      <h3>{title}</h3>
      <p>{value}</p>
      {trend && <span>{trend.value}%</span>}
    </div>
  );
}

// ✅ Good - Custom hook
function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}
```

### CSS/Tailwind

```typescript
// ✅ Good - Organized Tailwind classes
function Button({ variant, children }: ButtonProps) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  return (
    <button className={`${baseClasses} ${variantClasses[variant]}`}>
      {children}
    </button>
  );
}

// ✅ Good - Extract repeated patterns
const cardStyles = 'bg-white rounded-xl shadow-lg p-6';
const headingStyles = 'text-xl font-semibold text-gray-800';
```

---

## Testing Requirements

### Test Coverage

All new features must include:
- Unit tests for logic/functions
- Integration tests for API endpoints
- Component tests for UI elements

### Running Tests

```bash
# Frontend tests
cd app
npm test

# Backend tests
cd server
npm test

# E2E tests
npm run cypress:run
```

---

## Pull Request Process

### Before Submitting

1. **Sync with main**
   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run tests**
   ```bash
   npm test
   ```

3. **Check code style**
   ```bash
   npm run lint
   npm run format:check
   ```

4. **Update documentation**
   - Update README.md if needed
   - Update API.md for new endpoints
   - Add JSDoc comments

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests added/updated
- [ ] Integration tests added/updated
- [ ] Manual testing performed

## Screenshots (if applicable)

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] Tests pass
```

### Review Process

1. Automated checks must pass
2. At least one approval required
3. Address review comments
4. Squash commits if requested

---

## Feature Development

### Adding a New Feature

1. **Create issue first** - Discuss the feature
2. **Get approval** - Wait for maintainer approval
3. **Create branch** - `feature/your-feature-name`
4. **Develop** - Follow code standards
5. **Test** - Write comprehensive tests
6. **Document** - Update relevant docs
7. **Submit PR** - Use PR template

### Database Changes

```bash
# Create migration
npx prisma migrate dev --name add_new_feature

# Generate client
npx prisma generate

# Seed data (if needed)
npx prisma db seed
```

---

## Bug Reports

### Template

```markdown
**Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to '...'
2. Click on '...'
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Screenshots**
If applicable

**Environment**
- OS: [e.g., macOS 13]
- Browser: [e.g., Chrome 120]
- Version: [e.g., 1.2.0]

**Additional Context**
Any other information
```

---

## Code Review Guidelines

### For Reviewers

- Be constructive and respectful
- Explain the "why" behind suggestions
- Approve when requirements are met
- Request changes for blocking issues

### Review Checklist

- [ ] Code follows style guide
- [ ] Tests are comprehensive
- [ ] No security vulnerabilities
- [ ] Performance is acceptable
- [ ] Documentation is updated
- [ ] No console.log statements
- [ ] Error handling is proper

---

## Release Process

### Version Numbering

Follow Semantic Versioning (SemVer):
- `MAJOR.MINOR.PATCH`
- MAJOR: Breaking changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes

### Release Steps

1. **Update version**
   ```bash
   npm version minor  # or major/patch
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [1.2.0] - 2024-01-15
   
   ### Added
   - New QR code attendance feature
   - Export to Excel functionality
   
   ### Fixed
   - Login redirect issue
   ```

3. **Create release branch**
   ```bash
   git checkout -b release/v1.2.0
   ```

4. **Final testing**
   ```bash
   npm test
   npm run build
   ```

5. **Merge and tag**
   ```bash
   git checkout main
   git merge release/v1.2.0
   git tag v1.2.0
   git push origin main --tags
   ```

6. **Create GitHub release**
   - Draft release notes
   - Attach build artifacts
   - Publish

---

## Documentation

### Code Documentation

```typescript
/**
 * Calculate break-even point based on fixed costs and average margin
 * @param fixedCosts - Monthly fixed costs in USD
 * @param averageMargin - Average profit margin as decimal (e.g., 0.3 for 30%)
 * @returns Break-even sales amount needed
 * @example
 * const breakEven = calculateBreakEven(2622, 0.3);
 * console.log(breakEven); // 8740
 */
function calculateBreakEven(fixedCosts: number, averageMargin: number): number {
  return Math.round(fixedCosts / averageMargin);
}
```

### API Documentation

Update `API.md` when adding/modifying endpoints:

```markdown
### New Endpoint
```http
GET /api/new-endpoint
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```
```

---

## Community

### Communication Channels

- **GitHub Issues** - Bug reports and feature requests
- **GitHub Discussions** - General questions and ideas
- **Discord** - Real-time chat (link)

### Code of Conduct

1. Be respectful and inclusive
2. Welcome newcomers
3. Focus on constructive feedback
4. Respect different viewpoints

---

## Questions?

If you have questions about contributing:
1. Check existing documentation
2. Search closed issues
3. Ask in GitHub Discussions
4. Contact maintainers

Thank you for contributing! 🎉
