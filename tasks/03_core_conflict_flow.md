# Task 3: Core Conflict Flow

**Status: Not Started**

- **Frontend:**
  - [ ] Create the "New Conflict" wizard (multi-step form).
    - Step 1: Title, description, language.
    - Step 2: Invite parties (Party A is self, invite Party B by phone).
    - Step 3: Invite witnesses (optional).
    - Step 4: Review and submit.
  - [ ] Build the main "Conflict Room" UI.
    - Use a tabbed interface: My Arguments, Q&A, Status.
    - Implement CRUD functionality for `inputs` (arguments).
    - Display questions from the arbiter.
    - Show the current status of the conflict.
- **Backend (API Endpoints):**
  - [ ] Implement `POST /conflicts` to create a new conflict and its members.
  - [ ] Implement `GET /conflicts/:id` to fetch data for the conflict room (respecting RLS).
  - [ ] Implement `POST /inputs` and `PATCH /inputs/:id`.
