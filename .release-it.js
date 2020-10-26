module.exports = {
  'github': {
    release: true
  },
  'git': {
    tagName: 'v${version}',
    commitMessage: 'release: v${version}',
    requireUpstream: false,
    requireCleanWorkingDir: false
  },
  npm: {
    publish: true
  },
  plugins: {
    '@release-it/conventional-changelog': {
      preset: 'angular',
      infile: 'CHANGELOG.md'
    }
  }
}
