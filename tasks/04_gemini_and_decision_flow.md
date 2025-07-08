# Task 4: Gemini Integration & Decision Flow

**Status: Not Started**

- **Frontend:**
  - [ ] Add a "Ready for Decision" button for parties.
  - [ ] Disable the button until certain conditions are met.
  - [ ] Display the final decision once available.
  - [ ] Implement the UI for the appeal process.
- **Backend (Supabase Edge Functions):**
  - [ ] Create a function for the Q&A loop (`/conflicts/:id/review`).
    - It should gather all context (inputs, past questions).
    - Call Gemini API with a structured prompt to generate clarifying questions.
    - Store the questions in the `questions` table.
  - [ ] Create the `POST /conflicts/:id/decide` function.
    - Verify that all parties are ready.
    - Gather all context and call Gemini with a prompt to generate a final, reasoned decision.
    - Store the result in the `decisions` table.
  - [ ] Implement the `POST /conflicts/:id/appeal` endpoint.
