# Repostiroy URL Validator JavaScript action

A GitHub action to validate URLs in the repository and report unreachable URLs by creating a GitHub issue

## Inputs

| Name        | Description                                                                         | Required? | Default |
| ----------- | ----------------------------------------------------------------------------------- | --------- | ------- |
| githubToken | GitHub secret token required to create an issue in current repository               | Yes       | N/A     |
| include     | an array of file patterns to validate (supports files only not directories for now) | No        | ["."]   |
| exclude     | an array of paths patterns to ignore                                                | No        | []      |

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
          githubToken: ${{ secrets.GH_TOKEN }}
          include: ["docs/**/*.md", "blog/**/*.mdx"]
          exclude: ["node_modules", "website/**/*.md"]
```

## About GitHub Token

This is required to create an issue for the current respository

### How to generate a token

### How to add the secret

## Additional Info

This README follows the format in tutorial - https://docs.github.com/en/actions/creating-actions/creating-a-javascript-action#creating-a-readme

### Future Inputs

1. checkModifiedFilesOnly
