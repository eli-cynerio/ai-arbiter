# Task 2: Authentication Flow

**Status: Not Started**

- **Backend (Supabase Edge Function):**
  - [ ] Create `/auth/whatsapp` endpoint to handle phone number submission.
  - [ ] Implement logic to generate a verification code and associate it with the hashed phone number.
  - [ ] Integrate with WhatsApp Cloud API to send the verification code to the user.
  - [ ] Create `/auth/verify` endpoint to check the submitted code.
  - [ ] On successful verification, create a new user in `public.users` if one doesn't exist.
  - [ ] Sign a JWT using Supabase Auth and return it to the client.
- **Frontend:**
  - [ ] Create an authentication page/modal.
  - [ ] Build the form for phone number input with validation.
  - [ ] Build the form for verification code input.
  - [ ] Implement state management (Zustand) to handle auth state (e.g., `isLoading`, `isAuthenticated`, `user`).
  - [ ] Implement logic to store the JWT securely and attach it to subsequent API requests.
  - [ ] Create protected routes that require authentication.
