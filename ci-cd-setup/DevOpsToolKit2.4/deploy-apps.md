# Deploy Apps

[go to start](./start-here.md)


One or more apps are ownd by a team.  Each team has a production environment such as `team1-pord`.  The chart in the `helm` folder will reference all the apps that are required for this environment in `requirements.yaml`


**Manual Deploy**

First lets do a manually deploy of the `team1-prod` environment.

```
cd team1-prod

helm dependency update helm
ls helm/charts/

# The first time
helm install helm -n team1-prod --namespace team1-prod

# Or do this the -i will install if it does not exist
helm upgrade -i team1-prod helm --namespace team1-prod

```

To verify:

```
kubectl -n team1-prod rollout status deploy team1-prod-go-demo-5

curl go-demo-5.127.0.0.1.nip.io/demo/hello
```

Now let's get read to remove it for now.

```
# to remove
helm list
helm delete team1-prod --purge

```
