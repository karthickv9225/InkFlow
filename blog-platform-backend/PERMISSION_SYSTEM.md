# Blog Permission System Documentation

## Overview

This document describes the comprehensive blog permission system implemented in the blog platform. The system ensures secure access control with proper authentication and ownership validation.

---

## Permission Model

### 1. **Blog Visibility**

#### Published Blogs (isPublished = true)
- ✅ Visible to **all users** (authenticated and unauthenticated)
- ✅ Visible on **public feed** (`/public/feed`)
- ✅ Accessible via **public blog page** (`/public/blogs/:slug`)
- ✅ Anyone can **like** and **comment**
- ❌ Only **owner** can **edit** or **delete**

#### Unpublished Blogs (isPublished = false)
- ✅ Visible **only to owner** in private dashboard
- ❌ NOT visible on public feed
- ❌ NOT accessible via public blog page
- ❌ Cannot be liked or commented on by others
- ✅ Only **owner** can **edit** or **delete**

---

## API Endpoints & Permissions

### Authentication Endpoints (No Auth Required)

```
POST /auth/register
POST /auth/login
```

### Blog Management Endpoints (Auth Required)

#### Create Blog
```
POST /blogs
Authorization: Bearer <token>
```
- **Permission**: Authenticated users only
- **Validation**: None (any authenticated user can create)
- **Response**: 201 Created

#### Get User's Blogs
```
GET /blogs
Authorization: Bearer <token>
```
- **Permission**: Authenticated users only
- **Returns**: Only blogs owned by the authenticated user
- **Includes**: Published and unpublished blogs
- **Response**: 200 OK

#### Get Single Blog (Private)
```
GET /blogs/:id
Authorization: Bearer <token>
```
- **Permission**: Authenticated users only
- **Validation**: User must be the blog owner
- **Error**: 403 Forbidden if not owner
- **Response**: 200 OK or 403 Forbidden

#### Update Blog
```
PATCH /blogs/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content",
  "isPublished": true
}
```
- **Permission**: Authenticated users only
- **Validation**: User must be the blog owner
- **Error**: 403 Forbidden if not owner
- **Error**: 404 Not Found if blog doesn't exist
- **Response**: 200 OK or 403 Forbidden

#### Delete Blog
```
DELETE /blogs/:id
Authorization: Bearer <token>
```
- **Permission**: Authenticated users only
- **Validation**: User must be the blog owner
- **Error**: 403 Forbidden if not owner
- **Error**: 404 Not Found if blog doesn't exist
- **Response**: 200 OK or 403 Forbidden

### Public Endpoints (No Auth Required)

#### Get Public Feed
```
GET /public/feed?page=1&limit=10
```
- **Permission**: No authentication required
- **Filters**: Only published blogs (isPublished = true)
- **Sorting**: Newest first
- **Pagination**: Supported
- **Response**: 200 OK

#### Get Public Blog by Slug
```
GET /public/blogs/:slug
```
- **Permission**: No authentication required
- **Validation**: Blog must be published
- **Error**: 404 Not Found if not published or doesn't exist
- **Response**: 200 OK or 404 Not Found

#### Like Blog
```
POST /public/blogs/:id/like
Authorization: Bearer <token>
```
- **Permission**: Authenticated users only
- **Validation**: Blog must be published
- **Validation**: User cannot like same blog twice
- **Error**: 404 Not Found if blog not published
- **Error**: 400 Bad Request if already liked
- **Response**: 200 OK

#### Unlike Blog
```
DELETE /public/blogs/:id/like
Authorization: Bearer <token>
```
- **Permission**: Authenticated users only
- **Validation**: Like must exist
- **Error**: 404 Not Found if like doesn't exist
- **Response**: 200 OK

#### Add Comment
```
POST /public/blogs/:id/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "content": "Great blog post!"
}
```
- **Permission**: Authenticated users only
- **Validation**: Blog must be published
- **Error**: 404 Not Found if blog not published
- **Response**: 201 Created

#### Get Comments
```
GET /public/blogs/:id/comments?page=1&limit=10
```
- **Permission**: No authentication required
- **Pagination**: Supported
- **Sorting**: Newest first
- **Response**: 200 OK

---

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```
**When**: No valid JWT token provided for protected endpoints

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own blogs"
}
```
**When**: 
- User tries to edit/delete blog they don't own
- User tries to access private blog they don't own

### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Blog not found"
}
```
**When**:
- Blog doesn't exist
- Trying to access unpublished blog via public endpoint
- Like or comment doesn't exist

### 400 Bad Request
```json
{
  "statusCode": 400,
  "message": "Slug already exists"
}
```
**When**: Validation fails (duplicate slug, missing fields, etc.)

---

## Backend Implementation

### Blogs Service

#### Create Blog
```typescript
async create(userId: string, createBlogDto: CreateBlogDto)
```
- Validates slug uniqueness
- Associates blog with user ID
- Stores in mock storage or database

#### Update Blog
```typescript
async update(id: string, userId: string, updateBlogDto: UpdateBlogDto)
```
- **Ownership Check**: Verifies `blog.userId === userId`
- **Throws**: `ForbiddenException` if not owner
- **Throws**: `NotFoundException` if blog doesn't exist
- **Validates**: Slug uniqueness if slug is being changed

#### Delete Blog
```typescript
async remove(id: string, userId: string)
```
- **Ownership Check**: Verifies `blog.userId === userId`
- **Throws**: `ForbiddenException` if not owner
- **Throws**: `NotFoundException` if blog doesn't exist

### Public Service

#### Get Feed
```typescript
async getFeed(page: number, limit: number)
```
- **Filter**: `where: { isPublished: true }`
- **Pagination**: Implemented
- **Sorting**: By createdAt descending

#### Get Blog by Slug
```typescript
async getBlogBySlug(slug: string)
```
- **Filter**: `where: { slug }`
- **Validation**: Checks `blog.isPublished === true`
- **Throws**: `NotFoundException` if not published

#### Like Blog
```typescript
async likeBlog(blogId: string, userId: string)
```
- **Validation**: Blog must be published
- **Validation**: User cannot like same blog twice
- **Unique Constraint**: `userId_blogId` composite key

#### Add Comment
```typescript
async addComment(blogId: string, userId: string, content: string)
```
- **Validation**: Blog must be published
- **Throws**: `NotFoundException` if not published

---

## Frontend Implementation

### Dashboard Page (`/dashboard`)

- **Auth Check**: Redirects to login if not authenticated
- **Shows**: Only user's own blogs (both published and unpublished)
- **Actions**: Edit, Delete, View (if published)
- **Status Badge**: Shows "Published" or "Draft"

### Edit Page (`/dashboard/edit/[id]`)

- **Auth Check**: Redirects to login if not authenticated
- **Ownership Check**: Fetches blog via `/blogs/:id` (private endpoint)
- **Error Handling**: Redirects to dashboard if blog not found (403 or 404)
- **Slug**: Disabled field (cannot be changed)
- **Publish Toggle**: Can change publication status

### Public Feed (`/`)

- **No Auth Required**: Accessible to all users
- **Shows**: Only published blogs
- **Actions**: View, Like, Comment (if authenticated)
- **Grid Layout**: 2-column responsive design

### Public Blog Page (`/blog/[slug]`)

- **No Auth Required**: Accessible to all users
- **Shows**: Only published blogs
- **Error**: 404 if blog not published or doesn't exist
- **Actions**: Like, Comment (if authenticated)

---

## Security Features

### 1. **Authentication**
- JWT-based authentication
- Token stored in localStorage (frontend)
- Token validated on every protected request

### 2. **Authorization**
- Ownership validation on update/delete
- Published status check on public endpoints
- User ID verification in JWT payload

### 3. **Input Validation**
- DTO validation on all endpoints
- Slug uniqueness check
- Content length validation

### 4. **Error Handling**
- Proper HTTP status codes (401, 403, 404, 400)
- No sensitive data in error messages
- Consistent error response format

### 5. **Database Constraints**
- Unique constraint on slug
- Unique constraint on userId_blogId (likes)
- Foreign key relationships

---

## Testing Scenarios

### Scenario 1: User A Creates and Publishes Blog
1. User A creates blog with `isPublished: true`
2. Blog appears on public feed
3. User B can view, like, comment
4. User B cannot edit or delete
5. User A can edit and delete

### Scenario 2: User A Creates Draft Blog
1. User A creates blog with `isPublished: false`
2. Blog does NOT appear on public feed
3. Blog visible only in User A's dashboard
4. User B cannot access blog
5. User A can edit and publish

### Scenario 3: Unauthorized Edit Attempt
1. User B tries to PATCH `/blogs/:id` (User A's blog)
2. Backend validates ownership
3. Returns 403 Forbidden
4. Blog remains unchanged

### Scenario 4: Unauthorized Delete Attempt
1. User B tries to DELETE `/blogs/:id` (User A's blog)
2. Backend validates ownership
3. Returns 403 Forbidden
4. Blog remains unchanged

### Scenario 5: Like Duplicate Prevention
1. User A likes blog
2. User A tries to like same blog again
3. Backend checks unique constraint
4. Returns 400 Bad Request
5. Like count remains 1

---

## Mock Storage Implementation

For development without a database:

### Mock Users Storage
```typescript
export const mockUsersStorage = new Map<string, MockUser>();
```
- Stores user credentials
- Used by auth service and JWT strategy

### Mock Blogs Storage
```typescript
export const mockBlogsStorage = new Map<string, MockBlog>();
```
- Stores blog data
- Shared between BlogsService and PublicService
- Maintains userId for ownership validation

### Mock Likes Storage
```typescript
private mockLikes: Map<string, MockLike> = new Map();
```
- Stores likes with composite key `userId_blogId`
- Prevents duplicate likes

### Mock Comments Storage
```typescript
private mockComments: Map<string, MockComment> = new Map();
```
- Stores comments with blog association
- Maintains user information

---

## Migration to Database

To migrate from mock storage to a real database:

1. **Ensure Prisma schema** has all required fields
2. **Remove try-catch fallbacks** in services
3. **Update environment variables** with database URL
4. **Run migrations**: `npm run prisma:migrate`
5. **Test all endpoints** with real database

The permission logic remains the same - only the storage layer changes.

---

## Best Practices

1. ✅ **Always validate ownership** on update/delete
2. ✅ **Check publication status** on public endpoints
3. ✅ **Return proper HTTP status codes**
4. ✅ **Validate input** on all endpoints
5. ✅ **Use JWT for authentication**
6. ✅ **Never expose sensitive data** in errors
7. ✅ **Log security events** (optional)
8. ✅ **Use HTTPS in production**

---

## Conclusion

This permission system provides:
- ✅ Secure blog access control
- ✅ Proper ownership validation
- ✅ Public/private blog visibility
- ✅ Comprehensive error handling
- ✅ Frontend and backend validation
- ✅ Mock storage for development
- ✅ Easy migration to real database
