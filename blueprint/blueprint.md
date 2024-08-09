# Helm chart

This is a first version of a Helm chart to deploy the worldcup application.

## Known issues to be improved

- Route should support https only
- DB volume is killed at each restart (no data persistence)
- initDB: should we keep this or not? (vs import and data persistence on restart)
- nodeSelector needed because of hostpath for DB volume
- add a values spec file
