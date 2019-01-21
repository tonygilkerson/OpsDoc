# OpsDoc
My ops doc.  

This repo uses [mkdocs](https://www.mkdocs.org/) ([help](https://mkdocs.readthedocs.io/en/0.10/)) and [github pages](https://help.github.com/articles/configuring-a-publishing-source-for-github-pages/) to host content at:


https://tonygilkerson.github.io/OpsDoc/

**Develop:**

```
cd OpsDoc
mkdocs serve
# Edit content and review changes here:
open http://127.0.0.1:8000/
```


**Publish:**

```
cd OpsDoc
mkdocs build --clean
mkdocs gh-deploy
open https://tonygilkerson.github.io/OpsDoc/
```
