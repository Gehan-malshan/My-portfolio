# Gehan Malshan portfolio

React, TypeScript, Vite, and TanStack Router portfolio. The site is designed for easy content updates without changing the layout.

## Run locally

```bash
npm install
npm run dev
```

## Update your details

- Edit `src/data/portfolio.ts` for your introduction, education, projects, volunteering, contact links, and CV path.
- Replace `public/Gehan-Malshan-CV-Template.pdf` with your finished CV, then set `cvPath` to its filename and `cvIsTemplate` to `false`.
- The hero uses `public/gehan-editorial.png`, a generated black-and-white cutout based on your supplied photo. The original is kept as `public/gehan-portrait.png`.
- For a project, set `placeholder: false` and add its live or repository URL. Add more objects to the `projects` array as needed.
- For volunteering, set `placeholder: false` and add entries under the appropriate category.

The current project and volunteering cards are clearly marked starters. Contact links remain hidden until real addresses are added.

## Build

```bash
npm run build
```
