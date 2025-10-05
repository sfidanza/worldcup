# How to deploy this blueprint

These are simple tips to deploy the helm chart manually through helm. In practice, deployment is automated with ArgoCD, but it can be useful to start with basics locally.

## Prepare environment

Secrets needs to be deployed in the targeted environment (they should be created from a vault but this is simpler for now). Copy the `secret.*.yaml` files from <worldcup/secrets.sample/> and manually update the secret values. Deploy these secrets before the application.

    kubectl apply -f secrets.backend.yaml
    kubectl apply -f secrets.db-user.yaml
    kubectl apply -f secrets.worldcup-admin.yaml

## Deploy application

Let's say the environment name is TST, represented by the `tst` namespace and with the chart values `tst.values.yaml`. Then deploy/undeploy on TST through:

    helm install worldcup worldcup/ --values tst.values.yaml --namespace tst
    helm uninstall worldcup --namespace tst

If the application is controlled by ArgoCD, then it can still be undeployed with:

    kubectl -n tst delete all -l app.kubernetes.io/instance=worldcup-tst
