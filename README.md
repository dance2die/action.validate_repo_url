# action.validate_repo_url

## What is this?

GitHub action to validate URLs in the repository and report unreachable URLs by creating a GitHub issue

## Usage

```yml
name: Report broken URLs

on:
  schedule:
    - cron: "0 15 * * *"

jobs:
  report_job:
    runs-on: ubuntu-latest

    steps:
      - name: Validate repository URLs and report broken link(s)
        id: URL_validation_job
        uses: dance2die/action.validate_repo_url@master
        with:
          githubToken: ${{ secrets.GITHUB_TOKEN }}
          include: ["docs/**/*.md", "blog/**/*.mdx"]
          exclude: ["node_modules", "website/**/*.md"]
```

## Configuration
