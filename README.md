# Repostiroy URL Validator JavaScript action

A GitHub action to validate URLs in the repository and report unreachable URLs by creating a GitHub issue

## Inputs

| Name        | Description                                                                       |
| ----------- | --------------------------------------------------------------------------------- |
| githubToken | GitHub secret token required to create an issue in current repository             |
| include     | a list of file patterns to validate (supports files only not directories for now) |
| exclude     | a list of paths patterns to ignore                                                |

## Outputs

None.  
But it creates a GitHub issue on each run to report broken links (No issue is created if none found.)

## Example usage

Following action file will run the validation process daily at 15:00

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

## Additional Info

This README follows the format in tutorial - https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#creating-a-readme
