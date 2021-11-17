<div align="center">

# MongoDB Database

</div>

![Job_guetter](https://user-images.githubusercontent.com/55241427/139235983-f2cd6813-ba81-4871-838d-daa35c41dc7f.png)

# Export & Import

Manually export database
```bash
mongodump --db job_guetter_api --gzip --archive=./.docs/database_schema/dev/db.tmp.tar.gz
```
Manually import database
```bash
mongorestore --gzip --noIndexRestore --archive=./.docs/database_schema/dev/db.tmp.tar.gz
```