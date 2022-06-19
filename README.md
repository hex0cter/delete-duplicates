# Duplicate file cleaner inspired by [go-find-duplicates](https://github.com/m-manu/go-find-duplicates)

## How to use
```
yarn start -j <duplicates.json> {dir-1} {dir-2} ... {dir-n}
```


Let's assume a file is found in the following paths:
```
[
    '/a/b/c',
    '/a/d/e',
    '/b/d/c',
    '/e/g'
]
```
and the dir list is `['/e', '/a/d']`,
