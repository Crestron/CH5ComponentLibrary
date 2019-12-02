# Contributing
When contributing to this repository, please first discuss the change you wish to make with the team if the change is not reflected into a `JIRA` or `GITHUB` task.

## Branch name
Type: (feature, fix, test, docs, refactor, style, chore)
- **[type]/[JIRA_OR_ISSUE_KEY]-[short_description_or_full_task_name]**

##### E.g. 
- fix/CH5C-512-update-wct-tests-for-ch5-list

## Commit messages
Commit messages should follow Semantic Commit Messages rules. [Read more about Semantic Commit Messages](https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716). 

- **\[type]\(scope?): [commit_description]**

##### Notes:
- the body of the commit message can contain additional info, jira task link, PR link, and so on.
- use present tense in the commit message

## Pull Requests
When opening a new pull request please take into account the following steps:
- the Pull Request is concise, and doesn't contain other out of the scope changes
- it should have at least two Reviewers
- it should have at least one Assignee
- if the PR will be merged at the next release the `release` label should be added
- use appropriate labels if they are available

## Contributing to the projects
- When adding or updating a feature, fixing an issue, writing documentation or making any kind of changes in the source code, if applicable, make sure unit or wct tests are created or updated accordingly.
- Because of the nature of the project, for UI components, WCT Tests are preferred over unit tests. 
They are located inside the crestron-components-lib/wct_tests folder, while unit tests should be written in the corresponding folder.
- Additionally, if new attributes are added for ch5-components, make sure to document them in the showcase application and add them to the vs code extension schema, by updating the interfaces in
crestron-components-lib/_interfaces and running the metadata generator (check the corresponding [readme](crestron-metadata-generator/README.md)).

## Resources
- Work In Progress
