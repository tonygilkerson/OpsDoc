# gcloud cli

```bash
# first time setups
# run again to add a new account
gcloud init

# list accounts and see which is active
gcloud config configurations list

# list the config
gcloud config list



```

# kubectl cli

[cheatsheet](https://kubernetes.io/docs/reference/kubectl/cheatsheet/)

```bash

# list of contexts
kubectl config view --output='json' | jq .users[].name


# show current context
kubectl config current-context

```

# Kubernetes

## Docker Desktop Dashboard

**Install dashboard**

```bash
#install
kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/v1.10.1/src/deploy/recommended/kubernetes-dashboard.yaml

#open
kubectl proxy
open http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/
```

**logon**

```bash
DASH_SECRET=$(kubectl get serviceAccounts -o jsonpath="{.items[0].secrets[0].name}")

# cut/past the token shown form this command
kubectl describe secrets/$DASH_SECRET
```

**charts and graphs**

This stuff is optional but will make charts and graphs show up in the dashboard.
```bash  
kubectl create -f https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/influxdb.yaml
kubectl create -f https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/heapster.yaml
kubectl create -f https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/grafana.yaml
```

**Heapster workaround:**

I got an error where heapster could not connect so I had to edit the `--source` value for the deployment as shown below

```
{
  "kind": "Deployment",
  "apiVersion": "extensions/v1beta1",
  "metadata": {
    "name": "heapster",
    "namespace": "kube-system",
    ...,
        "spec": {
        "containers": [
          {
            ...
            "command": [
              "/heapster",
====>         "--source=kubernetes:https://kubernetes.default:443?useServiceAccount=true&kubeletHttps=true&kubeletPort=10250&insecure=true",
              "--sink=influxdb:http://monitoring-influxdb.kube-system.svc:8086"
            ],
            ...
    ...
 }
```

For more information see:

Setup:

* https://github.com/kubernetes/dashboard
* [this blog post](https://www.hanselman.com/blog/HowToSetUpKubernetesOnWindows10WithDockerForWindowsAndRunASPNETCore.aspx)

Configure access:

* https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#accessing-the-dashboard-ui
* https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/  

## Ingress

To install ingress controller on docker-desktop, see The DevOps 2.5 Toolkit location 1532 and [vfarcic/docker-monitor.sh](https://gist.github.com/vfarcic/4d9ab04058cf00b9dd0faac11bda8f13) for more commands.

```bash
kubectl apply -f \
    https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml

kubectl apply -f \
    https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/cloud-generic.yaml
```

For eample, to  expose **node-red** to the ingress controller just created, set `ingress.enabled` and the `ingress.hosts`.  **Note:** For docker-desktop the `LB_IP` needs to be the ip of your laptop.  If you were in the cloud this would just be your cluster IP.

```bash
#################
# Install
#################

ping -a $(hostname). # to display your IP address
LB_IP=10.0.0.23.     # this can change!

RED_ADDR=red.$LB_IP.nip.io

# Install node-rd
helm install --name aeg-red-release \
  --set config.timezone="America/New_York" \
  --set ingress.enabled="true" \
  --set ingress.hosts={$RED_ADDR} \
    stable/node-red

# To open node-red in your browser
open http://red.10.0.0.23.nip.io/

#################
# cleanup
#################

helm delete aeg-red-release --purge

```


## Kubernetes API Doc

* [Kubernetes API](https://v1-9.docs.kubernetes.io/docs/reference/generated/kubernetes-api/v1.9/#-strong-api-overview-strong-)


# Bash scripting cheatsheet
* [Dev Hints](https://devhints.io/bash)


# The DevOps 2.3 Toolkit: Kubernetes

* [02-minikube.sh](https://gist.github.com/vfarcic/77ca05f4d16125b5a5a5dc30a1ade7fc)
* [03-pod.hs](https://gist.github.com/vfarcic/d860631d0dd3158c32740e9260c7add0)
* [04-rs.sh](https://gist.github.com/vfarcic/f6588da3d1c8a82100a81709295d4a93)
* [05-svc.sh](https://gist.github.com/vfarcic/ae2527a1e960ec3fea19adb00aab6fd7)
* [06-deploy.sh](https://gist.github.com/vfarcic/677a0d688f65ceb01e31e33db59a4400)
* [07-ingress.sh](https://gist.github.com/vfarcic/54ef6592bce747ff2d1b089834fc755b)
* [08-volume.sh](https://gist.github.com/vfarcic/5acafb64c0124a1965f6d371dd0dedd1)
* [09-config-map.sh](https://gist.github.com/vfarcic/717f8418982cc5ec1c755fcf7d4255dd)
* [10-secret.sh](https://gist.github.com/vfarcic/37b3ef7afeaf9237aeb2b9a8065b10c3)
* [11-ns.sh](https://gist.github.com/vfarcic/6e0a03df4c64a9248fbb68673c1ab719)
* [12-auth.sh](https://gist.github.com/vfarcic/f2c4a72a1e010f1237eea7283a9a0c11)
* [13-resource.sh](https://gist.github.com/vfarcic/cc8c44e1e84446dccde3d377c131a5cd)
* [14-aws.sh](https://gist.github.com/vfarcic/04af9efcd1c972e8199fc014b030b134)
* [15-pv.sh](https://gist.github.com/vfarcic/41c86eb385dfc5c881d910c5e98596f2)
