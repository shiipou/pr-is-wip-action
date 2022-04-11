# pr-is-wip-action

This GitHub action will check all your PR and drastically reduce your CI usage.

**Description**: As it take only 1 second to run, your GitHub Workflow never break your wallet again.

## Dependencies

This PR can only run on events `pull_request` and `pull_request_target`.

## Usage

### GitHub Workflow

You must define a custom workflow using YAML file in the directory `.github/wokflows/`.

Your workflow declaration must fit the following :

```yaml
name: Check CI
on:
  pull_request:
    types:
      - opened
      - edited
      - synchronize

jobs:
  prIsWip:
    name: PR is WIP?
    runs-on: ubuntu-latest
    timeout-minutes: 1
    steps:
      - id: pr-is-wip
        uses: shiipou/pr-is-wip-action@v1.1.x
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}

  checks:
    name: Checks
    runs-on: ubuntu-latest
    needs:
      - prIsWip
    if: needs.prIsWip.outputs.isWip == 'false'
    steps:
      - uses: actions/checkout@v2
      [...]
```

## Contributing

### Getting involved

TODO


### Build it locally

To build it you need to install node12 and install all the dependancy defined in `package.json`

```bash
# Install node dependancies
npm install
# Build the dist js files
npm run package
```

### Getting help

If you have questions, concerns, bug reports, etc, please file an issue in this repository's Issue Tracker.



## License
This project is licensed under the MIT License.
