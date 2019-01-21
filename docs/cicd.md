# Introduction

This sections contains the notes taken while reading [The DevOps 2.4 Toolkit](https://leanpub.com/the-devops-2-4-toolkit).  References to page numbers are assumed to be from this book unless otherwise specified.


--------------------------------------------------------------------------------


# Create a cluster

## Docker for Windows

Follow [the docker-for-windows doc](https://docs.docker.com/v17.09/docker-for-windows/install/) to create a cluster on a windows workstation.

## Kubernetes dashboard

The full instructions can be found on the [Kubernetes dashboard readme page](https://github.com/kubernetes/dashboard), in short, run the following:


```bash
kubectl create -f https://raw.githubusercontent.com/kubernetes/dashboard/master/aio/deploy/recommended/kubernetes-dashboard.yaml
```

## Accessing the dashboard UI

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


## Ingress Install

I got the ingress to work fine on docker-for-win by following the [install instructions for mac](https://kubernetes.github.io/ingress-nginx/deploy/), in short, run the following:

```bash
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/mandatory.yaml
kubectl apply -f https://raw.githubusercontent.com/kubernetes/ingress-nginx/master/deploy/provider/cloud-generic.yaml
```

--------------------------------------------------------------------------------

# Define Some Environment Variables

To make live easy let set some environment variables for our shell:

**LB_IP**

Find your loadBalancer IP:

On docker-for-windows this is `127.0.0.1`  for other cluster you can try the following:

```bash
kubectl -n ingress-nginx get svc ingress-nginx -o jsonpath="{.status.loadBalancer.ingress[0].hostname}"
#or
kubectl -n ingress-nginx get svc ingress-nginx -o jsonpath="{.status.loadBalancer.ingress[0].ip}"


# set it
LB_IP="127.0.0.1"

# or make it stick do this
echo "export LB_IP=127.0.0.1" >> ~/.profile
. ~/.profile
```

**ADDR**

```bash
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

Docker Hub user

```bash
DH_USER="tonygilkerson"
echo "export DH_USER=tonygilkerson" >> ~/.profile
. ~/.profile

echo $DH_USER
```

--------------------------------------------------------------------------------

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

--------------------------------------------------------------------------------


# Chart Museum

## Install Chart

Install `stable/chartmuseum` chart with override values (p. 130).

```bash
cd kube-spec

# set chartmuseum host env vars
echo $LB_IP
CM_ADDR="cm.$LB_IP.nip.io"
CM_ADDR_ESC=$(echo $CM_ADDR | sed -e "s@\.@\\\.@g")
echo $CM_ADDR_ESC

# install chart
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

## Add to helm client

Add the chartmuseum repo to the helm client, then install a plugin that will allow us to push charts to the repo via helm CLI.

```bash
helm repo add chartmuseum http://$CM_ADDR --username admin --password admin
helm plugin install https://github.com/chartmuseum/helm-push

# example push
helm push /path/to/chart chartmuseum --username admin --password admin

# we can also do this
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

--------------------------------------------------------------------------------

# Jenkins

## Install

Install `stable/jenkins` chart with override values (p. 130).

```
cd kube-spec

# set jenkins host env vars
echo $LB_IP
JENKINS_ADDR="jenkins.$LB_IP.nip.io"
echo $JENKINS_ADDR

# install jenkins (p. 135 and p. 179)
helm install stable/jenkins \
--name jenkins \
--namespace jenkins \
--values helm/jenkins-values.yml \
--set Master.HostName=$JENKINS_ADDR

# verify
kubectl -n jenkins rollout status deployment jenkins
```

open `http://$JENKINS_ADDR/configure` (i.e. http://jenkins.127.0.0.1.nip.io) use the `JENKINS_PASS` to logon as `admin`.

```
JENKINS_PASS=$(kubectl -n jenkins get secret jenkins \
-o jsonpath="{.data.jenkins-admin-password}" | base64 --decode)

echo $JENKINS_PASS
```

## Namespace URLs

To allow communication between the Jenkins master and the slave nodes in other namespaces open `http://$JENKINS_ADDR/configure` and change the *http://[NAMESPACE]* format to the *http://[SERVICE_NAME].[NAMESPACE]* as shown in the following table.

*Cloud->Kubernetes Section:*

| label | old values | updated value |
|---|---|---|
| Jenkins URL | http://jenkins:8080 | http://jenkins.jenkins:8080 |
| Jenkins tunnel | jenkins-agent:50000 | jenkins-agent.jenkins:50000 |  


## Tiller

*Note:* We have Tiller running in the `kube-system` Namespace. However, our agent Pods running in `<app-namespace>` do not have permissions to access it. We could extend the permissions, but that would allow the pods in that Namespace to gain almost complete control over the whole cluster. Unless your organization is very small, that is often not acceptable. Instead, we’ll deploy another Tiller instance in the `<app-namespace>` namespace and tie it to the `build` ServiceAccount. That will give the new tiller the same permissions in the `<app-namespace>` namespace. It’ll be able to do anything in those, but nothing anywhere else (p. 195).


```bash
helm init --service-account build --tiller-namespace <app-namespace>
```

## RBAC

This next section I am not so sure about.  Docker-for-windows does not seem to use the rbac, so I will have to validate the following in a real cluster.

Add rbac for jenkins builds.

```bash
kubectl apply -f k8s/ns.yml
```

## Global Pipeline Libraries

Open `http://jenkins.$ADDR/configure`

Search for *Global Pipeline Libraries* section of the configuration, and click the Add button. Type `my-library` as the Name (it can be anything else) and `master` as the Default version. In our context, the latter defines the branch from which we’ll load the libraries.

Next, we’ll click the *Load implicitly* checkbox. As a result, the libraries will be available automatically to all the pipeline jobs. Otherwise, our jobs would need to have @Library('my-library') instruction. Select *Modern SCM* from the Retrieval method section and select `Git` from *Source Code Management* and then specify the repository from which Jenkins will load the libraries `https://github.com/tgilkerson/jenkins-shared-libraries.git`

Don’t forget to click the Save button to persist the changes!

## Global credentials

Select *Credentials* and in the *global* store for the *Jenkins* scope, then click to *Add Credentials*

*Docker Hub*
* scope: Global
* Username: tonygilkerson
* Password: *mypwd*
* ID: docker

*Chart Museum*
* scope: Global
* Username: admin
* Password: admin
* ID: chartmuseum


## Upgrade Jenkins

To upgrade after modifying values in `helm/jenkins-values.yml` (pg126)

```bash
 helm upgrade jenkins stable/jenkins \
 --values helm/jenkins-values.yml \
 --set Master.HostName=$HOST \
 --reuse-values

```

--------------------------------------------------------------------------------


# Prepare Apps

## go-demo-5

```bash
cd go-demo-5
kubectl apply -f k8s/build.yml

# do once then commit changes
cat Jenkinsfile.orig \
| sed -e "s@acme.com@$ADDR@g" \
| sed -e "s@vfarcic@$DH_USER@g" \
| tee Jenkinsfile

# do once then commit changes
cat helm/go-demo-5/deployment-orig.yaml \
| sed -e "s@vfarcic@$DH_USER@g" \
| tee helm/go-demo-5/templates/deployment.yaml

git add .
git commit -m "set docker hub user"
git push
```

**Install Tiller for this app**

```bash
helm init --service-account build \
--tiller-namespace go-demo-5-build
```

**Create Jenkins Cloud for this App**

If you look in the Jenkinsfile you will see a reference to `go-demo5-build`.  

```bash
cd go-demo-5
cat Jenkinsfile

...
  agent {
    kubernetes {
      cloud "go-demo-5-build"
      label "go-demo-5-build"
      serviceAccount "build"
      yamlFile "KubernetesPod.yaml"
    }
...

```

To configure the cloud open the Jenkins UI and navigate to the `/configure` page.

Please scroll to the bottom of the page, expand the *Add a new cloud* list, and select *Kubernetes*. A new set of fields will appear. Type `go-demo-5-build` as the name. It matches the cloud entry inside kubernetes block of our pipeline. Next, type `go-demo-5-build` as the Kubernetes Namespace. Just as with the other Kubernetes Cloud that was already defined in our Jenkins instance, the value of the Jenkins URL should be `http://prod-jenkins.prod:8080`, and the Jenkins tunnel should be set to `prod-jenkins-agent.prod:50000`.


**Sandbox**

To test a release:

```
SANDBOX_ADDR="go-demo-5-sandbox.$ADDR"

helm install helm/go-demo-5 -n go-demo-5-sandbox --namespace go-demo-5-sandbox

# when done
helm delete go-demo-5-sandbox --purge
```

TODO add verification steps

--------------------------------------------------------------------------------


## aegjxnode


```bash
cd aegjxnode
kubectl apply -f k8s/build.yml

# edit Jenkinsfile and set correct values for the environment section
...
environment {
  image = "tonygilkerson/aegjxnode"
  project = "aegjxnode-build"
  domain = "127.0.0.1.nip.io"
  cmAddr = "cm-chartmuseum.charts:8080"
}
...

# make it stick
git add .
git commit -m "set docker hub user"
git push
```

**Install Tiller for this app**

```bash
helm init --service-account build \
--tiller-namespace aegjxnode-build
```

**Create Jenkins Cloud for this App**

If you look in the Jenkinsfile you will see a reference to `aegjxnode-build`.  

```bash
cd aegjxnode
cat Jenkinsfile

...
  agent {
    kubernetes {
      cloud "aegjxnode-build"
      label "aegjxnode-build"
      serviceAccount "build"
      yamlFile "KubernetesPod.yaml"
    }
...

```
To configure the cloud open the Jenkins UI and navigate to the `/configure` page.

Please scroll to the bottom of the page, expand the *Add a new cloud* list, and select *Kubernetes*. A new set of fields will appear. Type `aegjxnode-build` as the name. It matches the cloud entry inside kubernetes block of our pipeline. Next, type `aegjxnode-build` as the Kubernetes Namespace. Just as with the other Kubernetes Cloud that was already defined in our Jenkins instance, the value of the Jenkins URL should be `http://prod-jenkins.prod:8080`, and the Jenkins tunnel should be set to `prod-jenkins-agent.prod:50000`.


**Sandbox**

To test a release:

```
TODO - refer to step above once they quit changing

```

TODO add verification steps


--------------------------------------------------------------------------------

# Deploy Environment

One or more apps are owned by a team.  Each team has a production environment such as `team1-pord`.  The chart in the `helm` folder will reference all the apps that are required for this environment in `requirements.yaml`


## Manual Deploy

Clone the environment chart and review the values.

```bash
git clone https://github.com/tgilkerson/team1-prod.git
cd team1-prod
ls -l helm
```

Verify the host address is correct in `helm/values.yaml`.

```
go-demo-5:
  ingress:
    host: go-demo-5.127.0.0.1.nip.io
aegjxnode:
  ingress:
    host: aegjxnode.127.0.0.1.nip.io
```
Later on, we’ll use Jenkins to install (or upgrade) the Chart, so we should push the changes to GitHub.

```bash
git add .
git commit -m "Fix the address"
git push
```

All Helm dependencies need to be downloaded to the charts directory before they are installed. We’ll do that through the helm dependency update command. Don’t worry if some of the repositories are not reachable. You might see messages stating that Helm was unable to get an update from `local` or `chartmuseum` repositories.

First lets do a manually deploy of the `team1-prod` environment.

```bash
cd team1-prod

helm dependency update helm
ls helm/charts/

# To confirm
ls -l helm/charts

# The output should look like this
aegjxnode-0.1.9.tgz
go-demo-5-0.0.1.tgz

# The first time
helm install helm -n team1-prod --namespace team1-prod

# Or do this the -i will install if it does not exist
helm upgrade -i team1-prod helm --namespace team1-prod

# verify
kubectl -n team1-prod rollout status deploy team1-prod-go-demo-5
curl go-demo-5.127.0.0.1.nip.io/demo/hello

# clean up
helm list
helm delete team1-prod --purge

```

**Auto Deploy**

The CI/CD pipeline will automate the manual steps above.

--------------------------------------------------------------------------------

# JeninsX  


JenkinsX was not in the book, it is too new, however I did look into it a bit to take a look at their workflow.

To install on my docker-for-windows cluster:

Taken from [getting started](https://jenkins-x.io/getting-started/install-on-cluster/)

```bash
jx install --provider=kubernetes --on-premise

Jenkins X installation completed successfully
Your admin password is: =rvC9qvz0fq9is^Z6SwY


--------------------------------------------------------------------------------

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
