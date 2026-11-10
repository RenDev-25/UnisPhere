# OJTFlow Frontend

## Project Overview
OJTFlow is an OJT Placement and Verification System developed for Batangas State University – The National Engineering University.

This repository contains the frontend application for the Student Portal and OJT Coordinator Portal.

## Technology Stack
- HTML5
- TypeScript
- Plain CSS3
- Chart.js
- Vite
- Node.js and npm

## Architecture Rules

No file or folder may be added, renamed or moved without an Architecture Change Note.

Files marked [ND] (not specified in this guide) are built only after the product owner approves them.

Do not install or use React, Vue, Angular, Bootstrap, Tailwind CSS, or any other UI framework.

## Project Folder Structure

The complete approved folder structure is documented in Appendix A of the OJTFlow Frontend Development Roadmap.

All folders must follow Appendix A exactly. Create files only during their assigned development phases.

## Open Decisions

The following decisions remain open and must be confirmed before the affected features or rules are finalized.

| Decision ID | Status |
|---|---|
| G-01 | Open |
| G-02 | Open |
| G-03 | Open |
| G-04 | Open |
| G-05 | Open |
| G-06 | Open |
| G-07 | Open |
| G-08 | Open |
| G-09 | Open |
| G-10 | Open |
| G-11 | Open |
| G-12 | Open |
| G-13 | Open |
| G-14 | Open |
| G-15 | Open |
| G-16 | Open |
| G-17 | Open |
| G-18 | Open |
| G-19 | Open |
| G-20 | Open |
| G-21 | Open |
| G-22 | Open |
| G-23 | Open |
| G-24 | Open |
| G-25 | Open |
| G-26 | Open |
| G-27 | Open |
| G-28 | Open |
| G-29 | Open |
| G-30 | Open |
| G-31 | Open |
| G-32 | Open |
| G-33 | Open |

**Reference:** Refer to Part III of the roadmap for the full description and safe handling of each decision.

## Development Rule

Follow the development phases in numerical order. Verify every visible change before proceeding to dependent tasks.

The frontend must follow the approved roadmap and must not introduce unspecified features.



## Font Loading Decision

**Font:** Inter

**Loading method:** Online Google Fonts provider

**Weight range:** 100–900

**Fallback:** system-ui, sans-serif

**Reason:** The frontend uses Google Fonts to load Inter without adding local font files or additional packages. System UI and sans-serif are used as fallbacks if the online font provider is unavailable.

**Future consideration:** Local font files may be adopted if offline support or self-hosting becomes a project requirement.
