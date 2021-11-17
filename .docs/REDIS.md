<div align="center">

# Redis

</div>

## Installation

[Official Doc](https://redis.io/download) (Recomanded)

#### OR

```bash
# basically
sudo apt-get install redis-server
```

## Usage
Check if local server run :
```bash
# do
redis-cli ping
> PONG
```

Run local server if is not :
```bash
redis-sever
```

All the other most important stuff are doing in `redis-cli` :
```bash
#do
redis-cli

# Search keys
127.0.0.1:6379> KEYS *
1) "7YxzCWFaSF9cAcy3sdWILna8AEcUq0WoI7sKSwM59Ic="
2) "7YxzCWFaSF9cAcy3sdWILna8AEcUq0WoI7sKSwM59Ic="

# Show server activities
127.0.0.1:6379> MONITOR
OK
# After request
1637171027.396987 [0 127.0.0.1:52602] "info"
1637171035.029546 [0 127.0.0.1:52426] "get" "7YxzCWFaSF9cAcy3sdWILna8AEcUq0WoI7sKSwM59Ic="
1637171035.031187 [0 127.0.0.1:52426] "multi"
1637171035.031202 [0 127.0.0.1:52426] "set" "7YxzCWFaSF9cAcy3sdWILna8AEcUq0WoI7sKSwM59Ic=" "{\"count\":12,\"lastRequest\":\"2021-11-17T17:43:55.030Z\",\"firstRequest\":\"2021-11-17T17:14:07.202Z\"}"
1637171035.031228 [0 127.0.0.1:52426] "expire" "7YxzCWFaSF9cAcy3sdWILna8AEcUq0WoI7sKSwM59Ic=" "16200"
1637171035.031240 [0 127.0.0.1:52426] "exec"

```