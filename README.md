[![main](https://github.com/jahid90/auth-service/workflows/NodeJS%20CI/badge.svg?branch=main)](https://github.com/jahid90/auth-service/actions?query=branch%3Amain) [![pull_requests](https://github.com/jahid90/auth-service/workflows/NodeJS%20CI/badge.svg?event=pull_requests)](https://github.com/jahid90/auth-service/actions?query=event%3Apull_request)

# Auth Service

A service to manage user authentication/authiorisation. Provides the following APIs
  * /register
  * /login
  * /logout
  * /authenticate
  * /authorise
  * /renewToken

On successful login/registration, returns the following shape
```json
{
    "username": "string",
    "email": "string",
    "token": "string"
}
```

The token must be forwarded in an `Authorisation` header for any subsequet request to the `/authorise` / `/authenticate` APIs.)

The token is valid for a day from the registration/login/renewal. The `/renewToken` API can be used to renew it.
