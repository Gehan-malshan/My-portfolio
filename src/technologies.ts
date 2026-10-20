export const technologies = [
  ['JavaScript', 'javascript'], ['TypeScript', 'typescript'], ['React', 'react'],
  ['HTML5', 'html5'], ['CSS3', 'css3'], ['Python', 'python'],
  ['C#', 'csharp'], ['Angular', 'angular'], ['AWS', 'amazonaws'],
  ['Apache Kafka', 'apachekafka'], ['Bootstrap', 'bootstrap'], ['C', 'c'],
  ['Docker', 'docker'], ['Express', 'express'], ['Figma', 'figma'],
  ['Git', 'git'], ['GitLab', 'gitlab'], ['GitHub', 'github'],
  ['IntelliJ IDEA', 'intellijidea'], ['Java', 'java'], ['Jira', 'jira'],
  ['Kubernetes', 'kubernetes'], ['Linux', 'linux'], ['Material UI', 'mui'],
  ['MongoDB', 'mongodb'], ['MySQL', 'mysql'], ['Next.js', 'nextdotjs'],
  ['Nginx', 'nginx'], ['npm', 'npm'], ['Node.js', 'nodedotjs'],
  ['PostgreSQL', 'postgresql'], ['Redis', 'redis'], ['Spring', 'spring'],
  ['VS Code', 'vscode'], ['ESLint', 'eslint'], ['Solidity', 'solidity'],
  ['Ubuntu', 'ubuntu'], ['Vercel', 'vercel'], ['WebStorm', 'webstorm'],
  ['Apache', 'apache'], ['Selenium', 'selenium'], ['.NET', 'dotnet'],
  ['Oracle', 'oracle'], ['Prometheus', 'prometheus'], ['Microsoft Azure', 'azure'],
  ['Zed', 'zedindustries'], ['GitHub Actions', 'githubactions'], ['Terraform', 'terraform'],
] as const

// These brands use a predominantly black official mark. Reveal a light tile on hover.
export const darkTechnologyIcons = new Set(['amazonaws', 'apachekafka', 'express', 'github', 'nextdotjs', 'vercel'])

export const spiralTechnologySlugs = [
  'react', 'typescript', 'python', 'docker', 'figma', 'nodedotjs',
  'javascript', 'postgresql', 'git', 'mongodb', 'vscode', 'angular',
] as const
