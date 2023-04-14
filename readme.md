# Intro

Lorsque l'arborescence des tests est décalée avec l'arborescence des sources (après un refactoring par exemple), ce programme peut replacer les fichiers de tests dans une arborescence qui correspond à celle des sources

# commandes:

- `npm install`
- `npm build`
- `node ./build/sync-tests.js <répertoire des tests> <répertoire des sources>`

## Exemple

`clear && npm run build && node ./build/sync-tests.js ../rece-ui/src/__tests__/views ../rece-ui/src/views`

## Type de log

- `[FIX] incorrect path for test: xxx` : Un fichier test a été déplacé dans un nouveau répertoire

- `[REMOVE] xxx`: Un répertoire vide a été supprimé

- `[WARNING] Duplicate file found: xxx` : Les fichiers dont les noms sont en double ne sont pas traités (en effet c'est le nom du fichier qui fait foi pour rechercher le fichier dans l'arborescence des sources qui correspond à un fichier test)

- `[WARNING] lonely test: xxx` : Le fichier source correspondant au fichier test n'a pas été trouvé dans l'arborescence des sources
