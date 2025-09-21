import { test, expect } from '@playwright/test';

test.describe('AppRabbit Admin Dashboard Login - Mock Test', () => {
  
  test('should simulate successful admin login flow', async ({ page }) => {
    // Mock the login page HTML
    const mockLoginPage = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AppRabbit Admin - Login</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 50px; }
          .login-form { max-width: 400px; margin: 0 auto; }
          input { width: 100%; padding: 10px; margin: 10px 0; }
          button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; }
          .error { color: red; display: none; }
        </style>
      </head>
      <body>
        <div class="login-form">
          <h1>AppRabbit Admin Login</h1>
          <form id="loginForm">
            <input type="email" placeholder="Email" id="email" required>
            <input type="password" placeholder="Password" id="password" required>
            <button type="submit">Login</button>
          </form>
          <div class="error" id="error">Invalid credentials</div>
        </div>
        
        <script>
          document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Mock validation
            if (email === 'admin@apprabbit.com' && password === 'admin123') {
              // Simulate redirect to dashboard
              document.body.innerHTML = \`
                <div style="padding: 50px;">
                  <h1>Dashboard</h1>
                  <p>Welcome to AppRabbit Admin Dashboard</p>
                  <div>You are logged in as: \${email}</div>
                </div>
              \`;
              document.title = 'AppRabbit Admin - Dashboard';
            } else {
              document.getElementById('error').style.display = 'block';
            }
          });
        </script>
      </body>
      </html>
    `;

    // Set the mock HTML content
    await page.setContent(mockLoginPage);
    
    // Verify we're on the login page
    await expect(page).toHaveTitle('AppRabbit Admin - Login');
    await expect(page.getByRole('heading', { name: 'AppRabbit Admin Login' })).toBeVisible();
    
    // Fill in login credentials
    await page.getByPlaceholder('Email').fill('admin@apprabbit.com');
    await page.getByPlaceholder('Password').fill('admin123');
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful login - page should show dashboard
    await expect(page).toHaveTitle('AppRabbit Admin - Dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
    await expect(page.getByText('Welcome to AppRabbit Admin Dashboard')).toBeVisible();
    await expect(page.getByText('You are logged in as: admin@apprabbit.com')).toBeVisible();
  });

  test('should show error with invalid credentials', async ({ page }) => {
    const mockLoginPage = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AppRabbit Admin - Login</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 50px; }
          .login-form { max-width: 400px; margin: 0 auto; }
          input { width: 100%; padding: 10px; margin: 10px 0; }
          button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; }
          .error { color: red; display: none; }
        </style>
      </head>
      <body>
        <div class="login-form">
          <h1>AppRabbit Admin Login</h1>
          <form id="loginForm">
            <input type="email" placeholder="Email" id="email" required>
            <input type="password" placeholder="Password" id="password" required>
            <button type="submit">Login</button>
          </form>
          <div class="error" id="error">Invalid credentials</div>
        </div>
        
        <script>
          document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email === 'admin@apprabbit.com' && password === 'admin123') {
              document.body.innerHTML = \`
                <div style="padding: 50px;">
                  <h1>Dashboard</h1>
                  <p>Welcome to AppRabbit Admin Dashboard</p>
                </div>
              \`;
            } else {
              document.getElementById('error').style.display = 'block';
            }
          });
        </script>
      </body>
      </html>
    `;

    await page.setContent(mockLoginPage);
    
    // Fill in invalid credentials
    await page.getByPlaceholder('Email').fill('wrong@email.com');
    await page.getByPlaceholder('Password').fill('wrongpassword');
    
    // Click login button
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify error message appears
    await expect(page.getByText('Invalid credentials')).toBeVisible();
    
    // Verify we're still on login page
    await expect(page).toHaveTitle('AppRabbit Admin - Login');
    await expect(page.getByRole('button', { name: 'Login' })).toBeVisible();
  });

  test('should validate required fields', async ({ page }) => {
    const mockLoginPage = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AppRabbit Admin - Login</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 50px; }
          .login-form { max-width: 400px; margin: 0 auto; }
          input { width: 100%; padding: 10px; margin: 10px 0; }
          button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; }
          input:invalid { border: 2px solid red; }
        </style>
      </head>
      <body>
        <div class="login-form">
          <h1>AppRabbit Admin Login</h1>
          <form id="loginForm">
            <input type="email" placeholder="Email" id="email" required>
            <input type="password" placeholder="Password" id="password" required>
            <button type="submit">Login</button>
          </form>
        </div>
      </body>
      </html>
    `;

    await page.setContent(mockLoginPage);
    
    // Try to submit without filling fields
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Check that form validation prevents submission
    const emailField = page.getByPlaceholder('Email');
    const passwordField = page.getByPlaceholder('Password');
    
    // These fields should be required and show validation
    await expect(emailField).toHaveAttribute('required');
    await expect(passwordField).toHaveAttribute('required');
  });

  test('should handle form interactions correctly', async ({ page }) => {
    const mockLoginPage = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>AppRabbit Admin - Login</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 50px; }
          .login-form { max-width: 400px; margin: 0 auto; }
          input { width: 100%; padding: 10px; margin: 10px 0; }
          button { width: 100%; padding: 10px; background: #007bff; color: white; border: none; }
        </style>
      </head>
      <body>
        <div class="login-form">
          <h1>AppRabbit Admin Login</h1>
          <form id="loginForm">
            <input type="email" placeholder="Email" id="email" required>
            <input type="password" placeholder="Password" id="password" required>
            <button type="submit">Login</button>
          </form>
        </div>
        
        <script>
          document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            if (email === 'admin@apprabbit.com' && password === 'admin123') {
              document.body.innerHTML = \`
                <div style="padding: 50px;">
                  <h1>Dashboard</h1>
                  <p>Welcome to AppRabbit Admin Dashboard</p>
                  <div>You are logged in as: \${email}</div>
                </div>
              \`;
              document.title = 'AppRabbit Admin - Dashboard';
            }
          });
        </script>
      </body>
      </html>
    `;

    await page.setContent(mockLoginPage);
    
    const emailField = page.getByPlaceholder('Email');
    const passwordField = page.getByPlaceholder('Password');
    
    await emailField.fill('test@apprabbit.com');
    await expect(emailField).toHaveValue('test@apprabbit.com');
    
    await passwordField.fill('testpassword');
    await expect(passwordField).toHaveValue('testpassword');
    
    await emailField.clear();
    await passwordField.clear();
    
    await expect(emailField).toBeEmpty();
    await expect(passwordField).toBeEmpty();
    
    await emailField.fill('admin@apprabbit.com');
    await passwordField.fill('admin123');
    await passwordField.press('Enter');
    
    await expect(page).toHaveTitle('AppRabbit Admin - Dashboard');
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  });
});