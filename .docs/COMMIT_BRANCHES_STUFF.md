<div align="center">

# Commits & branches & struff

</div>

We will assume in here that you're confident enough with git and how to manage branches, create pull-requests on github and clone repositories if necessary.

## How to write a good commit message

For future references, here is the whole thing:

[Git Commit Message Conventions](http://karma-runner.github.io/6.3/dev/git-commit-msg.html)

### TL;DR

**Rule 1: English please**

Yeah alright we both know we are the frenchest fucks out there with frickin baguettes and omelettes. But we regularly happen to work with people from around the world, and french isn't an easy task for any foreigner.

**Rule 2: Clear syntax**

```bash
<type>(<scope>): <subject>
```

Allowed types:

- feat → New feature
- fix → Bug fix
- docs → Documentation update (READMEs, CHANGELOGs, ...)
- refactor → When someone fucked-up so bad you have to rewrite plenty of things
- test → When adding/updating some tests
- chore → Dependencies maintenance, updates to internal scripts, ...

Don't do:

```text
Added new feature to job guetter api
(Fixed) the thing that was not working
wow bro you fucked up this line
```

Do:
```text
fix(auth): fix users list order on custom keys
docs: update changelog
refactor(general): clean code
chore: bump version
```
**Rule 3: Clear goal**

Try to be the clearest possible when it comes to your commit message.

Good & clear commit messages allow to quickly:

- Understand project history
- Generate changelogs


## How to name a branch like a cool 90s kid

Branches are no different than commits. Only the syntax differs as branches **should have a slug-like syntax.**

**Rule 1: English please**

Please refer to *Rule 1* of *How to write a good commit message*

**Rule 2: Clear syntax**

```bash
<type>/<name>
```

Allowed types:

- feature → New feature
- fix → Bugfix
- refactor → Drastically rewrites a big percentage of the code or architecture
- docs → Documentation updates

Don't do:

```text
Feature-date-time-picker
Fix/FixForThePreviousFix
```

Do:

```text
feature/new-date-time-picker
fix/localized-date-picker
```

**Rule 3: Clear goal**

Please refer to *Rule 3* of *How to write a good commit message*

## What about PRs?

We tend to heavily use pull-requests to avoid any unwanted **bad** commits/code in our codebase.

Pull requests have the exact same rules as commits, but with a new twist:

Add an emoji so it's clear what it does from a list view.

Allowed emojis:

- ✨ → New feature
- 🐛 → Bug fix
- ♻️ → Drastically rewrites a big percentage of the code or architecture
- 🏗 → Add/update unit tests
- 📦 → Dependency maintenance and/or internal script update
- 📖 → Documentation update

Don't do (anymore):

```text
Feature: Add new time picker
fix the thing that was not working
```

Do:

```text
✨ feat(dashboard): add new time picker to stats view
🐛 fix(access): don't register emails twice on mailchimp
```
