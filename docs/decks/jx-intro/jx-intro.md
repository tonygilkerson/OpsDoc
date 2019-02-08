# Introduction

**quote:**
>Armed with `robust data-gathering and statistical analysis` techniques, we have been able to discover significant results while working on the State of DevOps Report. We’ve been able to measure and quantify software delivery performance, its impact on organizational performance, and the various capabilities that contribute to these outcomes. 

.
> The key to successful change is measuring and understanding the right things `with a focus on capabilities`—not on maturity.

.
> The findings from our research program show clearly that the value of adopting DevOps is even larger than we had initially thought, `and the gap between high and low performers continues to grow`.


**Quotes**

* Quotes above from the book: [Forsgren PhD, Nicole. Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339)
* Many ideas presented here are based on the principles in this book.
* Also technical details presented here are based on the book: [Viktor Farcic. The DevOps 2.6 Toolkit: Jenkins X leanpub.com](https://leanpub.com/the-devops-2-6-toolkit) and  [02-intro.sh](https://gist.github.com/vfarcic/8cef206b4df0b1bbec3060d1d45c2a80)

---

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

jx create cluster gke \
    -n $JX_ENV \
    -p $PROJECT \
    -z us-east1-b \
    -m n1-standard-1 \
    --min-num-nodes 2 \
    --max-num-nodes 5 \
    --default-admin-password aegadmin \
    --default-environment-prefix $JX_ENV \
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

--------------------------------------------------------------------------------

# Quickstart Project

Create a sample project to see how things work. Commands for this section have been adapted from the book: [03-quickstart.sh](https://gist.github.com/vfarcic/a6a6ebc16f75e2cd8902f7695cbce5a5)

**Create Cluster**

Create a cluster as we did before, see [Create Cluster](#create-cluster)


## Create project

```bash
QS_PROJECT="jxqsMMDD" # change this as needed

jx create quickstart -l go -p $QS_PROJECT -b
jx get activities
```


--------------------------------------------------------------------------------

# Cleanup

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

## Cleanup project

```bash
hub delete -y $GH_USER/$QS_PROJECT

cd ..
rm -rf $QS_PROJECT

```
