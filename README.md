# DevSnippet

**A full-stack code snippet manager built with React, TypeScript, and DeepSpace.**

DevSnippet helps developers save, organize, search, and reuse frequently used code snippets. It also maintains version history, allowing users to recover previous versions of their code.

**Live Application:** https://devsnippet.app.space/home  
**GitHub Repository:** https://github.com/aakashkohar6/devsnippet

---

## 1. Overview

Developers frequently write reusable code, including algorithms, SQL queries, utility functions, and configuration examples. Finding these snippets across multiple projects can be time-consuming.

DevSnippet provides a centralized place to store and manage code snippets, making them easier to retrieve and reuse.

The application supports authenticated users, persistent storage, CRUD operations, search, language filtering, syntax highlighting, and version history.

## 2. Features

### Code Snippet Management (CRUD)

- **Create:** Save a new snippet with a title, programming language, and source code.
- **Read:** View previously saved snippets.
- **Update:** Edit existing snippets.
- **Delete:** Permanently remove snippets with confirmation.

### Search and Filtering

- Search snippets by title, code, or programming language.
- Filter snippets by programming language.
- Quickly locate previously saved code.

### Syntax Highlighting

Code snippets are displayed with syntax highlighting to improve readability.

### Copy Code

Copy a snippet's source code to the clipboard for reuse in another project.

### Version History

DevSnippet preserves previous versions when snippets are edited.

Users can:

- View earlier versions of a snippet.
- Examine previously saved code.
- Restore an earlier version.
- Recover code after an unwanted modification.

### Authentication

Users sign in through DeepSpace authentication.

Snippets are associated with their owners, allowing users to manage their own saved code.

### Persistent Storage

Snippets and their version history are stored using DeepSpace's persistent records system.

Data remains available after refreshing the browser or reopening the application.

## 3. Technology Stack

| Technology | Purpose |
|---|---|
| React | Frontend user interface |
| TypeScript | Type-safe application development |
| Tailwind CSS | Styling and responsive layout |
| DeepSpace | Application platform and deployment |
| DeepSpace Authentication | User sign-in and identity |
| DeepSpace Records | Persistent application data |
| DeepSpace React Hooks | Querying and updating stored records |
| Git and GitHub | Version control and source code hosting |

## 4. Application Architecture

DevSnippet uses a React frontend integrated with DeepSpace's application services.

```text
                  User
                   |
                   v
           React + TypeScript
                   |
                   v
             DevSnippet UI
                   |
         +---------+---------+
         |                   |
         v                   v
    Authentication      Snippet Operations
         |                   |
         v                   v
    DeepSpace Auth      DeepSpace Hooks
                             |
                             v
                      Persistent Records
                             |
                   +---------+---------+
                   |                   |
                   v                   v
                Snippets         Snippet Versions
```

### Frontend

The frontend is responsible for:

- Displaying snippets.
- Handling user interactions.
- Managing form state.
- Searching and filtering.
- Displaying syntax-highlighted code.
- Showing version history.

### Backend and Data Storage

DeepSpace provides the application's persistent data services.

The frontend interacts with stored records through DeepSpace hooks, including:

- `useQuery()` for retrieving records.
- `useMutations()` for creating, updating, and deleting records.
- `useAuthProfileReady()` for accessing authentication state.

## 5. Database Design

The application uses two main collections.

### Snippets Collection

Stores the current version of each snippet.

| Field | Description |
|---|---|
| title | Snippet title |
| language | Programming language |
| code | Current source code |
| ownerId | User associated with the snippet |

DeepSpace also provides record metadata, including record identifiers and timestamps.

### Snippet Versions Collection

Stores historical versions of snippets.

Each version is associated with its original snippet, allowing the application to display and restore previous code.

### Version History Workflow

```text
Create Snippet
      |
      v
Save Current Version
      |
      v
User Edits Snippet
      |
      v
Preserve Previous Version
      |
      v
Save Updated Snippet
      |
      v
View Version History
      |
      v
Restore Previous Version
```

## 6. Running the Project Locally

### Prerequisites

- Node.js
- npm
- Git
- DeepSpace CLI access
- A DeepSpace account

### Step 1: Clone the Repository

```bash
git clone https://github.com/aakashkohar6/devsnippet.git
```

### Step 2: Navigate to the Project

```bash
cd devsnippet
```

### Step 3: Install Dependencies

```bash
npm install
```

### Step 4: Authenticate with DeepSpace

```bash
npx deepspace auth login
```

### Step 5: Start the Development Server

```bash
npx deepspace dev start
```

Open the local URL displayed in the terminal.

The project was developed locally at:

```text
http://localhost:5173/home
```

**Note:** Running a cloned project may require appropriate DeepSpace app access and configuration. Do not commit credentials or private environment files.

## 7. Deployment

DevSnippet is deployed using DeepSpace.

To deploy from an appropriately configured project:

```bash
npx deepspace deploy
```

DeepSpace builds the application, uploads its assets, and deploys it to the platform.

**Production URL:**

https://devsnippet.app.space/home

## 8. Testing and Verification

The application was tested locally and after production deployment.

### Functional Testing

| Test | Result |
|---|---|
| Create a new snippet | Passed |
| Retrieve saved snippets | Passed |
| Edit an existing snippet | Passed |
| Delete a snippet | Passed |
| Search snippets | Passed |
| Filter snippets by language | Passed |
| Copy source code | Passed |
| Display syntax highlighting | Passed |
| View previous versions | Passed |
| Restore an earlier version | Passed |
| Preserve data after refreshing | Passed |

### Production Testing

After deploying DevSnippet, the live application was tested by:

1. Signing in.
2. Creating a new Java snippet.
3. Refreshing the page to verify persistence.
4. Editing the saved snippet.
5. Opening version history.
6. Restoring an earlier version.
7. Deleting the test snippet.

These tests completed successfully.

The application was also checked using the TypeScript compiler:

```bash
npx tsc --noEmit
```

## 9. Technical Decisions and Tradeoffs

### Using DeepSpace for the Backend

DeepSpace was selected to provide authentication, persistent records, and deployment without building and maintaining a separate backend server.

This reduced implementation complexity and allowed more development time for user-facing functionality.

### Keeping the Application Focused

The project prioritizes a complete and functional snippet-management workflow instead of implementing numerous unfinished features.

The core functionality includes CRUD, search, filtering, and version history.

### Version History as a Core Feature

Version history was implemented to make the application more useful than a basic CRUD demo.

It allows users to preserve earlier code and recover from unwanted changes.

### Current Limitations

- No collaborative snippet editing.
- No direct GitHub snippet synchronization.
- No execution of stored code.
- No AI-powered code generation.
- No advanced code comparison interface.

These features were intentionally excluded to keep the project manageable within the assessment timeframe.

## 10. Development Process and AI Assistance

DevSnippet was developed with assistance from ChatGPT for learning, implementation guidance, debugging, and code review.

AI assistance was used to:

- Plan the application and prioritize features.
- Understand React and TypeScript concepts.
- Investigate DeepSpace APIs and TypeScript definitions.
- Implement and refine CRUD functionality.
- Develop search, filtering, and version-history features.
- Troubleshoot compilation and integration issues.
- Prepare deployment and project documentation.

The implementation was tested locally and in production.

Application behavior, including database persistence, editing, deletion, and version restoration, was manually verified through the browser.

## 11. Future Improvements

Potential enhancements include:

- Tags and categories for better organization.
- Advanced code comparison between versions.
- Import and export of snippets.
- GitHub Gist integration.
- Shared snippet collections.
- Keyboard shortcuts.
- Additional programming languages.
- Improved mobile layouts.

## 12. Project Links

**Live Demo:** https://devsnippet.app.space/home

**Source Code:** https://github.com/aakashkohar6/devsnippet

---

## Author

**Aakash Kohar**  
Computer Science Student  
SUNY New Paltz

GitHub: https://github.com/aakashkohar6

---

Built as a full-stack application project using React, TypeScript, and DeepSpace.
