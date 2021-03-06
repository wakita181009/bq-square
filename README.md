# BQ-Square
BI Dashboard for BigQuery & Google Cloud SQL

![](https://user-images.githubusercontent.com/16588724/31981804-575470ba-b990-11e7-80b2-54f118ba05aa.png)  



![](https://user-images.githubusercontent.com/16588724/32165395-fe7abab6-bda5-11e7-8032-190ec4214527.png)

### Getting Start
### - Start a app in local environment

* #### Prepare
Prepare for Google App Engine & Python:      
[https://cloud.google.com/appengine/docs/standard/python/quickstart](https://cloud.google.com/appengine/docs/standard/python/quickstart)

* #### Download
```bash
git clone --depth 1 https://github.com/rororo12/bq-square.git
```

* #### Install packages

```bash
npm run setup
```
This will install all npm packages and python packages for you.

* Create keys for JWT  
This project use [JWT](jwt.io) for authentication, so create your own keys here.  

Create keys for local environment.
```bash
npm run create-rsa:dev
```

(Enter the passphrase empty for no passphrase.)

Recommended using different keys between dev and prod environment.

* #### Edit GAE configuration file.
Copy `example_app.yaml` with file name `dev_app.yaml`.    
Add `application: [YOUR_PROJECT_ID]` at the top of `dev_app.yaml`.
```yaml
application: [YOUR_PROJECT_ID]
runtime: python27
api_version: 1
threadsafe: yes
```
(`application` should only be set in local environment.)

Then, Edit the `env_variables`, here is a example:
```yaml
env_variables:
  CLIENT: http://localhost:4200
  GOOGLE_CLIENT_ID: ************.apps.googleusercontent.com
  JWT_ALGORITHM: RS256
  JWT_PUBLIC_KEY: |-
    -----BEGIN PUBLIC KEY-----
    ...
    -----END PUBLIC KEY-----
  JWT_PRIVATE_KEY: |-
    -----BEGIN RSA PRIVATE KEY-----
    ...
    -----END RSA PRIVATE KEY-----

  OWNER: example@example.com
```

##### variables
| variable   | notes       |
|----------|---------------|
| CLIENT | URL set in `Access-Control-Allow-Origin` HTTP header, please specify `http://localhost:4200` in local environment. |
| GOOGLE_CLIENT_ID | Client ID for Google Login. |
| JWT_ALGORITHM | JWT Algorithm, please specify `RS256`. |
| JWT_PUBLIC_KEY | Copy your public key from `rsa/dev_rsa.pub`. |
| JWT_PRIVATE_KEY | Copy your private key from `rsa/dev_rsa`. |
| OWNER | Owner user email in your application, please specify a gmail address. |


* #### Edit Angular environments file.
Copy `bq-square-admin/src/environments/environment.example.ts` as `environment.ts`.
This is a environments file for Angular local environment.
Change the variables:
```typescript
export const environment = {
    production: false,
    project_name: 'YOUR PROJECT NAME',
    API_URL: 'http://localhost:8080',
    PUBLIC_KEY: '-----BEGIN PUBLIC KEY-----\
                ...\
                -----END PUBLIC KEY-----',
    GOOGLE_CLIENT_ID: '************.apps.googleusercontent.com'
};
```

##### variables
| variable   | notes       |
|----------|---------------|
| production | Please specify `false` in local environment. |
| project_name | Project Name display in UI. |
| API_URL | API base URL, please specify `http://localhost:8080` in local environment. This is the GAE `dev_appserver`'s URL. |
| PUBLIC_KEY | Copy your public key from `rsa/dev_rsa.pub`. |
| GOOGLE_CLIENT_ID | Client ID for Google Login. |



* #### Start in local environment.
Start GAE local dev server.
```bash
dev_appserver.py dev_app.yaml
```
And then, open another terminal window, and run:
```bash
cd bq-square-admin; npm start;
```
Go to `http://localhost:4200/` in your browser.



### - Deploy production to GAE

* Create keys for JWT  
Create keys for production environment.
```bash
npm run create-rsa:prod
```
(Enter the passphrase empty for no passphrase.)  

* #### Edit GAE configuration file.
Copy `example_app.yaml` with file name `app.yaml`.        
Then, Edit the `env_variables`, here is a example:
```yaml
env_variables:
  CLIENT: https://******.appspot.com/
  GOOGLE_CLIENT_ID: ************.apps.googleusercontent.com
  JWT_ALGORITHM: RS256
  JWT_PUBLIC_KEY: |-
    -----BEGIN PUBLIC KEY-----
    ...
    -----END PUBLIC KEY-----
  JWT_PRIVATE_KEY: |-
    -----BEGIN RSA PRIVATE KEY-----
    ...
    -----END RSA PRIVATE KEY-----

  OWNER: example@example.com
```

##### variables
| variable   | notes       |
|----------|---------------|
| CLIENT | URL set in `Access-Control-Allow-Origin` HTTP header, please specify your GAE's domain. e.g. https://bq-square.appspot.com/|
| GOOGLE_CLIENT_ID | Client ID for Google Login. |
| JWT_ALGORITHM | JWT Algorithm, please specify `RS256`. |
| JWT_PUBLIC_KEY | Copy your public key from `rsa/prod_rsa.pub`. |
| JWT_PRIVATE_KEY | Copy your private key from `rsa/prod_rsa`. |
| OWNER | Owner user email in your application, please specify a gmail address. |


* #### Edit Angular environments file.
Copy `bq-square-admin/src/environments/environment.example.ts` as `environment.prod.ts`.
This is a environments file for Angular production environment.
Change the variables:
```typescript
export const environment = {
    production: true,
    project_name: 'YOUR PROJECT NAME',
    API_URL: 'http://localhost:8080',
    PUBLIC_KEY: '-----BEGIN PUBLIC KEY-----\
                ...\
                -----END PUBLIC KEY-----',
    GOOGLE_CLIENT_ID: '************.apps.googleusercontent.com'
};
```

##### variables
| variable   | notes       |
|----------|---------------|
| production | Please specify `true` in local environment. |
| project_name | Project Name display in UI. |
| API_URL | API base URL, please specify `''` in production environment. |
| PUBLIC_KEY | Copy your public key from `rsa/prod_rsa.pub`. |
| GOOGLE_CLIENT_ID | Client ID for Google Login. |

* #### Deploy
Run command to deploy project to GAE:
```bash
npm run deploy YOUR_PROJECT_ID
```
Change `YOUR_PROJECT_ID` to your GCP project ID.
