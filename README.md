# Unity Web Platform

A CLI tool for starting a new service UI for cloud services at Unity.

> Although this tool is publicly available in order to generate a new service repository you will need to get service credentials from the Developer Dashboard team. You can contact them on Slack: Unity/#devs-servicedashboard

# Getting started for new cloud service repos
### Prerequisites
* To see you component in the dashboard ensure you have unityweb-developer-dashboard configured to run locally.
* To install packages from Artifactory ensure you're on a Unity VPN or internal network.
* Obtain new service credentails from the dashboard team #devs-servicedashboard

### Create a git repository
* Create an empty repo in the GitLab cloudservices namespace https://gitlab.internal.unity3d.com/cloudservices
* Clone it locally, e.g., `git clone git@gitlab.internal.unity3d.com:cloudservices/new-service.git c:/projects/playground/new-service`
* Point to your new repo `cd c:/projects/new-service`

### Use the CLI to populate your repo
* Install the CLI globally `npm i -g @testweb/cli`
* Run `create-service`

### Commit initial files and deploy
* git add -A
* git commit -m "first"
* npx deploy

### Install your service on the dashboard
* cd into unityweb-developer-dashboard
* npm i @testweb/new-service
* npm run build
* npm run start-local
