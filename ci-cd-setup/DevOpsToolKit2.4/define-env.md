# Define Production Environment Variables

[go to start](./start-here.md)


To make live easy let set some environment variables for our shell:

**LB_IP**

Find your loadBalancer IP:

On docker-for-windows this is `127.0.0.1`  for other cluster you can try the following:

```
kubectl -n ingress-nginx get svc ingress-nginx -o jsonpath="{.status.loadBalancer.ingress[0].hostname}"
#or
kubectl -n ingress-nginx get svc ingress-nginx -o jsonpath="{.status.loadBalancer.ingress[0].ip}"
```

Set it:

```
LB_IP="127.0.0.1"

# or make it stick do this
echo "export LB_IP=127.0.0.1" >> ~/.profile
. ~/.profile
```

**ADDR**

```
ADDR=$LB_IP.nip.io
echo $ADDR
ADDR_ESC=$(echo $ADDR | sed -e "s@\.@\\\.@g")
echo $ADDR_ESC

# or make it stick do this
echo "export ADDR=$LB_IP.nip.io" >> ~/.profile
echo 'ADDR_ESC=$(echo $ADDR | sed -e "s@\.@\\\.@g")' >> ~/.profile
. ~/.profile
```

**DH_USER**

```
DH_USER="tonygilkerson"
echo "export DH_USER=tonygilkerson" >> ~/.profile
. ~/.profile

echo $DH_USER
```
