# Create Cluster

Notes taken form [Viktor Farcic. The DevOps 2.6 Toolkit: Jenkins X leanpub.com](https://leanpub.com/the-devops-2-6-toolkit)

Commands for this section: [02-intro.sh](https://gist.github.com/vfarcic/8cef206b4df0b1bbec3060d1d45c2a80)

## Install prerequisites tools

See "Manually install prerequisites (Kindle Location 99)" for more detail:

* git (and gitbash)
* kubectl
* Helm
* AWS CLI and eksctl (for  EKS)
* gcloud (for GKE)
* Azure CLI (for AKS)
* jq
* hub
* jenkins-x


**GitBash tweak**

To get the `gcloud` command to work in gitbash I had to add python to the path.  If this does not work you can try just running the command in PowerShell.

```bash
cd
echo "export PATH=$PATH:/c/Python27" >> .bashrc
# open a new shell
```

## Create Cluster with jx

**Disable Nexus**

I will not need Nexus most of the time so just turn it off.

```bash
echo "nexus:
  enabled: false" | tee myvalues.yaml
```
**Create the cluster**

```bash
# If GKE
PROJECT="aeg-jenkinsx"
JX_ENV="jxeMMDD" # this changes each time

# If GKE (note winpty is needed for gitbash)
winpty jx create cluster gke \
    -n $JX_ENV \
    -p $PROJECT \
    -z us-east1-b \
    -m n1-standard-1 \
    --min-num-nodes 2 \
    --max-num-nodes 5 \
    --default-admin-password aegadmin \
    --default-environment-prefix $JX_ENV \
    --preemptible=true # why not I am just testing
```

## Destroy Cluster

Remove the cluster and everything else.

```bash
GH_USER="tonygilkerson"

hub delete -y $GH_USER/environment-$JX_ENV-staging
hub delete -y $GH_USER/environment-$JX_ENV-production

rm -rf ~/.jx/environments/$GH_USER/environment-$JX_ENV-*
rm -f ~/.jx/jenkinsAuth.yaml

# for gcp
# Note for gitbash I needed to use winpty and add '.cmd' to the end of gcloud
winpty gcloud.cmd container clusters delete $JX_ENV --zone us-east1-b


# remove unused disks
winpty gcloud.cmd compute disks delete \
    $(gcloud compute disks list \
    --filter="-users:*" \
    --format="value(id)")
```


# Exploring Quickstart Projects

Create a sample project to see how things work.

Commands for this section: [03-quickstart.sh](https://gist.github.com/vfarcic/a6a6ebc16f75e2cd8902f7695cbce5a5)

**Prerequisites**

Create a cluster as we did before, see [Create Cluster](#create-cluster)

## Create project

```bash
QS_PROJECT="jxqsMMDD" # change this as needed

winpty jx create quickstart -l go -p $QS_PROJECT -b
```

## Cleanup project

[Destroy Cluster](#destroy-cluster) as we did before.  Then cleanup the quickstart app:

```bash
hub delete -y $GH_USER/$QS_PROJECT

# TODO need to verify
cd ..
rm -rf $QS_PROJECT

```
