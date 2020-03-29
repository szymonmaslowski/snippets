# Usefull git commands

1. [List tags sorted by create date](list-tags-sorted-by-creation-date)
1. [List all commits on given `<revision>` of given `<author>` in last month](list-tags-sorted-from-oldest-to-newest)

### List tags sorted by creation date
```bash
git for-each-ref --sort=creatordate --format '%(refname) %(creatordate)' refs/tags
```

### List all commits for `<revision>` and `<author>` of last month
```bash
git log <revision> --pretty=format:"%BCommit SHA %h %n%n----%n" --date=short --reverse --since=1.months.ago --author=<author>
```
