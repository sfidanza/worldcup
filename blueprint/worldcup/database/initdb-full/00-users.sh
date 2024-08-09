set -e

mongo <<EOF
use $MONGO_INITDB_DATABASE

db.users.insertMany([
    {"id":"native-$ADMIN_ID","pwd":"$ADMIN_PWD","name":"$ADMIN_NAME","isAdmin":true}
])

EOF
