# Client Tools

## kubectl

Follow the [Install and Setup kubectl](https://kubernetes.io/docs/tasks/tools/install-kubectl/) instructions on the official kubernetes site.

## helm

Currently helm v2 needs tiller, when we get to v3 tiller will go away.  To install tiller:

```bash
cd k8s-spec

# Create service account
kubectl create \
  -f helm/tiller-rbac.yml

# Install server side tiller
helm init --service-account tiller

# verify
kubectl -n kube-system \
  rollout status deploy tiller-deploy

```

# Chart Museum

Install `stable/chartmuseum` chart with override values (p. 130).

```bash
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

```bash
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

More useful command can be found at [vfarcic gist](https://gist.github.com/vfarcic/e0657623045b43259fe258a146f05e1a)

## Upgrade

To upgrade after modifying values.

```bash
 helm upgrade cm stable/chartmuseum \
  --values helm/chartmuseum-values.yml \
  --set ingress.hosts."$CM_ADDR_ESC"={"/"} \
  --set env.secret.BASIC_AUTH_USER=admin \
  --set env.secret.BASIC_AUTH_PASS=admin

```

## Accessing the UI

To access chartmuseum from my laptop I use `$CM_ADDR` as seen above however this is not valid in a pipeline build container. From within a container use the *http://[SERVICE_NAME].[NAMESPACE]* format as seen here:

```bash
# from within the cluster, pod to pod
http://cm-chartmuseum.charts:8080

# from my browser
http://cm.127.0.0.1.nip.io
```
