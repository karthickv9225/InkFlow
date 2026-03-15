# Blog Permission System - Visual Diagrams

## 1. Blog Visibility Matrix

```
┌─────────────────────────────────────────────────────────────┐
│                    BLOG VISIBILITY                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  PUBLISHED BLOG (isPublished: true)                        │
│  ├─ Owner:        ✅ View ✅ Edit ✅ Delete               │
│  ├─ Other Users:  ✅ View ✅ Like ✅ Comment              │
│  ├─ Visitors:     ✅ View ✅ Like ✅ Comment              │
│  └─ Location:     Public Feed, Public Page                │
│                                                             │
│  UNPUBLISHED BLOG (isPublished: false)                     │
│  ├─ Owner:        ✅ View ✅ Edit ✅ Delete               │
│  ├─ Other Users:  ❌ View ❌ Like ❌ Comment              │
│  ├─ Visitors:     ❌ View ❌ Like ❌ Comment              │
│  └─ Location:     Owner's Dashboard Only                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Authentication & Authorization Flow

```
┌──────────────────────────────────────────────────────────────┐
│                   REQUEST FLOW                               │
└──────────────────────────────────────────────────────────────┘

PUBLIC ENDPOINT (e.g., GET /public/feed)
│
├─ No Auth Required
├─ Filter: isPublished = true
├─ Return: Published blogs only
└─ Status: 200 OK

PROTECTED ENDPOINT (e.g., PATCH /blogs/:id)
│
├─ Check: JWT Token Present?
│  ├─ No  → Return 401 Unauthorized
│  └─ Yes → Continue
│
├─ Validate: JWT Token Valid?
│  ├─ No  → Return 401 Unauthorized
│  └─ Yes → Extract userId
│
├─ Check: Ownership (blog.userId === userId)?
│  ├─ No  → Return 403 Forbidden
│  └─ Yes → Continue
│
├─ Validate: Input Data Valid?
│  ├─ No  → Return 400 Bad Request
│  └─ Yes → Continue
│
├─ Execute: Update Blog
└─ Status: 200 OK
```

---

## 3. Blog Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                   BLOG LIFECYCLE                            │
└─────────────────────────────────────────────────────────────┘

1. CREATE BLOG
   │
   ├─ User A creates blog
   ├─ isPublished: false (default)
   ├─ Stored with userId: A
   └─ Status: Draft

2. DRAFT STATE
   │
   ├─ Visible: Only in User A's dashboard
   ├─ Actions: Edit, Delete, Publish
   ├─ Public Access: ❌ Not visible
   └─ Interactions: ❌ No likes/comments

3. PUBLISH BLOG
   │
   ├─ User A edits blog
   ├─ Sets isPublished: true
   ├─ Stored with userId: A
   └─ Status: Published

4. PUBLISHED STATE
   │
   ├─ Visible: Public feed, public page
   ├─ Actions: Edit, Delete, Unpublish
   ├─ Public Access: ✅ Visible to all
   ├─ Interactions: ✅ Likes, Comments
   └─ Ownership: Only User A can edit/delete

5. UNPUBLISH BLOG
   │
   ├─ User A edits blog
   ├─ Sets isPublished: false
   └─ Back to Draft State

6. DELETE BLOG
   │
   ├─ User A deletes blog
   ├─ Blog removed from storage
   └─ Status: Deleted
```

---

## 4. Permission Check Flow

```
┌──────────────────────────────────────────────────────────────┐
│              EDIT/DELETE PERMISSION CHECK                    │
└──────────────────────────────────────────────────────────────┘

User B tries to PATCH /blogs/blog_A_123

    ↓

BlogsController.update()
    ↓
    Extract: userId = B, blogId = blog_A_123
    ↓

BlogsService.update(blogId, userId, dto)
    ↓
    Query: blog = findBlog(blog_A_123)
    ↓
    Check: blog exists?
    ├─ No  → Throw NotFoundException (404)
    └─ Yes → Continue
    ↓
    Check: blog.userId === userId?
    ├─ No  → Throw ForbiddenException (403)
    │        "You can only update your own blogs"
    └─ Yes → Continue
    ↓
    Validate: Input data valid?
    ├─ No  → Throw BadRequestException (400)
    └─ Yes → Continue
    ↓
    Update: blog.title = dto.title
    ↓
    Return: Updated blog (200 OK)
```

---

## 5. Like System Flow

```
┌──────────────────────────────────────────────────────────────┐
│                    LIKE SYSTEM FLOW                          │
└──────────────────────────────────────────────────────────────┘

User B tries to like blog_A_123

    ↓

PublicService.likeBlog(blogId, userId)
    ↓
    Query: blog = findBlog(blog_A_123)
    ↓
    Check: blog exists?
    ├─ No  → Throw NotFoundException (404)
    └─ Yes → Continue
    ↓
    Check: blog.isPublished === true?
    ├─ No  → Throw NotFoundException (404)
    │        "Blog not found" (hide draft blogs)
    └─ Yes → Continue
    ↓
    Check: Existing like (userId_blogId)?
    ├─ Yes → Throw BadRequestException (400)
    │        "Already liked"
    └─ No  → Continue
    ↓
    Create: Like { userId: B, blogId: blog_A_123 }
    ↓
    Return: { likeCount: 5 } (200 OK)
```

---

## 6. Public Feed Filter

```
┌──────────────────────────────────────────────────────────────┐
│                  PUBLIC FEED FILTER                          │
└──────────────────────────────────────────────────────────────┘

GET /public/feed

    ↓

PublicService.getFeed(page, limit)
    ↓
    Query: blogs = findMany({
      where: { isPublished: true },
      orderBy: { createdAt: 'desc' },
      skip: (page-1)*limit,
      take: limit
    })
    ↓
    Filter Results:
    ├─ Blog A (User A, published)     ✅ Include
    ├─ Blog B (User B, published)     ✅ Include
    ├─ Blog C (User A, draft)         ❌ Exclude
    ├─ Blog D (User B, published)     ✅ Include
    └─ Blog E (User C, draft)         ❌ Exclude
    ↓
    Return: [Blog A, Blog B, Blog D] (200 OK)
```

---

## 7. Dashboard vs Public Feed

```
┌──────────────────────────────────────────────────────────────┐
│           DASHBOARD vs PUBLIC FEED                           │
└──────────────────────────────────────────────────────────────┘

DASHBOARD (GET /blogs)
├─ Auth Required: ✅ Yes
├─ Shows: All user's blogs (published + draft)
├─ User A sees:
│  ├─ Blog A (published)
│  ├─ Blog B (draft)
│  └─ Blog C (published)
├─ User B sees:
│  ├─ Blog D (published)
│  └─ Blog E (draft)
└─ Actions: Edit, Delete, View (if published)

PUBLIC FEED (GET /public/feed)
├─ Auth Required: ❌ No
├─ Shows: Only published blogs from all users
├─ Everyone sees:
│  ├─ Blog A (User A, published)
│  ├─ Blog C (User A, published)
│  └─ Blog D (User B, published)
├─ Hidden:
│  ├─ Blog B (User A, draft)
│  └─ Blog E (User B, draft)
└─ Actions: View, Like, Comment
```

---

## 8. Error Response Codes

```
┌──────────────────────────────────────────────────────────────┐
│              ERROR RESPONSE CODES                            │
└──────────────────────────────────────────────────────────────┘

401 UNAUTHORIZED
├─ Cause: No JWT token or invalid token
├─ Endpoints: All protected endpoints
├─ Example: PATCH /blogs/:id without token
└─ Response: { statusCode: 401, message: "Unauthorized" }

403 FORBIDDEN
├─ Cause: User not authorized (not owner)
├─ Endpoints: PATCH /blogs/:id, DELETE /blogs/:id
├─ Example: User B tries to edit User A's blog
└─ Response: { statusCode: 403, message: "You can only update your own blogs" }

404 NOT FOUND
├─ Cause: Blog doesn't exist or not published
├─ Endpoints: GET /public/blogs/:slug, POST /public/blogs/:id/like
├─ Example: Try to access draft blog via public endpoint
└─ Response: { statusCode: 404, message: "Blog not found" }

400 BAD REQUEST
├─ Cause: Validation error
├─ Endpoints: All endpoints with input
├─ Example: Duplicate slug, missing fields
└─ Response: { statusCode: 400, message: "Slug already exists" }
```

---

## 9. User Roles & Permissions

```
┌──────────────────────────────────────────────────────────────┐
│              USER ROLES & PERMISSIONS                        │
└──────────────────────────────────────────────────────────────┘

VISITOR (Not Authenticated)
├─ View published blogs: ✅
├─ View public feed: ✅
├─ Like blogs: ❌ (requires auth)
├─ Comment: ❌ (requires auth)
├─ Create blog: ❌ (requires auth)
├─ Edit blog: ❌ (requires auth)
└─ Delete blog: ❌ (requires auth)

AUTHENTICATED USER (Any User)
├─ View published blogs: ✅
├─ View public feed: ✅
├─ Like blogs: ✅
├─ Comment: ✅
├─ Create blog: ✅
├─ Edit own blog: ✅
├─ Delete own blog: ✅
├─ Edit other's blog: ❌ (403 Forbidden)
└─ Delete other's blog: ❌ (403 Forbidden)

BLOG OWNER (User who created blog)
├─ View own blog: ✅
├─ Edit own blog: ✅
├─ Delete own blog: ✅
├─ Publish/Unpublish: ✅
├─ View in dashboard: ✅
├─ View in public feed: ✅ (if published)
└─ Like own blog: ✅ (same as any user)
```

---

## 10. Data Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    DATA FLOW                                 │
└──────────────────────────────────────────────────────────────┘

FRONTEND                          BACKEND                    STORAGE
┌──────────────┐                ┌──────────────┐           ┌──────────┐
│              │                │              │           │          │
│ User A       │                │              │           │ Mock     │
│ Creates Blog │──POST /blogs──→│ BlogsService │──Save──→  │ Blogs    │
│              │                │              │           │ Storage  │
└──────────────┘                └──────────────┘           └──────────┘
                                       │
                                       │ userId: A
                                       │ isPublished: true
                                       ↓
                                ┌──────────────┐
                                │ PublicService│
                                │ (shared ref) │
                                └──────────────┘

┌──────────────┐                ┌──────────────┐           ┌──────────┐
│              │                │              │           │          │
│ User B       │                │              │           │ Mock     │
│ Views Feed   │──GET /public──→│ PublicService│──Query──→ │ Blogs    │
│              │    /feed       │              │           │ Storage  │
└──────────────┘                └──────────────┘           └──────────┘
                                       │
                                       │ Filter: isPublished=true
                                       │ Sort: createdAt desc
                                       ↓
                                ┌──────────────┐
                                │ Return Blogs  │
                                │ (A's blog)    │
                                └──────────────┘

┌──────────────┐                ┌──────────────┐           ┌──────────┐
│              │                │              │           │          │
│ User B       │                │              │           │ Mock     │
│ Tries Edit   │──PATCH /blogs──→│ BlogsService │──Check──→ │ Blogs    │
│ User A Blog  │    /:id        │              │ Owner     │ Storage  │
└──────────────┘                └──────────────┘           └──────────┘
                                       │
                                       │ blog.userId (A) !== userId (B)
                                       ↓
                                ┌──────────────┐
                                │ 403 Forbidden │
                                └──────────────┘
```

---

## 11. State Machine

```
┌──────────────────────────────────────────────────────────────┐
│                   BLOG STATE MACHINE                         │
└──────────────────────────────────────────────────────────────┘

                    ┌─────────────┐
                    │   CREATED   │
                    │  (Draft)    │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   PUBLISH   │
                    │  (Publish)  │
                    └──────┬──────┘
                           │
                    ┌──────▼──────────┐
                    │   PUBLISHED    │
                    │ (Public Feed)  │
                    └──────┬──────────┘
                           │
                    ┌──────▼──────┐
                    │  UNPUBLISH  │
                    │ (Unpublish) │
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   DRAFT     │
                    │ (Back Draft)│
                    └──────┬──────┘
                           │
                    ┌──────▼──────┐
                    │   DELETE    │
                    │ (Deleted)   │
                    └─────────────┘

Transitions:
- CREATED → PUBLISHED: User publishes blog
- PUBLISHED → DRAFT: User unpublishes blog
- DRAFT → PUBLISHED: User publishes blog
- Any State → DELETED: User deletes blog
```

---

## 12. Security Layers

```
┌──────────────────────────────────────────────────────────────┐
│                  SECURITY LAYERS                             │
└──────────────────────────────────────────────────────────────┘

LAYER 1: AUTHENTICATION
├─ JWT Token Validation
├─ Token Expiration Check
├─ User ID Extraction
└─ Status: 401 if invalid

LAYER 2: AUTHORIZATION
├─ Ownership Validation
├─ Role-Based Access
├─ Published Status Check
└─ Status: 403 if unauthorized

LAYER 3: INPUT VALIDATION
├─ DTO Validation
├─ Slug Uniqueness
├─ Content Length
└─ Status: 400 if invalid

LAYER 4: DATABASE CONSTRAINTS
├─ Unique Constraints
├─ Foreign Keys
├─ Indexes
└─ Prevents Data Corruption

LAYER 5: ERROR HANDLING
├─ Proper Status Codes
├─ No Sensitive Data
├─ Consistent Format
└─ Detailed Logging
```

---

## Summary

The permission system uses multiple layers of security:
1. **Authentication**: Verify user identity via JWT
2. **Authorization**: Verify user has permission
3. **Validation**: Verify input data is valid
4. **Constraints**: Database-level protection
5. **Error Handling**: Proper error responses

This ensures secure, reliable blog access control!
