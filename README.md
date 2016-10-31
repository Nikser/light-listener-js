Node.js http wrapper over [noolitepc](https://github.com/olegart/noolite)
===================================

Run a new docker container
```
docker-compose build && docker-compose up -d
```

Http request, e.g.:
```
http://127.0.0.1:8090/?cmd={COMMAND}&ch={CHANNEL}&level={LEVEL}
```
{COMMAND} - on, off, switch, bind, unbind etc. (_noolitepc --help_)
{CHANNEL} - # channel 0,1,32
{LEVEL}   - Level 0-255