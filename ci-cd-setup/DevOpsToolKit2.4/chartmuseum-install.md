# Install Chart Museum

[go to start](./start-here.md)

**Install**

Install `stable/chartmuseum` chart with override values (p. 130).

```
cd kube-spec

# set chartmuseum host env vars
echo $LB_IP
CM_ADDR="cm.$LB_IP.nip.io"
CM_ADDR_ESC=$(echo $CM_ADDR | sed -e "s@\.@\\\.@g")
echo $CM_ADDR_ESC


helm install stable/chartmuseum \
--namespace charts \
--name cm \
--values helm/chartmuseum-values.yml \
--set ingress.hosts."$CM_ADDR_ESC"={"/"} \
--set env.secret.BASIC_AUTH_USER=admin \
--set env.secret.BASIC_AUTH_PASS=admin

# verify
kubectl -n charts \
rollout status deploy \
cm-chartmuseum

curl "http://$CM_ADDR/health"  
curl "http://$CM_ADDR/index.yaml" -u admin:admin
```

Add the repo to helm so you can push charts to it.

```
helm plugin install \
https://github.com/chartmuseum/helm-push

helm push \
<my-chart> \
chartmuseum \
--username admin \
--password admin

# can also do this
helm search chartmuseum/
helm repo update
helm search chartmuseum/
helm inspect chartmuseum/<my-chart>

```
More commands in [vfarcic gist](https://gist.github.com/vfarcic/e0657623045b43259fe258a146f05e1a)

**Upgrade**

To upgrade after modifying values.

```
 helm upgrade cm stable/chartmuseum \
  --values helm/chartmuseum-values.yml \
  --set ingress.hosts."$CM_ADDR_ESC"={"/"} \
  --set env.secret.BASIC_AUTH_USER=admin \
  --set env.secret.BASIC_AUTH_PASS=admin

```


**CM ADD**

To access chartmuseum from my laptop I use `$CM_ADDR` as seen above however this is not valid in a pipeline build container. From within a container use the *http://[SERVICE_NAME].[NAMESPACE]* format"

```
http://cm-chartmuseum.charts:8080
```
