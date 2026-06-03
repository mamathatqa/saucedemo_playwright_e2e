# Swag Labs – Playwright Test Suite

End-to-end test suite for [Swag Labs (SauceDemo)](https://www.saucedemo.com) built with Playwright and TypeScript.

---

## Project Structure

```
├── pages/
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── ProductDetailsPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── NavigationPage.ts
├── data/
│   ├── users.ts
│   ├── products.ts
│   └── checkout.ts
├── tests/
│   ├── cart.spec.ts
│   ├── checkout.spec.ts
│   ├── login.spec.ts
│   ├── navigation.spec.ts
│   ├── productdetails.spec.ts
│   └── products.spec.ts
├── playwright.config.ts
├── package.json
└── README.md
```

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `@playwright/test` | `^1.40.0` | Test runner, assertions, browser automation |
| `typescript` | `^5.0.0` | Language |
| `@types/node` | `^20.0.0` | Node.js type definitions (required by `tsconfig.json` `types` field) |

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### Steps

**1. Clone the repository**

```bash
git clone <your-repo-url>
cd <project-folder>
```

**2. Install dependencies**

```bash
npm install
```

**3. Install Playwright browsers**

```bash
npx playwright install
```

> To install only a specific browser (e.g. Chromium):
> ```bash
> npx playwright install chromium
> ```

---

## Running Tests

### Run all tests

```bash
npx playwright test
```

### Run a specific spec file

```bash
npx playwright test tests/login.spec.ts
npx playwright test tests/cart.spec.ts
npx playwright test tests/checkout.spec.ts
npx playwright test tests/products.spec.ts
npx playwright test tests/productdetails.spec.ts
npx playwright test tests/navigation.spec.ts
```

### Run by tag

```bash
# Run all regression tests
npx playwright test --grep @regression

# Run smoke tests only
npx playwright test --grep @smoke
```

### Run in headed mode (see the browser)

```bash
npx playwright test --headed
```

### Run in a specific browser

```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
npx playwright test --project=webkit
```

### Run with Playwright UI mode

```bash
npx playwright test --ui
```

### Run in debug mode

```bash
npx playwright test --debug
```

---

## Test Reports

### Open the HTML report after a run

```bash
npx playwright show-report
```

The report is generated at `playwright-report/index.html` after every test run.

---

## Test Coverage

| Spec File | Area | Tests |
|---|---|---|
| `login.spec.ts` | Login / Logout / Auth guards | Valid login, invalid login, logout, back-button protection |
| `products.spec.ts` | Product listing | Product count, images, details, sorting (A-Z, Z-A, price low-high, price high-low) |
| `productdetails.spec.ts` | Product detail page | Navigation, product info, add/remove cart, back button |
| `cart.spec.ts` | Shopping cart | Add/remove items, badge count, persistence after refresh, empty cart |
| `checkout.spec.ts` | Checkout flow | Info page validation, overview, tax, total, confirmation, cancel |
| `navigation.spec.ts` | Navigation menu & UI | Burger menu, all items, logout, reset state, footer, broken images |

---

## Test Data

All test data is centralised under `data/`:

- `users.ts` — valid user, problem user, invalid login scenarios
- `products.ts` — product names, prices, descriptions, sort options
- `checkout.ts` — valid checkout info, invalid checkout scenarios

---

## TypeScript Configuration

The project uses a `tsconfig.json` at the root. Key settings:

| Option | Value | Notes |
|---|---|---|
| `target` | `ES2020` | Output compiled to ES2020 |
| `module` | `commonjs` | Node.js compatible module format |
| `moduleResolution` | `node` | Resolves modules the Node.js way |
| `strict` | `true` | Full strict type checking enabled |
| `resolveJsonModule` | `true` | Allows importing `.json` files (e.g. test data) |
| `outDir` | `./dist` | Compiled output goes here — do not edit files here |
| `skipLibCheck` | `true` | Skips type checking of `node_modules` declaration files |

**Included in compilation:**

```
tests/        pages/        fixtures/
utils/        data/         playwright.config.ts
```

**Excluded from compilation:**

```
node_modules/     dist/
```

> The `dist/` folder is generated automatically — do not commit it to version control. Add it to your `.gitignore`:
> ```
> dist/
> ```

---

## Configuration

The Playwright configuration lives in `playwright.config.ts`. Key settings to be aware of:

```ts
baseURL: 'https://www.saucedemo.com'
```

To run against a different environment, update `baseURL` in `playwright.config.ts` or pass it at runtime:

```bash
BASE_URL=https://staging.saucedemo.com npx playwright test
```

---

## Recommended `package.json` Scripts

Add these to your `package.json` for convenience:

```json
"scripts": {
  "test": "playwright test",
  "test:smoke": "playwright test --grep @smoke",
  "test:regression": "playwright test --grep @regression",
  "test:headed": "playwright test --headed",
  "test:ui": "playwright test --ui",
  "report": "playwright show-report"
}
```

Then run with:

```bash
npm test
npm run test:smoke
npm run test:regression
npm run report
```