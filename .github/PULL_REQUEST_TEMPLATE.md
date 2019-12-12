# Developer tips
(you can delete this section)
1. It is recommended to have at least 2 approvals, or approval from the PR Assignee before merging into DEV.
2. You can tag the branch with WIP, this means nobody (other than you) will merge your changes even if you have the necessary approvals.
3. It is recommended to use squash in favor of a merge commit when merging your feature branch into DEV.
4. Add relevant labels (Priority, Bug, Documentation, Work In Progress and so on) to your PR.
5. Wait for the Azure Build Pipeline check to pass before merging.
6. You can delete sections from this template that are irrelevant to your changes, **like this Developer Tips section**.

## Description

- Please include a summary of the change and what has been fixed / covered in tests / updated. 
- Please also include relevant motivation and context. List any dependencies that are required for this change.
- You can include before and after images or gifs if the changes are better explained visually.

### Fixes:

- Add a link to the JIRA issue or a short description of what has been fixed.

### Test data

- If relevant, please include snippets of code, links to docs / showcase examples and so on.

## Type of change

Delete options that are not relevant.

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update (add or update existing documentation, no changes to business logic)
- [ ] Other (refactor, style changes and so on, include an explanation in the description)

# Checklist:

- [ ] My code follows the style guidelines of this project
- [ ] I have performed a self-review of my own code
- [ ] I have commented my code, particularly in hard-to-understand areas
- [ ] I have made corresponding changes to the documentation
- [ ] My changes generate no new warnings
- [ ] I have added tests that prove my fix is effective or that my feature works
- [ ] New and existing unit tests pass locally with my changes
