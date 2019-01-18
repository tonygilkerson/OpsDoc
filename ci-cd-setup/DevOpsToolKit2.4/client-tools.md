# Client Setup

[go to start](./start-here.md)


**kubectl** - todo


**Helm**

Currently helm v2 needs tiller, when we get to v3 tiller will go away.  To install tiller:

```
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
