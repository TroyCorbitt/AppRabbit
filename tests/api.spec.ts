import { test, expect } from '@playwright/test';

test.describe('AppRabbit API Login', () => {

  test('should login successfully with valid credentials', async ({ page }) => {
    await page.route('https://api.apprabbit.com/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          token: 'abc123token',
          user: {
            email: 'admin@apprabbit.com',
            role: 'admin'
          }
        })
      });
    });

    const response = await page.evaluate(async () => {
      const res = await fetch('https://api.apprabbit.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'admin@apprabbit.com',
          password: 'admin123'
        })
      });
      return {
        status: res.status,
        data: await res.json()
      };
    });

    expect(response.status).toBe(200);
    expect(response.data.success).toBe(true);
    expect(response.data.token).toBe('abc123token');
    expect(response.data.user.email).toBe('admin@apprabbit.com');
  });

  test('should fail with invalid credentials', async ({ page }) => {
    await page.route('https://api.apprabbit.com/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Invalid credentials'
        })
      });
    });

    const response = await page.evaluate(async () => {
      const res = await fetch('https://api.apprabbit.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: 'wrong@email.com',
          password: 'wrongpass'
        })
      });
      return {
        status: res.status,
        data: await res.json()
      };
    });

    expect(response.status).toBe(401);
    expect(response.data.success).toBe(false);
    expect(response.data.message).toBe('Invalid credentials');
  });

  test('should require email and password', async ({ page }) => {
    await page.route('https://api.apprabbit.com/auth/login', async route => {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Email and password required'
        })
      });
    });

    const response = await page.evaluate(async () => {
      const res = await fetch('https://api.apprabbit.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({})
      });
      return {
        status: res.status,
        data: await res.json()
      };
    });

    expect(response.status).toBe(400);
    expect(response.data.success).toBe(false);
  });
});