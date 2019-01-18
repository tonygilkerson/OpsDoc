# Install Jenkins

[go to start](./start-here.md)


**Install**

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

open http://$JENKINS_ADDR/configure (i.e. http://jenkins.127.0.0.1.nip.io) use the `JENKINS_PASS` to logon as `admin`.

```
JENKINS_PASS=$(kubectl -n jenkins get secret jenkins \
-o jsonpath="{.data.jenkins-admin-password}" | base64 --decode)

echo $JENKINS_PASS
```

**Namespace URLs**

To allow communication between the jenkins master and the slave nodes in other namespaces open http://$JENKINS_ADDR/configure (i.e. http://jenkins.127.0.0.1.nip.io/configure) and change the *http://[NAMESPACE]* format to the  *http://[SERVICE_NAME].[NAMESPACE]*

*Cloud->Kubernetes Section:*

| lable | old values | updated value |
| --- | --- | ---  | --- |
| Jenkins URL | http://jenkins:8080 | http://jenkins.jenkins:8080 |
| Jenkins tunnel | jenkins-agent:50000 | jenkins-agent.jenkins:50000 |  


**Tiller**

*Note:* We have Tiller running in the `kube-system` Namespace. However, our agent Pods running in `<app-namespace>` do not have permissions to access it. We could extend the permissions, but that would allow the Pods in that Namespace to gain almost complete control over the whole cluster. Unless your organization is very small, that is often not acceptable. Instead, we’ll deploy another Tiller instance in the `<app-namespace>` Namespace and tie it to the ServiceAccount `build`. That will give the new tiller the same permissions in the `<app-namespace>` Namespace. It’ll be able to do anything in those, but nothing anywhere else (p. 195).


```
helm init --service-account build \
--tiller-namespace <app-namespace>
```

**RBAC**

This next section I am not so sure about.  Docker-for-windows does not seem to use the rbac, so I will have to validate the following in a real cluster.

Add rbac for jenkins builds.

```
kubectl apply -f k8s/ns.yml
```

**Global Pipeline Libraries**

Open "http://jenkins.$ADDR/configure"

Search for *Global Pipeline Libraries* section of the configuration, and click the Add button. Type `my-library` as the Name (it can be anything else) and `master` as the Default version. In our context, the latter defines the branch from which we’ll load the libraries.

Next, we’ll click the *Load implicitly* checkbox. As a result, the libraries will be available automatically to all the pipeline jobs. Otherwise, our jobs would need to have @Library('my-library') instruction. Select *Modern SCM* from the Retrieval method section and select `Git` from *Source Code Management* and then specify the repository from which Jenkins will load the libraries `https://github.com/tgilkerson/jenkins-shared-libraries.git`

Don’t forget to click the Save button to persist the changes!

**Global credentials**

Select *Credentials* and in the *global* store for the *Jenkins* scope click to *Add Credentials*

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


**Upgrade (only as needed)**

To upgrade after modifying values in `helm/jenkins-values.yml` (pg126)

```
 helm upgrade jenkins stable/jenkins \
 --values helm/jenkins-values.yml \
 --set Master.HostName=$HOST \
 --reuse-values

```
