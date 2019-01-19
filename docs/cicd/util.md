# Utility

Some utility functions and other useful stuff to help debug.

```bash
kubectl -n <target-namespace> run -it \
--image ubuntu aegutil --restart=Never --rm sh

# then you can...
apt-get update
apt-get install curl
apt-get install iputils-ping
```
