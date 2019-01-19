# Create a cluster

## Doc4Win

Follow [the docker-for-windows doc](https://docs.docker.com/v17.09/docker-for-windows/install/) to create a cluster on a windows workstation.

## Kubernetes dashboard

The full instructions can be found on the [Kubernetes dashboard readme page](https://github.com/kubernetes/dashboard), in short, run the following:


```bash
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended/kubernetes-dashboard.yaml
```

## Acessing the dashboard UI

Run `kubectl proxy` then open `http://localhost:8001/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/` in your browser.

To log onto the UI you will need a token. Do the following to get a valid token:

```bash
SECRET_NAME=$(kubectl -n kube-system \
get serviceAccount kubernetes-dashboard \
-o  jsonpath='{.secrets[0].name}')

kubectl -n kube-system describe secrets/$SECRET_NAME
# copy token from the output and use it to log onto the dashboard
```

For more informatoin on how to configure access see the following:

* [Accessing the dashboard UI](https://kubernetes.io/docs/tasks/access-application-cluster/web-ui-dashboard/#accessing-the-dashboard-ui)
* [Configure Service Account](https://kubernetes.io/docs/tasks/configure-pod-container/configure-service-account/)


## Ingress

I got the ingress to work fine on docker-for-win by following the [install instructions for mac](https://kubernetes.github.io/ingress-nginx/deploy/), in short, run the following:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/cloud-generic.yaml
```
