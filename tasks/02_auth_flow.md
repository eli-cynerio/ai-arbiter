# Task 2: Authentication Flow

**Status: Completed**

- **Backend (Supabase Auth):**
  - [x] Used Supabase's built-in email/password authentication.
  - [x] Relied on Supabase client for JWT handling and session management.
- **Frontend:**
  - [x] Created an authentication page for Login.
  - [x] Created an authentication page for Sign Up.
  - [x] Built forms for email and password input with validation (`react-hook-form` and `zod`).
  - [x] Implemented state management (`zustand`) to handle auth state (`isLoading`, `isAuthenticated`, `user`).
  - [x] Supabase client handles secure JWT storage.
  - [x] Created protected routes that require authentication.
  - [x] Implemented a global Layout component with conditional navigation.
