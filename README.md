# Gehan Malshan portfolio

React, TypeScript, Vite, and TanStack Router portfolio. The site is designed for easy content updates without changing the layout.

## Run locally

```bash
bun install
bun run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

## Update your details

- Edit `src/data/portfolio.ts` for your introduction, education, projects, volunteering, email, social links, and CV path. The footer's contact buttons become active when you add real links.
- Replace `public/Gehan-Malshan-CV-Template.pdf` with your finished CV, then set `cvPath` to its filename and `cvIsTemplate` to `false`.
- The hero uses `public/gehan-editorial.png`, a generated black-and-white cutout based on your supplied photo.
- For a project, set `placeholder: false` and add its live or repository URL. Add more objects to the `projects` array as needed.
- For volunteering, set `placeholder: false` and add entries under the appropriate category.

The current project and volunteering cards are clearly marked starters. Contact links remain hidden until real addresses are added.

## Build

```bash
bun run build
```
