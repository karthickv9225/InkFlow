# 📝 Complete Blog Writing Guide

## Getting Started

### 1. Create Your Account
- Go to `http://localhost:3000/auth/register`
- Fill in email, username, and password
- Click "Create Account"
- You'll be redirected to your dashboard

### 2. Start Writing
- Click "Write Blog" button on dashboard or home page
- You'll be taken to the blog creation page

## Writing Your First Blog

### Step 1: Add Title
- Enter an engaging, descriptive title
- Keep it clear and compelling
- Maximum 200 characters
- Example: "Getting Started with Next.js 15"

### Step 2: Create URL Slug
- Enter a URL-friendly slug (lowercase, hyphens only)
- Or click "Auto" to auto-generate from title
- Example: "getting-started-with-nextjs-15"
- This becomes part of your blog URL

### Step 3: Write Summary (Optional)
- Brief description of your blog post
- Appears in the feed
- Helps readers decide to read more
- Maximum 500 characters
- Example: "Learn how to build modern web applications with Next.js 15"

### Step 4: Write Content
- Use the rich text editor with markdown support
- Click "Preview" to see how it looks
- Use formatting tools in the toolbar

## Markdown Formatting

### Text Formatting

**Bold Text**
```
**This is bold**
```
Result: **This is bold**

**Italic Text**
```
*This is italic*
```
Result: *This is italic*

### Headings

```
## Heading 2
### Heading 3
#### Heading 4
```

### Lists

**Unordered List**
```
- Item 1
- Item 2
- Item 3
```

**Ordered List**
```
1. First item
2. Second item
3. Third item
```

### Code

**Inline Code**
```
Use `const` for constants
```

**Code Block**
```
```javascript
function hello() {
  console.log("Hello, World!");
}
```
```

### Links

```
[Link Text](https://example.com)
```

### Images

```
![Alt Text](https://example.com/image.jpg)
```

## Toolbar Features

### Formatting Buttons

| Button | Function | Shortcut |
|--------|----------|----------|
| **B** | Bold | `**text**` |
| *I* | Italic | `*text*` |
| H2 | Heading | `## text` |
| List | Bullet List | `- text` |
| Code | Code Block | ` ```code``` ` |
| Link | Insert Link | `[text](url)` |
| Image | Insert Image | `![alt](url)` |

### Preview Mode

- Click "Preview" to see how your blog looks
- Click "Edit" to go back to editing
- Preview shows formatted markdown

## Publishing Your Blog

### Option 1: Publish Immediately
- Check "Publish immediately" before creating
- Blog appears on public feed right away

### Option 2: Save as Draft
- Leave "Publish immediately" unchecked
- Blog is saved but not visible to others
- Publish later from dashboard

### Publishing from Dashboard
1. Go to your dashboard
2. Find the blog you want to publish
3. Click the edit button (pencil icon)
4. Check "Publish this blog"
5. Click "Update Blog"

## Managing Your Blogs

### View All Blogs
- Go to dashboard
- See all your blogs (published and drafts)
- View statistics (likes, comments)

### Edit Blog
1. Click the edit button (pencil icon)
2. Make changes to title, content, etc.
3. Click "Update Blog"
4. Note: Slug cannot be changed after creation

### Delete Blog
1. Click the delete button (trash icon)
2. Confirm deletion
3. Blog is permanently removed

### View Published Blog
1. Click the view button (eye icon)
2. See how your blog looks to readers
3. View likes and comments

## Best Practices

### Writing Tips

✅ **Do:**
- Use clear, descriptive titles
- Write compelling summaries
- Use headings to organize content
- Break up long paragraphs
- Use lists for clarity
- Add code examples when relevant
- Include links to resources
- Proofread before publishing

❌ **Don't:**
- Use clickbait titles
- Write extremely long paragraphs
- Forget to add summary
- Publish without reviewing
- Use too many formatting styles
- Leave typos and grammar errors

### Content Structure

**Good Blog Structure:**
1. Engaging title
2. Brief summary
3. Introduction
4. Main content with headings
5. Code examples (if applicable)
6. Conclusion
7. Links to resources

### Markdown Best Practices

```markdown
# Main Title (Use H1 for title)

## Section 1
Content here...

### Subsection 1.1
More content...

## Section 2
- Point 1
- Point 2
- Point 3

## Code Example
```javascript
// Your code here
```

## Resources
- [Link 1](url)
- [Link 2](url)
```

## Examples

### Example 1: Technical Blog

```markdown
## Getting Started with React Hooks

React Hooks allow you to use state and other React features without writing a class.

### What are Hooks?

Hooks are functions that let you "hook into" React state and lifecycle features.

### useState Hook

```javascript
import { useState } from 'react';

function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </div>
  );
}
```

### useEffect Hook

The useEffect Hook lets you perform side effects in function components.

### Resources
- [React Hooks Documentation](https://react.dev/reference/react/hooks)
- [Hooks API Reference](https://react.dev/reference/react)
```

### Example 2: Personal Blog

```markdown
## My Journey Learning Web Development

I started learning web development 6 months ago, and it's been an amazing journey.

### Getting Started

When I first started, I was overwhelmed by all the options:
- HTML, CSS, JavaScript
- React, Vue, Angular
- Node.js, Python, Ruby

### My Learning Path

1. **Month 1-2**: HTML & CSS basics
2. **Month 3-4**: JavaScript fundamentals
3. **Month 5-6**: React and modern frameworks

### Key Learnings

- **Consistency is key** - Practice every day
- **Build projects** - Learn by doing
- **Join communities** - Get help and support
- **Read documentation** - Official docs are your friend

### What's Next?

I'm planning to:
- Build more complex projects
- Learn backend development
- Contribute to open source

### Resources
- [MDN Web Docs](https://developer.mozilla.org)
- [freeCodeCamp](https://freecodecamp.org)
- [Dev.to](https://dev.to)
```

## Troubleshooting

### Blog Won't Save
- Check that title and content are not empty
- Ensure slug is unique
- Check browser console for errors

### Formatting Not Working
- Make sure you're using correct markdown syntax
- Check preview to see how it renders
- Use toolbar buttons for quick formatting

### Can't Edit Blog
- Make sure you're logged in
- Verify you're the blog owner
- Check that blog exists

### Blog Not Appearing in Feed
- Make sure blog is published
- Check that it's marked as "isPublished"
- Wait a moment for feed to refresh

## Tips & Tricks

### Auto-Generate Slug
- Click "Auto" button next to slug field
- Automatically creates URL-friendly slug from title

### Preview Before Publishing
- Use "Preview" button to see formatted content
- Check for formatting issues
- Verify links and images work

### Save Drafts
- Leave "Publish immediately" unchecked
- Blog is saved but not visible
- Publish later when ready

### Edit Anytime
- You can edit published blogs
- Changes appear immediately
- Slug cannot be changed

### Delete Carefully
- Deletion is permanent
- No undo option
- Confirm before deleting

## Keyboard Shortcuts

While editing:
- `Ctrl+B` or `Cmd+B` - Bold
- `Ctrl+I` or `Cmd+I` - Italic
- `Ctrl+K` or `Cmd+K` - Link

## Advanced Features

### Code Syntax Highlighting

Specify language for better highlighting:
```javascript
// JavaScript code
const hello = () => console.log("Hello");
```

```python
# Python code
def hello():
    print("Hello")
```

```html
<!-- HTML code -->
<div>Hello</div>
```

### Embedding Content

You can include links to:
- GitHub repositories
- CodePen pens
- YouTube videos
- Other blogs

## Publishing Checklist

Before publishing, check:
- [ ] Title is clear and engaging
- [ ] Slug is URL-friendly
- [ ] Summary is compelling
- [ ] Content is well-formatted
- [ ] No typos or grammar errors
- [ ] Links are working
- [ ] Images are loading
- [ ] Code examples are correct
- [ ] Headings are organized
- [ ] Content is complete

## Getting More Readers

### Tips to Increase Engagement

1. **Write Compelling Titles**
   - Be specific and descriptive
   - Include keywords
   - Make it interesting

2. **Write Good Summaries**
   - Hook readers in first sentence
   - Highlight main points
   - Make them want to read more

3. **Use Formatting**
   - Break up text with headings
   - Use lists for clarity
   - Add code examples

4. **Engage with Community**
   - Comment on other blogs
   - Like interesting posts
   - Share your blogs

5. **Consistency**
   - Write regularly
   - Maintain quality
   - Build an audience

## Support

For issues or questions:
1. Check this guide
2. Review markdown syntax
3. Check browser console for errors
4. Contact support

---

**Happy Writing!** 🚀

Start sharing your knowledge and experiences with the world!
