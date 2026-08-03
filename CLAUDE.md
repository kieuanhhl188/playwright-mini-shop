# CLAUDE.md

## Run

npx playwright test

## Coding Rules

- Use TypeScript
- Use Page Object Model
- One page = one file
- Prefer getByRole/getByLabel
- Avoid XPath
- Never use waitForTimeout
- Use expect() for assertions

## Folder

/pages
/tests

## Test Style

- One scenario per test
- Reuse page objects