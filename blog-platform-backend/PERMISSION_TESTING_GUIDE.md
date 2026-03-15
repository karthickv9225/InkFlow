# Blog Permission System - Testing Guide

## Quick Test Scenarios

### Setup: Create Two Test Accounts

**Account 1 (User A):**
- Email: `user1@example.com`
- Username: `user1`
- Password: `password123`

**Account 2 (User B):**
- Email: `user2@example.com`
- Username: `user2`
- Password: `password123`

---

## Test Case 1: Public Blog Visibility

### Steps:
1. **Login as User A** → Get JWT token
2. **Create blog** with `isPublished: true`
   ```
   POST /blogs
   {
     "title": "My Public Blog",
     "slug": "my-public-blog",
     "content": "This is public content",
     "isPublished": true
   }
   ```
3. **Logout User A**
4. **Check public feed** (no auth needed)
   ```
   GET /public/feed
   ```
5. **Verify**: Blog appears in feed

### Expected Result:
✅ Blog visible to all users on public feed

---

## Test Case 2: Draft Blog Privacy

### Steps:
1. **Login as User A** → Get JWT token
2. **Create blog** with `isPublished: false`
   ```
   POST /blogs
   {
     "title": "My Draft Blog",
     "slug": "my-draft-blog",
     "content": "This is draft content",
     "isPublished": false
   }
   ```
3. **Check public feed** (no auth needed)
   ```
   GET /public/feed
   ```
4. **Try to access via slug** (no auth needed)
   ```
   GET /public/blogs/my-draft-blog
   ```
5. **Login as User A** and check dashboard
   ```
   GET /blogs
   ```

### Expected Result:
✅ Draft blog NOT visible on public feed
✅ Draft blog NOT accessible via public endpoint
✅ Draft blog visible in User A's dashboard

---

## Test Case 3: Ownership Validation - Edit

### Steps:
1. **Login as User A** → Get token A
2. **Create blog** with ID `blog123`
3. **Login as User B** → Get token B
4. **Try to edit User A's blog**
   ```
   PATCH /blogs/blog123
   Authorization: Bearer <token_B>
   {
     "title": "Hacked Title"
   }
   ```

### Expected Result:
❌ Returns 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only update your own blogs"
}
```
✅ Blog title remains unchanged

---

## Test Case 4: Ownership Validation - Delete

### Steps:
1. **Login as User A** → Get token A
2. **Create blog** with ID `blog456`
3. **Login as User B** → Get token B
4. **Try to delete User A's blog**
   ```
   DELETE /blogs/blog456
   Authorization: Bearer <token_B>
   ```

### Expected Result:
❌ Returns 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "You can only delete your own blogs"
}
```
✅ Blog still exists

---

## Test Case 5: Owner Can Edit Own Blog

### Steps:
1. **Login as User A** → Get token A
2. **Create blog** with ID `blog789`
3. **Edit the blog**
   ```
   PATCH /blogs/blog789
   Authorization: Bearer <token_A>
   {
     "title": "Updated Title",
     "isPublished": true
   }
   ```

### Expected Result:
✅ Returns 200 OK
✅ Blog title updated
✅ Blog now published

---

## Test Case 6: Owner Can Delete Own Blog

### Steps:
1. **Login as User A** → Get token A
2. **Create blog** with ID `blog999`
3. **Delete the blog**
   ```
   DELETE /blogs/blog999
   Authorization: Bearer <token_A>
   ```

### Expected Result:
✅ Returns 200 OK
✅ Blog deleted
✅ Blog no longer in dashboard

---

## Test Case 7: Like System - Published Blog Only

### Steps:
1. **Login as User A** → Create published blog `blog_pub`
2. **Login as User B** → Get token B
3. **Try to like published blog**
   ```
   POST /public/blogs/blog_pub/like
   Authorization: Bearer <token_B>
   ```
4. **Try to like draft blog** (if exists)
   ```
   POST /public/blogs/blog_draft/like
   Authorization: Bearer <token_B>
   ```

### Expected Result:
✅ Can like published blog
❌ Cannot like draft blog (404 Not Found)

---

## Test Case 8: Duplicate Like Prevention

### Steps:
1. **Login as User A** → Create published blog
2. **Login as User B** → Get token B
3. **Like the blog** (first time)
   ```
   POST /public/blogs/:id/like
   Authorization: Bearer <token_B>
   ```
4. **Like the blog again** (second time)
   ```
   POST /public/blogs/:id/like
   Authorization: Bearer <token_B>
   ```

### Expected Result:
✅ First like succeeds (200 OK)
❌ Second like fails (400 Bad Request)
✅ Like count remains 1

---

## Test Case 9: Comment System - Published Blog Only

### Steps:
1. **Login as User A** → Create published blog
2. **Login as User B** → Get token B
3. **Try to comment on published blog**
   ```
   POST /public/blogs/:id/comments
   Authorization: Bearer <token_B>
   {
     "content": "Great post!"
   }
   ```
4. **Try to comment on draft blog** (if exists)
   ```
   POST /public/blogs/:id/comments
   Authorization: Bearer <token_B>
   {
     "content": "Nice draft!"
   }
   ```

### Expected Result:
✅ Can comment on published blog
❌ Cannot comment on draft blog (404 Not Found)

---

## Test Case 10: Publish/Unpublish Toggle

### Steps:
1. **Login as User A** → Create draft blog
2. **Verify** blog not on public feed
3. **Edit blog** to publish
   ```
   PATCH /blogs/:id
   Authorization: Bearer <token_A>
   {
     "isPublished": true
   }
   ```
4. **Verify** blog now on public feed
5. **Edit blog** to unpublish
   ```
   PATCH /blogs/:id
   Authorization: Bearer <token_A>
   {
     "isPublished": false
   }
   ```
6. **Verify** blog removed from public feed

### Expected Result:
✅ Draft blog not visible
✅ Published blog visible
✅ Unpublished blog hidden again

---

## Test Case 11: Authentication Required

### Steps:
1. **Try to create blog** without token
   ```
   POST /blogs
   {
     "title": "No Auth Blog",
     "slug": "no-auth",
     "content": "Content"
   }
   ```
2. **Try to edit blog** without token
   ```
   PATCH /blogs/:id
   ```
3. **Try to delete blog** without token
   ```
   DELETE /blogs/:id
   ```

### Expected Result:
❌ All return 401 Unauthorized

---

## Test Case 12: Public Access (No Auth)

### Steps:
1. **Get public feed** without token
   ```
   GET /public/feed
   ```
2. **Get blog by slug** without token
   ```
   GET /public/blogs/:slug
   ```
3. **Get comments** without token
   ```
   GET /public/blogs/:id/comments
   ```

### Expected Result:
✅ All succeed (200 OK)
✅ No authentication required

---

## Using cURL for Testing

### Create Blog
```bash
curl -X POST http://localhost:3001/blogs \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Blog",
    "slug": "test-blog",
    "content": "Test content",
    "isPublished": true
  }'
```

### Get Public Feed
```bash
curl http://localhost:3001/public/feed
```

### Try Unauthorized Edit
```bash
curl -X PATCH http://localhost:3001/blogs/BLOG_ID \
  -H "Authorization: Bearer WRONG_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title": "Hacked"}'
```

### Like Blog
```bash
curl -X POST http://localhost:3001/public/blogs/BLOG_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Postman Collection

Import this into Postman for easy testing:

```json
{
  "info": {
    "name": "Blog Permission System",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register User A",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/register",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"user1@example.com\",\"username\":\"user1\",\"password\":\"password123\"}"
            }
          }
        },
        {
          "name": "Login User A",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/auth/login",
            "body": {
              "mode": "raw",
              "raw": "{\"email\":\"user1@example.com\",\"password\":\"password123\"}"
            }
          }
        }
      ]
    },
    {
      "name": "Blogs",
      "item": [
        {
          "name": "Create Published Blog",
          "request": {
            "method": "POST",
            "url": "{{base_url}}/blogs",
            "header": {
              "Authorization": "Bearer {{token_a}}"
            },
            "body": {
              "mode": "raw",
              "raw": "{\"title\":\"Public Blog\",\"slug\":\"public-blog\",\"content\":\"Content\",\"isPublished\":true}"
            }
          }
        },
        {
          "name": "Get My Blogs",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/blogs",
            "header": {
              "Authorization": "Bearer {{token_a}}"
            }
          }
        }
      ]
    },
    {
      "name": "Public",
      "item": [
        {
          "name": "Get Public Feed",
          "request": {
            "method": "GET",
            "url": "{{base_url}}/public/feed"
          }
        }
      ]
    }
  ]
}
```

---

## Checklist

- [ ] Test Case 1: Public Blog Visibility
- [ ] Test Case 2: Draft Blog Privacy
- [ ] Test Case 3: Ownership Validation - Edit
- [ ] Test Case 4: Ownership Validation - Delete
- [ ] Test Case 5: Owner Can Edit Own Blog
- [ ] Test Case 6: Owner Can Delete Own Blog
- [ ] Test Case 7: Like System - Published Blog Only
- [ ] Test Case 8: Duplicate Like Prevention
- [ ] Test Case 9: Comment System - Published Blog Only
- [ ] Test Case 10: Publish/Unpublish Toggle
- [ ] Test Case 11: Authentication Required
- [ ] Test Case 12: Public Access (No Auth)

---

## Summary

The permission system is working correctly when:
- ✅ Published blogs visible to all
- ✅ Draft blogs visible only to owner
- ✅ Only owner can edit/delete
- ✅ Non-owners get 403 Forbidden
- ✅ Likes/comments only on published blogs
- ✅ Duplicate likes prevented
- ✅ Auth required for protected endpoints
- ✅ Public endpoints accessible without auth
