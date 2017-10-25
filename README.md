# BQ-Square
BI Dashboard for BigQuery & Google Cloud SQL

### Getting Start
#### - Start a app in local environment

* #### Prepare

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

* Edit GAE configuration file.
Copy `example_app.yaml` with file name `dev_app.yaml`.  
Then, Edit the `env_variables`, here is a example:
```yaml
env_variables:
  CLIENT: http://localhost:4200
  GOOGLE_CLIENT_ID: ************.apps.googleusercontent.com
  JWT_ALGORITHM: RS256
  JWT_PUBLIC_KEY: |-
    -----BEGIN PUBLIC KEY-----
    MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEA3tem5AUMDVq0yhOXPTJM
    XlVbP+d7q7bSZyRawkgX3En7mSReUROtEdrod07qsFybdzrcAnb0O4SmNiKE+n85
    8UQENbTgoeIaG4gpbuHbbOV37ozTCdMbfckvq6Zf/iL+kSgGO3n5+IHijTlb/jld
    C0BfoExgm1SIfugqdVf/4ATvSINgC+WswaEW3OAAe6yUvpFYS8v/wMLgRNlAvtIK
    edIB9fSghOTCUwtQ0l1T0ZoQkDvS6Ts6KOGpZXPbpVSly3IX1VPyBJDs302wXV9N
    p2W266qdwXOz+CJO6MefzXpnBHBXOEUvibxKY2i/K/oa8Vun2DQi8ustXGPym39I
    NjsSszbHO9tnD1l4W8gbzydSe37uSydQ6Sx8mW+faHst5x4PAWWCXCxgMM2vdOHC
    RejWEQGf0rYz56rIa/rIWM9sdnLjXO3mGhFKtAH9PZoX25Zuz/N0dSX+rAn7AM/s
    gVQthJ2kUNVjZAb98K1ZCmi7qOlTy/5zYMnIvo5Vu1bvhr87qq3A5KLXq9EbSnAC
    rEga144tnxrlD2ocTrpevPnIKAhpfoV3DnNXeOo0ZYrZsulg0MQ9oxA2JLOgRI0E
    ypcjstFbDwWBAA14BLHc6VAUskQYBgPwcOzvYf/5qYXeMbExmxfeVEbFxb6RyHWa
    ifBM/hs+Q3IUU4Yq0Fm5f8sCAwEAAQ==
    -----END PUBLIC KEY-----
  JWT_PRIVATE_KEY: YOUR_PRIVATE_KEY
  OWNER: example@example.com
```

* #### Start in local environment.
Start GAE local dev server.
```bash
dev_appserver.py dev_app.yaml
```
And then, open another terminal window, and run:
```bash
cd bq-square-admin; npm start;
```
