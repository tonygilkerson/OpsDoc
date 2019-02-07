# Accelerate Deck

This section contains the notes taken while watching the  [Accelerate your CI/CD on Kubernetes with Jenkins X (James Strachan)](https://www.youtube.com/watch?v=u4kyipOT44A)

James Strachan recommends this book and says Jenkins X tries to adopt many of the principles in this book: [Accelerate: The Science of Lean Software and DevOps: Building and Scaling High Performing Technology Organizations](https://www.amazon.com/Accelerate-Software-Performing-Technology-Organizations/dp/1942788339)

--------------------------------------------------------------------------------

# 7 Capabilities of Jenkins X

Taken from the book here are 7 practices of high performing teams. Jenkins X uses open source software to automate these practices.   

**1. Use version control for all artifacts**

* source code and code (IaC)
* when things go bad we can revert
* provides an audit trail

**2. Use trunk-based development**

* developers collaborate on code in a single branch called 'trunk'. They therefore avoid merge hell, do not break the build, and live happily ever after.
* the use of long-lived featured branches is associated with low performing teams
* trunk-based development is associated with high performing teams

**6. Use loosely coupled architecture**

* High performing teams use the cloud well  to deliver highly available, multi-az deployments that are self healing and auto scaling.
* microservices allows teams to move quicker; many *independent* teams can move quicker than one large team.
* Kubernetes is ideal for running microservices.  
    * runs everywhere while providing a consistent abstraction across all cloud providers
    * a single way to package applications and run them in any cloud (or on premise)!
    * multi cloud is now achievable by mortals
* challenge: teams now need to figure out how to do many things well; microservices, cloud, Kubernetes, CI/CD, etc.. this is where Jenkins X comes in

**3. Implement continuous integration (CI)**

**4. Implement continuous delivery (CD)**

**5. Automate your deployment process**

**7. Architect for empowered teams**

--------------------------------------------------------------------------------

# How does Jenkins X help?

**Automates the setup of your tools +environments**

* Jenkins, helm, skaffold, nexus, monocular

**Automates the CI/CD for your application on Kubernetes**

* Docker images
* Helm charts
* Jenkins Pipelines

**Uses GitOps to manage promotion between environments**

* Test -> Staging -> Production
* use git as the source of truth for each environment;
* e.g. a prod repo will list all the microservices, the version of each and any environment specific configuration running in the prod environment
* could use `kubectl` to promote code to various environments but no one can see what you are doing, reverting back is not as easy and it is dangerous especially when you are trying to move fast.
* to promote between environments we use a PR. The team can code review/approve coding as well as configuration changes.
* An approved PR tells the team what is in prod and when it was installed.  And, if things go bad, just revert the PR to roll back.


**Lots of feedback**

* E.g. commenting on issues as they hit Staging + Production

--------------------------------------------------------------------------------

# Installing Jenkins X

**Install the jx binary**

```
https://jenkins-x.io/geting-started/install/
```

**Createa new k8scluster on GKE**

```bash
$ jx create cluster gke
```
As of now, supported clouds:

* create cluster aks Create a new Kubernetes cluster on AKS: Runs on Azure
* create cluster aws Create a new Kubernetes cluster on AWS with kops
* create cluster eks Create a new Kubernetes cluster on AWS using EKS
* create cluster gke Create a new Kubernetes cluster on GKE: Runs on Google Cloud
* create cluster iks Create a new kubernetes cluster on IBM Cloud Kubernetes Services
* create cluster minikube Create a new Kubernetes cluster with Minikube: Runs locally
* create cluster minishift Create a new OpenShift cluster with Minishift: Runs locally
* create cluster oke Create a new Kubernetes cluster on OKE: Runs on Oracle Cloud


**Install Jenkins X on an existing cluster**

```bash
$ jx install --provider=...
```

--------------------------------------------------------------------------------

# What does that give me?

**Each team gets their own:**

* Development tools environment
    * Jenkins master
    * Elastic pool of Kubernetes build pods
    * Nexus + Monocular (helm application store)
* Staging environment
* Production environment

**Also...**

* This empowers each team to work independently and release when they want
* Can configure more environments but out-of-the-box you get one staging and one production environment.
* A new version is released for each PR merged to 'trunk'
* Each release is automatically promoted to staging but requires a manual step to promote to production by default.  This can be changed for 100% automation.


--------------------------------------------------------------------------------

# Importing and Creating Projects

**Import existing**

If you already have some code.

```bash
$ jx import
```

**Create new applications from quickstarts**

This is preferred so you know everything is setup correctly. The import works but you never know.

```bash
$ jx create quickstart
```
* there are a bunch of quick starts they are open source so you can check them out [here](https://github.com/jenkins-x-quickstarts)
* There is one for most of the popular development platforms
* You can create a custom template if you like



**Create new Spring Boot applications**

```bash
$ jx create spring
```

# What you get from a quickstart

`jx create` will...

* Create a project repo GitHub
* Create a dockerfile
* Create a helm chart
* Create environment repos in GitHub (staging and production)
* Setup all the webhooks in GitHub
* Setup all your CI/CD (Jenkins pipelines)
