module.exports = {
  types: [
    {
      value: 'build',
      name: '📦  build: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)'
    },
    {
      value: 'ci',
      name: '🕓  ci: Changes to our CI configuration files and scripts (example scopes: Circle, Docker, BrowserStack)'
    },
    {
      value: 'docs',
      name: '📚  docs: Documentation only changes'
    },
    {
      value: 'feat',
      name: '🚀  feat: A new feature'
    },
    {
      value: 'fix',
      name: '🔧  fix: A bug fix'
    },
    {
      value: 'perf',
      name: '📈  perf: A code change that improves performance'
    },
    {
      value: 'refactor',
      name: '🔨  refactor: A code change that neither fixes a bug nor adds a feature'
    },
    {
      value: 'release',
      name: '🚢  release: Release a new version of current project'
    },
    {
      value: 'revert',
      name: '⏱  revert: Revert to a commit'
    },
    {
      value: 'style',
      name: '💅  style: Code Style, Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)'
    },
    {
      value: 'test',
      name: '🔍  test: Add missing tests or correcting existing tests'
    },
    {
      value: 'workflow',
      name: '📦  [NOT RECOMMENDED] workflow: Changes that only affect the workflow. Such as updateing build systems or CI etc.'
    }
  ],
  // Specify the scopes for your particular project
  scopes: [],
  allowCustomScopes: true,
  allowBreakingChanges: ['feat', 'fix']
}
