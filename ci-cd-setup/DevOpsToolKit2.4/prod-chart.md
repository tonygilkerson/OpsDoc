# Production Chart

[go to start](./start-here.md)


For the base prod environment I will install chartmuseum and jenkins.  Let's review the helm configuration for each:

```
git clone https://github.com/tgilkerson/team1-prod.git
cd team1-prod
ls -l helm
```

Verify the host address is correct in `helm/values.yaml`.

```
go-demo-5:
  ingress:
    host: go-demo-5.127.0.0.1.nip.io
```
Later on, we’ll use Jenkins to install (or upgrade) the Chart, so we should push the changes to GitHub.

```
git add .
git commit -m "Fix the address"
git push
```

All Helm dependencies need to be downloaded to the charts directory before they are installed. We’ll do that through the helm dependency update command. Don’t worry if some of the repositories are not reachable. You might see messages stating that Helm was unable to get an update from `local` or `chartmuseum` repositories.

```
helm dependency update helm

# To confirm
ls -l helm/charts

# The output should look like this
go-demo-5-0.0.1.tgz
```
