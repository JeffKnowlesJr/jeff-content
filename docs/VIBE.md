Vibe Coding Process Model:

1 Define the Task & Context (Problem Description Principles):
Clearly articulate the problem or desired outcome in natural language.
Break down complex tasks into smaller, manageable chunks suitable for the LLM.
Provide necessary context: existing code snippets, constraints (performance, style, libraries), language/framework preference, desired output format.
Self-Correction: Is the prompt clear? Does it contain enough context? Is it specific enough? (Reference prompt templates/patterns if available).

2 Generate Initial Code (AI Interaction):
Submit the refined prompt to the AI coding assistant (LLM).

3 Evaluate & Test (Code Evaluation & Refinement):
Critically Review: Read the AI-generated code. Does it make sense conceptually? Does it seem to address the prompt?
Initial Testing: Run the code. Does it execute? Does it produce the expected output for basic cases? Use automated tests if applicable.
Security Scan (Ethical & Security): Does the code handle inputs safely? Does it introduce obvious vulnerabilities? (Use security scanning tools if available).
IP/Licensing Check (Ethical & Security): Does the code seem to be copied verbatim from a source with restrictive licensing?

4 Iterate & Refine (AI-Human Collaboration / Code Evaluation):
If Unsatisfactory: Don't necessarily start over. Identify specific issues (errors, incorrect logic, style violations, missing edge cases).
Refinement Prompt: Provide targeted feedback to the AI. Examples: "This code throws an error when X happens, please add handling for that." / "Please refactor this using the async/await pattern." / "Ensure the variable names follow camelCase."
Repeat Steps 2-4: Re-generate, re-evaluate, re-test until the code meets requirements or it becomes clear manual intervention is faster/better.

5 Integrate into Codebase (Integration with Existing Codebase):
Contextual Fit: Ensure the code fits logically within the existing architecture.
Style Consistency: Adjust formatting, naming, and patterns to match the surrounding codebase (or prompt the AI to do so with specific examples/style guides).
Dependency Check: Add necessary imports/dependencies.
Integration Testing: Test the new code in conjunction with the parts of the codebase it interacts with. Check for edge cases and conflicts.

6 Final Review & Documentation (AI-Human Collaboration / Integration):
Human Oversight: Perform a final human review, especially for critical logic.
Documentation: Add necessary comments (where non-trivial), update relevant documentation, and note if the section was primarily AI-generated if required by team standards.

7 Commit & Deploy: Follow standard version control and deployment procedures.

Decision Points:
Manual Override: At any stage (especially 4 & 5), the developer decides if it's more efficient to manually write/modify the code rather than continuing to prompt the AI.
Acceptance vs. Understanding: Based on project criticality (Step 2 & 5 in VIBE.md), decide the required depth of understanding vs. accepting functional "black-box" code. More critical = deeper understanding needed.
Task Suitability: Is this task appropriate for Vibe Coding based on the project type table? (e.g., less suitable for core, security-critical infra).
