# 🔐 Mock Authentication Guide

## What is Mock Authentication?

Mock authentication is a **development-only feature** that stores user credentials in browser localStorage instead of using Supabase. This allows you to:

✅ Test authentication without rate limits
✅ Create unlimited test accounts
✅ Test the full application flow
✅ Avoid Supabase email verification delays

## How It Works

### Current Setup
- **Mock Auth Enabled**: `USE_MOCK_AUTH = true` in `lib/auth/client-auth.ts`
- **Storage**: Browser localStorage
- **Persistence**: Data persists across page refreshes
- **Scope**: Development only (not production-ready)

### User Data Storage
```javascript
// Stored in localStorage as:
{
  "mock_users": [
    {
      "id": "user_1234567890",
      "email": "test@example.com",
      "password": "password123",
      "username": "testuser",
      "fullName": "Test User"
    }
  ],
  "current_user": {
    "id": "user_1234567890",
    "email": "test@example.com",
    "username": "testuser",
    "fullName": "Test User"
  }
}
```

---

## Quick Start

### 1. Create an Account

1. Go to http://localhost:3000/register
2. Fill in the form:
   - **Email**: `test@example.com`
   - **Username**: `testuser`
   - **Password**: `password123`
   - **Full Name**: `Test User` (optional)
3. Click "Create account"
4. You'll be redirected to login

### 2. Login

1. Enter your email and password
2. Click "Sign in"
3. You should see the dashboard

### 3. Create a Blog

1. Click "Create New Blog"
2. Fill in:
   - **Title**: "My First Blog"
   - **Slug**: "my-first-blog"
   - **Content**: "Hello world!"
3. Click "Create Blog"
4. Click "Publish" to make it public

### 4. Test Features

- ✅ Like blogs
- ✅ Add comments
- ✅ Edit/delete comments
- ✅ View your dashboard
- ✅ Sign out

---

## Test Accounts

You can create as many test accounts as you want:

```
Email: test1@example.com
Password: password123
Username: testuser1

Email: test2@example.com
Password: password123
Username: testuser2

Email: admin@example.com
Password: admin123
Username: admin
```

---

## Switching Between Mock and Real Auth

### To Use Mock Auth (Development)
```typescript
// lib/auth/client-auth.ts
const USE_MOCK_AUTH = true  // ✅ Mock auth enabled
```

### To Use Real Supabase Auth (Production)
```typescript
// lib/auth/client-auth.ts
const USE_MOCK_AUTH = false  // ✅ Real auth enabled
```

---

## Important Notes

### ⚠️ Mock Auth Limitations

1. **Browser-Only**: Data only exists in your browser
2. **Not Secure**: Passwords stored in plain text (development only)
3. **No Email Verification**: No email confirmation needed
4. **No Password Reset**: Can't reset forgotten passwords
5. **No Multi-Device**: Data doesn't sync across devices
6. **Clears on Cache Clear**: Deleting browser cache deletes all users

### ✅ When to Use Mock Auth

- ✅ Local development
- ✅ Testing features
- ✅ Demo purposes
- ✅ Learning/tutorials

### ❌ When NOT to Use Mock Auth

- ❌ Production deployment
- ❌ Real user data
- ❌ Security-sensitive operations
- ❌ Multi-user environments

---

## Clearing Mock Data

### Clear All Users
```javascript
// Open browser console (F12) and run:
localStorage.removeItem('mock_users')
localStorage.removeItem('current_user')
location.reload()
```

### View All Users
```javascript
// Open browser console (F12) and run:
console.log(JSON.parse(localStorage.getItem('mock_users')))
```

### Manually Add User
```javascript
// Open browser console (F12) and run:
const users = JSON.parse(localStorage.getItem('mock_users') || '[]')
users.push({
  id: 'user_' + Date.now(),
  email: 'newuser@example.com',
  password: 'password123',
  username: 'newuser',
  fullName: 'New User'
})
localStorage.setItem('mock_users', JSON.stringify(users))
location.reload()
```

---

## Troubleshooting

### "Invalid email or password"
**Cause**: User doesn't exist or password is wrong

**Solution**: 
1. Check the email and password
2. Create a new account if needed
3. Check localStorage for existing users

### "This email is already registered"
**Cause**: Email already exists in mock users

**Solution**:
1. Use a different email
2. Clear mock data and start fresh
3. Check localStorage for existing users

### "This username is already taken"
**Cause**: Username already exists in mock users

**Solution**:
1. Use a different username
2. Clear mock data and start fresh

### Data disappeared after refresh
**Cause**: Browser cache was cleared or localStorage was disabled

**Solution**:
1. Enable localStorage in browser settings
2. Create account again
3. Check browser console for errors

---

## Switching to Real Supabase Auth

When you're ready to use real Supabase authentication:

### Step 1: Update Configuration
```typescript
// lib/auth/client-auth.ts
const USE_MOCK_AUTH = false  // Switch to real auth
```

### Step 2: Set Up Supabase
1. Create Supabase project at https://supabase.com
2. Get your credentials
3. Update `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Step 3: Disable Email Confirmation (Optional)
1. Go to Supabase Dashboard
2. Authentication → Providers → Email
3. Turn OFF "Confirm email"
4. Click Save

### Step 4: Test
1. Restart dev server
2. Try creating an account
3. You should see Supabase auth in action

---

## Development Workflow

### Phase 1: Feature Development (Mock Auth)
```
1. Enable mock auth
2. Create test accounts
3. Test features locally
4. No rate limits or delays
```

### Phase 2: Integration Testing (Real Auth)
```
1. Disable mock auth
2. Switch to Supabase
3. Test with real authentication
4. Verify email flows
```

### Phase 3: Production (Real Auth)
```
1. Deploy with real auth
2. Monitor Supabase usage
3. Upgrade plan if needed
4. Implement rate limiting
```

---

## Code Examples

### Check if User is Logged In
```typescript
const { user, loading } = useAuth()

if (loading) return <div>Loading...</div>
if (!user) return <div>Please login</div>

return <div>Welcome, {user.email}</div>
```

### Sign Up
```typescript
const { signUp } = useClientAuth()

try {
  await signUp('test@example.com', 'password123', 'testuser', 'Test User')
  // User created successfully
} catch (error) {
  console.error(error.message)
}
```

### Sign In
```typescript
const { signIn } = useClientAuth()

try {
  await signIn('test@example.com', 'password123')
  // User logged in successfully
} catch (error) {
  console.error(error.message)
}
```

### Sign Out
```typescript
const { signOut } = useClientAuth()

try {
  await signOut()
  // User logged out successfully
} catch (error) {
  console.error(error.message)
}
```

---

## FAQ

**Q: Is mock auth secure?**
A: No, it's for development only. Never use in production.

**Q: Can I use mock auth with a real database?**
A: Yes, but you need to manually sync user data to the database.

**Q: How do I migrate from mock to real auth?**
A: Set `USE_MOCK_AUTH = false` and configure Supabase.

**Q: Will mock data persist?**
A: Yes, until you clear browser cache or localStorage.

**Q: Can I use mock auth on production?**
A: No, it's development-only. Always use real auth in production.

**Q: How do I test with multiple users?**
A: Create multiple test accounts with different emails.

---

## Next Steps

1. ✅ Create test accounts
2. ✅ Test all features
3. ✅ Create blog posts
4. ✅ Test likes and comments
5. 🔄 Switch to real Supabase auth when ready
6. 🗄️ Set up PostgreSQL database
7. 🚀 Deploy to production

---

## Support

- **Issues**: Check browser console (F12) for errors
- **Questions**: See AUTHENTICATION_FIXED.md
- **Database**: See DATABASE_SETUP.md

Happy testing! 🎉

