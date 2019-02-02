# Introduction

Notes taken form [Viktor Farcic. The DevOps 2.6 Toolkit: Jenkins X leanpub.com](https://leanpub.com/the-devops-2-6-toolkit)

Commands from the book [02-intro.sh](https://gist.github.com/vfarcic/8cef206b4df0b1bbec3060d1d45c2a80)

Install tools

Manually install prerequisites (Kindle Location 99):
* git (and gitbash)
* kubectl
* Helm
* AWS CLI and eksctl (for  EKS)
* gcloud (for GKE)
* Azure CLI (for AKS)
* jq
* hub
* jenkins-x

GitBash tweek

To get the `gcloud` to work I had to add python to the path

```bash
cd
echo "export PATH=$PATH:/c/Python27" >> .bashrc
# open a new shell
```

Create cluster

```bash
# If GKE
PROJECT="aeg-jenkinsx"
JX_ENV="jx3" # this changes each time

# If GKE (note winpty is needed for gitbash)
winpty jx create cluster gke \
    -n $JX_ENV \
    -p $PROJECT \
    -z us-east1-b \
    -m n1-standard-1 \
    --min-num-nodes 2 \
    --max-num-nodes 5 \
    --default-admin-password admin \
    --default-environment-prefix $JX_ENV
```

Cleanup, remove the cluster(and everything else)

```bash

GH_USER="tonygilkerson"

hub delete -y \
 $GH_USER/environment-$JX_ENV-staging
hub delete -y \
 $GH_USER/environment-$JX_ENV-production

rm -rf ~/.jx/environments/$GH_USER/environment-$JX_ENV-*
rm -f ~/.jx/jenkinsAuth.yaml

# for gcp
# Note I could not get this to work in gitbash so I used powershell
# and did the substitution for $JX_ENV manually

#TODO try this again in gitbash now that I fixed the python path
gcloud container clusters delete jx2 --zone us-east1-b


# This worked in my wsl shell
gcloud compute disks delete \
    $(gcloud compute disks list \
    --filter="-users:*" \
    --format="value(id)")

```
