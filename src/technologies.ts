export const technologies = [
  ['Linux', 'linux'], ['Docker', 'docker'], ['Kubernetes', 'kubernetes'],
  ['AWS', 'amazonaws'], ['Microsoft Azure', 'azure'], ['Oracle', 'oracle'],
  ['GitHub Actions', 'githubactions'], ['Terraform', 'terraform'], ['Prometheus', 'prometheus'],
  ['Git', 'git'], ['GitHub', 'github'], ['GitLab', 'gitlab'],
  ['Nginx', 'nginx'], ['Apache Kafka', 'apachekafka'], ['PostgreSQL', 'postgresql'],
  ['Redis', 'redis'], ['MongoDB', 'mongodb'], ['MySQL', 'mysql'],
  ['Python', 'python'], ['TypeScript', 'typescript'], ['JavaScript', 'javascript'],
  ['React', 'react'], ['Node.js', 'nodedotjs'], ['Express', 'express'],
  ['Ubuntu', 'ubuntu'], ['Vercel', 'vercel'], ['Java', 'java'],
  ['Spring', 'spring'], ['C#', 'csharp'], ['.NET', 'dotnet'],
  ['Angular', 'angular'], ['Next.js', 'nextdotjs'], ['C', 'c'],
  ['HTML5', 'html5'], ['CSS3', 'css3'], ['npm', 'npm'],
  ['Selenium', 'selenium'], ['ESLint', 'eslint'], ['Jira', 'jira'],
  ['VS Code', 'vscode'], ['IntelliJ IDEA', 'intellijidea'], ['WebStorm', 'webstorm'],
  ['Zed', 'zedindustries'], ['Apache', 'apache'], ['Solidity', 'solidity'],
  ['Bootstrap', 'bootstrap'], ['Material UI', 'mui'], ['Figma', 'figma'],
] as const

// These brands use a predominantly black official mark. Reveal a light tile on hover.
export const darkTechnologyIcons = new Set(['amazonaws', 'apachekafka', 'express', 'github', 'vercel'])

export const spiralTechnologySlugs = [
  'linux', 'docker', 'kubernetes', 'terraform', 'githubactions', 'python',
  'typescript', 'postgresql', 'git', 'redis', 'react', 'nodedotjs',
] as const
