# Testing Documentation

## Overview

This document outlines the testing strategy for the Shop Management System.

---

## Testing Stack

| Type | Tool | Purpose |
|------|------|---------|
| Unit Testing | Jest | Component and function testing |
| E2E Testing | Cypress | End-to-end user flow testing |
| API Testing | Supertest | Backend API endpoint testing |
| Component Testing | React Testing Library | React component testing |

---

## Frontend Testing

### Setup

```bash
cd /mnt/okcomputer/output/app

# Install testing dependencies
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event cypress
```

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
};
```

### Component Test Examples

```typescript
// src/components/__tests__/KPICard.test.tsx
import { render, screen } from '@testing-library/react';
import { KPICard } from '../KPICard';
import { TrendingUp } from 'lucide-react';

describe('KPICard', () => {
  it('renders with correct title and value', () => {
    render(
      <KPICard
        title="Total Income"
        value="$1,250.00"
        icon={TrendingUp}
        trend={{ value: 12, isPositive: true }}
      />
    );

    expect(screen.getByText('Total Income')).toBeInTheDocument();
    expect(screen.getByText('$1,250.00')).toBeInTheDocument();
    expect(screen.getByText('+12%')).toBeInTheDocument();
  });

  it('displays negative trend correctly', () => {
    render(
      <KPICard
        title="Expenses"
        value="$500.00"
        icon={TrendingUp}
        trend={{ value: 5, isPositive: false }}
      />
    );

    expect(screen.getByText('-5%')).toBeInTheDocument();
  });
});
```

```typescript
// src/sections/__tests__/IncomeExpenseSection.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { IncomeExpenseSection } from '../IncomeExpenseSection';
import { ChakraProvider } from '@chakra-ui/react';

const renderWithProvider = (component: React.ReactNode) => {
  return render(<ChakraProvider>{component}</ChakraProvider>);
};

describe('IncomeExpenseSection', () => {
  it('renders transaction table', () => {
    renderWithProvider(<IncomeExpenseSection />);
    
    expect(screen.getByText('Income & Expenses')).toBeInTheDocument();
    expect(screen.getByText('Add New Income')).toBeInTheDocument();
    expect(screen.getByText('Add New Expense')).toBeInTheDocument();
  });

  it('opens add income dialog on button click', () => {
    renderWithProvider(<IncomeExpenseSection />);
    
    const addButton = screen.getByText('Add New Income');
    fireEvent.click(addButton);
    
    expect(screen.getByText('Add New Income')).toBeInTheDocument();
  });
});
```

### Custom Hooks Testing

```typescript
// src/hooks/__tests__/useLocalStorage.test.ts
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should initialize with default value', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    expect(result.current[0]).toBe('default');
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'default'));
    
    act(() => {
      result.current[1]('new value');
    });

    expect(result.current[0]).toBe('new value');
    expect(localStorage.getItem('key')).toBe('