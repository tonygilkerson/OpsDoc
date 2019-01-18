# Create a cluster

[go to start](./start-here.md)


## Doc4Win

**Install Cluster**

Follow [the docker-for-windows doc](https://docs.docker.com/v17.09/docker-for-windows/install/)

**Kubernetes dashboard**

*Install*
  * Full instructions here: https://github.com/kubernetes/dashboard

```
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended/kubernetes-dashboard.yaml
```

*accessing the ui*

open `http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/`

*configure access*
  * https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#accessing-the-dashboard-ui
  * https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/


```
SECRET_NAME=$(kubectl -n kube-system \
get serviceAccount kubernetes-dashboard \
-o  jsonpath='{.secrets[0].name}')

kubectl -n kube-system describe secrets/$SECRET_NAME
# copy token from the output and use it to log onto the dashboard
```


**Ingress**

*install*

I got the ingress to work fine on docker-for-win by following the install instructions for mac located here https://kubernetes.github.io/ingress-nginx/deploy/

```
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/cloud-generic.yaml
```
