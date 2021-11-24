## Dev env file :

```text
#############
# DEV
#############

# API
COOKIE_NAME="_job_guetter"
DEBUG=true
DOMAIN=https://api.job-guetter.develop:8443

# Signature
TOKEN_KEY="wvi)#evn(4iq#i77#^+b34@m4o2)x7#**t+6dh5n28qg@6%)do"
REFRESH_TOKEN_KEY=")q+b*f$djvr2h^cx!wi*jns@s_t$2q$bug&&q@rr=*&d=tguf5"
TOKEN_NORMAL_EXPIRY="10m"
TOKEN_EXTENDED_EXPIRY="30d"

# MongoDB
MONGODB_URI="mongodb://localhost:27017/job_guetter_api"

# Redis
REDIS_URL="localhost"
REDIS_PORT=6379

# Sendgrid
SENDGRID_API_KEY="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"
EMAIL_SENDER={ "email": "tyler.escolano@ynov.com", "name": "Job Guetter"}

# Sirene API
SIRENE_URI="https://entreprise.data.gouv.fr/api/sirene/v1/siren/"


```
