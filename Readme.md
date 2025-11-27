# 📝 Ranjit Editor - Advanced Rich Text Editor

A powerful, feature-rich WYSIWYG editor with modern UI and advanced functionality.

## 🚀 Quick Setup

### Required Files
```
EDITOR/
├── assets/
│   ├── main.css     # Editor styles (Required)
│   └── main.js      # Editor functionality (Required)
├── demo.html        # Demo page (Optional)
└── editor.html      # Full example (Optional)
```

### Dependencies
- **jQuery** (3.6.0 or higher)
- **Font Awesome** (6.0 or higher) for icons

## 📋 Step-by-Step Setup

### Step 1: Include Dependencies
```html
<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Font Awesome -->
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
```

### Step 2: Include Editor Files
```html
<!-- Editor CSS -->
<link rel="stylesheet" href="assets/main.css">

<!-- Editor JavaScript -->
<script src="assets/main.js"></script>
```

### Step 3: Create HTML Structure
```html
<textarea id="myEditor" name="content">
  <!-- Your initial content here -->
</textarea>
```

### Step 4: Initialize Editor
```javascript
$(document).ready(function() {
    $('#myEditor').ranjitEditor({
        autosave: true,
        wordCount: true,
        darkMode: false,
        fullscreen: true,
        emoji: true,
        autosaveInterval: 5000
    });
});
```

## ⚙️ Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `autosave` | boolean | `true` | Enable auto-save functionality |
| `wordCount` | boolean | `true` | Show word/character count |
| `darkMode` | boolean | `false` | Enable dark mode |
| `fullscreen` | boolean | `true` | Enable fullscreen mode |
| `emoji` | boolean | `true` | Enable emoji picker |
| `autosaveInterval` | number | `5000` | Auto-save interval in milliseconds |

## 🎯 Complete Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ranjit Editor Demo</title>
    
    <!-- Dependencies -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Editor Files -->
    <link rel="stylesheet" href="assets/main.css">
    <script src="assets/main.js"></script>
</head>
<body>
    <div class="container">
        <h1>My Website with Editor</h1>
        
        <form>
            <textarea id="content" name="content">
                <h2>Welcome to Ranjit Editor!</h2>
                <p>Start editing your content here...</p>
            </textarea>
            
            <button type="submit">Save Content</button>
        </form>
    </div>

    <script>
    $(document).ready(function() {
        $('#content').ranjitEditor({
            autosave: true,
            wordCount: true,
            fullscreen: true
        });
    });
    </script>
</body>
</html>
```

## 🔧 Advanced Features

- **Image Upload & Gallery**: Drag & drop image support
- **Video Embedding**: YouTube, Vimeo, and direct video support
- **Advanced Tables**: Sortable, editable, resizable tables
- **Import/Export**: Word, PDF, HTML, Text formats
- **Find & Replace**: Advanced search with regex support
- **Custom Settings**: Configurable toolbar and features
- **Responsive Design**: Works on all devices

## 🎨 Customization

### Custom Styles
```css
/* Override editor styles */
.ranjit-editor-container {
    border: 2px solid #your-color;
    border-radius: 10px;
}

.ranjit-editor-toolbar {
    background: #your-background;
}
```

### Custom Settings
```javascript
$('#myEditor').ranjitEditor({
    // Enable only specific features
    autosave: false,
    wordCount: false,
    emoji: false
});
```

## 📱 Bootstrap Compatibility

✅ **Fully Compatible** - Uses custom CSS classes (`ranjit-*`) to avoid conflicts with Bootstrap.

## 🔍 Troubleshooting

### Editor not showing?
1. Check if jQuery is loaded before the editor
2. Verify Font Awesome is included
3. Ensure `main.css` and `main.js` paths are correct

### Settings not opening?
1. Check browser console for JavaScript errors
2. Ensure all dependencies are loaded
3. Verify jQuery version (3.6.0+)

## 📄 File Structure for Production

**Minimum Required Files:**
```
your-website/
├── assets/
│   ├── main.css     # 📁 Required
│   └── main.js      # 📁 Required
└── your-page.html   # Your HTML file
```

**Optional Files:**
- `demo.html` - Demo page
- `editor.html` - Full example

## 🚀 Ready to Use!

Your editor is now ready! The textarea will be automatically converted to a rich text editor with all advanced features.

---

**Created by:** [Ranjit Raut](https://github.com/ranjitraut-sta)  
**Version:** 1.0.0  
**License:** MIT