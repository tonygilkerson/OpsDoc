# GitOps

Using helm to achieve a GitOps CI/CD workflow

## CI/CDP Pipeline (Continuous Deployment)

![](./img/CI-CDP.PNG)

* CI results in new docker image and revs the chart version
* New chart points at the new image
* Each environment has a “config” repo with a single chart
* The env chart includes all apps in it’s dependencies list

## CI/CD Pipeline (Continuous Delivery)

![](./img/CI-CD.PNG)

* To install release 1.0.1 to prod just change Chart version and issue PR
* This leaves a good audit trail
* To rollback just revert the PR and the deploy pipeline will install chart version 1.0.0

# Reference

* [Helm Hub](https://hub.helm.sh/)
* [how to create your first helm chart](https://docs.bitnami.com/kubernetes/how-to/create-your-first-helm-chart/)
* [helm.sh](https://helm.sh/)
* [gitops operations by pull request](https://www.weave.works/blog/gitops-operations-by-pull-request)
