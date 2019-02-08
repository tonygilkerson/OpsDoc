# Jenkins X Intro

*****************
*****************
*****************
I started this doc as using Gitlab but had issue. I think I can get it to work
but for now I am abandoning this file and will get back to it later
*****************
*****************
*****************
*****************





Based on the book: [Viktor Farcic. The DevOps 2.6 Toolkit: Jenkins X leanpub.com](https://leanpub.com/the-devops-2-6-toolkit)

Commands reference from the book: [02-intro.sh](https://gist.github.com/vfarcic/8cef206b4df0b1bbec3060d1d45c2a80)
--------------------------------------------------------------------------------
# Create Cluster

## Prerequisite Tools

It is up to you to figure out how to install the following tools.  The general approach is to go to the source and follow their instruction. In other cases `brew` will work.

* git (and gitbash)
* kubectl
* Helm
* AWS CLI and eksctl (for  EKS)
* gcloud (for GKE)
* Azure CLI (for AKS)
* jq
* hub

## Jenkins X CLI

For macOS:

```bash
brew tap jenkins-x/jx
brew install jx
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
JX_ENV="jxeMMDD" # change this each as needed

# The --no-default-environments option is needed if we are using GitLab
jx create cluster gke \
    -n $JX_ENV \
    -p $PROJECT \
    -z us-east1-b \
    -m n1-standard-1 \
    --min-num-nodes 2 \
    --max-num-nodes 5 \
    --default-admin-password aegadmin \
    --default-environment-prefix $JX_ENV \
    --no-default-environments \
    --preemptible=true  # if testing

# The browser will open so you can authenticate with google cloud
# Then you will be prompted for a few things, here are my responses:

? Would you like to access Google Cloud Storage / Google Container Registry? Yes
? Would you like to enable Cloud Build, Container Registry & Container Analysis APIs? No
? Would you like to enable Kaniko for building container images No     
? No existing ingress controller found in the kube-system namespace, shall we install one? Yes
? A local Jenkins X versions repository already exists, recreate with latest? Yes
? Domain 34.73.130.212.nip.io

```

## Destroy Cluster

Remove the cluster and everything else.

```bash
GH_USER="tgilkerson"

hub delete -y $GH_USER/environment-$JX_ENV-staging
hub delete -y $GH_USER/environment-$JX_ENV-production

rm -rf ~/.jx/environments/$GH_USER/environment-$JX_ENV-*
rm -f ~/.jx/jenkinsAuth.yaml

gcloud container clusters delete $JX_ENV --zone us-east1-b


# remove unused disks
gcloud compute disks delete \
    $(gcloud compute disks list \
    --filter="-users:*" \
    --format="value(id)")
```

# Quickstart Project

Create a sample project to see how things work.

Command reference from the book: [03-quickstart.sh](https://gist.github.com/vfarcic/a6a6ebc16f75e2cd8902f7695cbce5a5)

## Prerequisites

**Create Cluster**

Create a cluster as we did before, see [Create Cluster](#create-cluster)

**Point jx at GitLab**

When you install Jenkins X it will create git repositories for `Staging` and `Production` using GitHub. To use GitLab for your environments then when you install Jenkins X add the `--no-default-environments` argument on `jx create cluster` or `jx install`

To add a git server for Gitlab and a token try:

```bash
jx create git server gitlab https://gitlab.com -n gitlab
jx create git token -n gitlab $GH_USER
```

Now create the Staging and Production environments using whatever git provider you wish via:

```bash
jx create env staging --git-provider-url=https://gitlab.com
jx create env production --git-provider-url=https://gitlab.com
```

## Create project

```bash
QS_PROJECT="jxqsMMDD" # change this as needed

jx create quickstart -l go -p $QS_PROJECT -b
jx get activities
```

## Cleanup project

[Destroy Cluster](#destroy-cluster) as we did before.  Then cleanup the quickstart app:

```bash
hub delete -y $GH_USER/$QS_PROJECT

# TODO need to verify
cd ..
rm -rf $QS_PROJECT

```
