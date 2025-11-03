# 🏺 MyArchePal - Archaeology App

An app for archaeologists to track their discoveries and work with their team!

## 🎮 Getting Started (Super Easy!)

### What You Need First
- A computer with Node.js installed (ask your teacher to help with this)

### How to Start the App

1. **Open Terminal/Command Prompt** (the black window where you type commands)

2. **Type these commands one by one:**
```bash
# Go to the project folder
cd myarchepal-techtitans

# Install the app (only need to do this once)
npm install

# Start the app
npm run dev
```

3. **Open your web browser** and go to: `http://localhost:5173`

That's it! The app is running! 🎉

## 📂 Where Everything Lives

Think of this project like a filing cabinet:

```
myarchepal-techtitans/
├── src/
│   ├── pages/        ← Each page of the app (like different screens)
│   ├── components/   ← Reusable parts (like LEGO blocks!)
│   └── App.tsx       ← The main control center
```

## 🗺️ Pages in Our App

| Page Name | What It Does | Where to Find It |
|-----------|--------------|------------------|
| Home | The main screen | `src/pages/Index.tsx` |
| Artifacts | Shows discovered items | `src/pages/Artifacts.tsx` |
| Articles | Research and stories | `src/pages/Articles.tsx` |
| New Find | Add a new discovery | `src/pages/NewFind.tsx` |
| Team | See your teammates | `src/pages/Team.tsx` |

## 🆕 How to Add a New Page (Step by Step!)

Let's make a page called "Tools" to show archaeology tools!

### 📝 Step 1: Create Your Page

1. Go to the `src/pages/` folder
2. Create a new file called `Tools.tsx`
3. Copy this code and paste it in:

```tsx
import { BottomNav } from "@/components/BottomNav";
import { Card } from "@/components/ui/card";

const Tools = () => {
  // This is your page!
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-md mx-auto">
        
        {/* The title at the top */}
        <header className="bg-card p-4 border-b">
          <h1 className="text-xl font-semibold">Archaeology Tools</h1>
        </header>

        {/* Your content goes here */}
        <div className="p-4">
          <Card className="p-4">
            <h2>My Tools</h2>
            <p>Shovel - For digging</p>
            <p>Brush - For cleaning artifacts</p>
            <p>Trowel - For careful digging</p>
          </Card>
        </div>

        {/* Menu at the bottom */}
        <BottomNav />
      </div>
    </div>
  );
};

export default Tools;
```

### 🔗 Step 2: Tell the App About Your Page

1. Open the file `src/App.tsx`
2. Find the section with all the `import` lines at the top
3. Add this line with the other imports:

```tsx
import Tools from "./pages/Tools";
```

4. Scroll down to find the section with all the `<Route>` tags
5. Add this line BEFORE the last route (the one with `path="*"`):

```tsx
<Route path="/tools" element={<Tools />} />
```

It should look like this:
```tsx
<Routes>
  {/* Other pages... */}
  <Route path="/tools" element={<Tools />} />  {/* ← Add this! */}
  <Route path="*" element={<NotFound />} />    {/* ← This stays last */}
</Routes>
```

### ✅ Step 3: Test Your Page!

1. Save all your files
2. Go to your browser
3. Type in the address bar: `http://localhost:5173/tools`
4. You should see your new Tools page! 🎊

## 🎨 Adding Things to Your Page

### Adding a List of Items

Want to show a list? Here's how:

```tsx
const Tools = () => {
  // Make a list of tools
  const myTools = [
    { name: "Shovel", use: "Digging" },
    { name: "Brush", use: "Cleaning" },
    { name: "Camera", use: "Taking photos" }
  ];

  return (
    <div className="p-4">
      {/* Show each tool */}
      {myTools.map((tool) => (
        <Card className="p-4 mb-2">
          <h3>{tool.name}</h3>
          <p>Used for: {tool.use}</p>
        </Card>
      ))}
    </div>
  );
};
```

### Adding Buttons

Want to add a button? Super easy:

```tsx
import { Button } from "@/components/ui/button";

// Then in your page:
<Button onClick={() => alert("Hello!")}>
  Click Me!
</Button>
```

## 🎯 Adding to the Bottom Menu

Want your page in the bottom menu? 

1. Open `src/components/BottomNav.tsx`
2. Find the `navItems` list
3. Add your page:

```tsx
const navItems = [
  { icon: Home, label: "Home", path: "/" },
  { icon: Wrench, label: "Tools", path: "/tools" }, // ← Add this!
  // ... other items
];
```

Don't forget to add the icon import at the top:
```tsx
import { Home, Wrench } from "lucide-react";
```

## 🎨 Making Things Look Nice

We use special words (classes) to style things:

| What You Want | Use This Class | Example |
|---------------|----------------|---------|
| Big text | `text-xl` | `<h1 className="text-xl">Big Title</h1>` |
| Small text | `text-sm` | `<p className="text-sm">Small text</p>` |
| Add space inside | `p-4` | `<div className="p-4">Has padding</div>` |
| Add space between | `space-y-4` | `<div className="space-y-4">...</div>` |
| Make it blue | `text-primary` | `<p className="text-primary">Blue text</p>` |
| Round corners | `rounded-lg` | `<Card className="rounded-lg">...</Card>` |
| Center things | `text-center` | `<div className="text-center">Centered</div>` |

## 🚨 Common Problems & Fixes

### "My page doesn't show up!"
- Did you save all files? (Ctrl+S or Cmd+S)
- Is your path spelled right? `/tools` not `/tool`
- Did you add the import at the top of App.tsx?
- Is the Route BEFORE the `*` route?

### "The styling looks weird!"
- Use `className` not `class`
- Check spelling: `className="p-4"` not `className="p-44"`

### "I got an error!"
- Red squiggly lines? You might have a typo
- Check that all `{` have a matching `}`
- Make sure all `(` have a matching `)`
- Ask for help - errors are normal!

## 💡 Cool Tips

1. **Copy from other pages!** 
   - Look at `Articles.tsx` or `Artifacts.tsx` for ideas
   - Copy parts you like and change them

2. **Use emoji for icons!**
   ```tsx
   <span className="text-2xl">🏺</span>
   ```

3. **Test often!**
   - Save your file
   - Check in the browser
   - Fix any problems right away

## 🎯 Challenge Projects

Once you understand the basics, try these:

1. **Easy:** Add a "Favorites" page that shows your favorite discoveries
2. **Medium:** Add a search box to your Tools page
3. **Hard:** Make a page that counts how many artifacts you've found

## 📚 Want to Learn More?

- **HTML/CSS:** The building blocks of web pages
- **JavaScript:** The programming language we're using
- **React:** The tool that makes our app work

## 🙋 Need Help?

1. Ask your teacher or teammate
2. Look at other pages in the project for examples
3. Try breaking the problem into smaller pieces
4. Remember: Everyone makes mistakes - that's how we learn!

## 🎉 You're Ready!

Now you know how to:
- ✅ Add new pages
- ✅ Add them to navigation
- ✅ Style them
- ✅ Fix common problems

Have fun building! Remember, the best way to learn is by trying things out! 🚀