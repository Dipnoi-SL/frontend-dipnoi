# `git` use cases

- I want to update my local branch with any remote repository changes:

  - Ensure you install any new dependencies with `npm install` **after** your local branch is updated.

        git pull

- I want to check the branch I'm currently in:

        git status

- I want to move to another existing branch:

        git checkout NAME_OF_THE_BRANCH

- I want to move to another branch, but it only exists in the remote repository:

        git fetch && git checkout NAME_OF_THE_BRANCH

- I want to create a new branch:

  - Ensure you are in the correct branch with `git status` and maybe `git checkout`.
  - Ensure the current branch is up to date with `git pull`.
  - Ensure the new name respects the following accepted formats:

    - `feature/NUMBER_OF_THE_GITHUB_ISSUE/SHORT_DESCRIPTION`
    - `bugfix/NUMBER_OF_THE_GITHUB_ISSUE/SHORT_DESCRIPTION`
    - `hotfix/NUMBER_OF_THE_GITHUB_ISSUE/SHORT_DESCRIPTION`
    - `release/NUMBER_OF_THE_GITHUB_ISSUE/SHORT_DESCRIPTION`

          git checkout -b NAME_OF_THE_NEW_BRANCH

- I want to stage a modified file:

        git add ./PATH_TO_THE_FILE

- I want to stage all modified files in the working directory:

        git add .

- I want to check what files are staged:

        git status

- I want to commit my staged files:

        git commit -m "DESCRIPTION_MESSAGE"

- I want to update the remote repository with my local changes:

        git push

- I want to fix conflicts:

  - Ensure you are in the correct branch with `git status` and maybe `git checkout`.
  - Ensure the current branch is up to date with `git pull`.

        git pull origin NAME_OF_THE_REMOTE_BRANCH_TO_MERGE

- I want to reset all changes in my current branch: **_DANGER, THIS IS IRREVERSIBLE_**

        git reset --hard
