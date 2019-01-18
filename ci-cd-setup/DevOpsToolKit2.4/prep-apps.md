# Prepare Apps

[go to start](./start-here.md)

## go-demo-5

```
cd go-demo-5
kubectl apply -f k8s/build.yml

cat Jenkinsfile.orig \
| sed -e "s@acme.com@$ADDR@g" \
| sed -e "s@vfarcic@$DH_USER@g" \
| tee Jenkinsfile

cat helm/go-demo-5/deployment-orig.yaml \
| sed -e "s@vfarcic@$DH_USER@g" \
| tee helm/go-demo-5/templates/deployment.yaml

git add .
git commit -m "set docker hub user"
git push
```

Install Tiller for `go-demo-5`

```
helm init --service-account build \
--tiller-namespace go-demo-5-build
```

**Create Jenkins Cloud for this App**

If you look in the Jenkinsfile you will see a reference to `go-demo5-build`.  

```
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

Please scroll to the bottom of the page, expand the *Add a new cloud* list, and select *Kubernetes*. A new set of fields will appear. Type *go-demo-5-build* as the name. It matches the cloud entry inside kubernetes block of our pipeline. Next, type *go-demo-5-build* as the Kubernetes Namespace. Just as with the other Kubernetes Cloud that was already defined in our Jenkins instance, the value of the Jenkins URL should be *http://prod-jenkins.prod:8080*, and the Jenkins tunnel should be set to *prod-jenkins-agent.prod:50000*.


**Sandbox**

To test a release:

```

SANDBOX_ADDR="go-demo-5-sandbox.$ADDR"

helm install helm/go-demo-5 -n go-demo-5-sandbox --namespace go-demo-5-sandbox


# when done
 helm delete go-demo-5-sandbox --purge

```

TODO add verification steps


## aegjxnode

```
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

# Make it stick

git add .
git commit -m "set docker hub user"
git push
```

Install Tiller for `aegjxnode-build`

```
helm init --service-account build \
--tiller-namespace aegjxnode-build
```

**Create Jenkins Cloud for this App**

If you look in the Jenkinsfile you will see a reference to `aegjxnode-build`.  

```
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

Please scroll to the bottom of the page, expand the *Add a new cloud* list, and select *Kubernetes*. A new set of fields will appear. Type *aegjxnode-build* as the name. It matches the cloud entry inside kubernetes block of our pipeline. Next, type *aegjxnode-build* as the Kubernetes Namespace. Just as with the other Kubernetes Cloud that was already defined in our Jenkins instance, the value of the Jenkins URL should be *http://prod-jenkins.prod:8080*, and the Jenkins tunnel should be set to *prod-jenkins-agent.prod:50000*.


**Sandbox**

To test a release:

```
TODO - refer to step above once they quit changing

```

TODO add verification steps
