[![main](https://github.com/jahid90/auth-service/workflows/NodeJS%20CI/badge.svg?branch=main)](https://github.com/jahid90/auth-service/actions?query=branch%3Amain) [![pull_requests](https://github.com/jahid90/auth-service/workflows/NodeJS%20CI/badge.svg?event=pull_requests)](https://github.com/jahid90/auth-service/actions?query=event%3Apull_request) [![codecov](https://codecov.io/gh/jahid90/auth-service/branch/main/graph/badge.svg)](https://codecov.io/gh/jahid90/auth-service)

# Auth Service

A service to manage user authentication/authiorization. Provides the following APIs
  * /register
  * /login
  * /logout
  * /renew

### How it works

1. Client sends a registration request to `/register`
```
{
  username: string
  email: string
  password: string
  confirmPassword: string
  roles?: [string]
}
```

The following object is stored in db
```
{
  username: string
  email: string
  password: string
  roles: [string],
  refreshToken as token: string
  tokenVersion: number
}
```

2. Client sends a login request to `/login`
```
{
  username: string
  password: string
}
```

Refresh token is generated and set as an `http only` cookie on the response. Access token is generated and sent in the response
```
Cookie: 'token=refreshToken'
```
```
{
  accessToken: string
}
```

The db is updated with the refreshToken
```
{
  refreshToken as token: string
}
```

3. Client sends a logout request to `/logout`
```
Header: 'Authorization: Bearer <accessToken>'
```

The token version is incremented
```
{
  tokenVersion: inc
}
```

4. Client sends a renewal request at `/renew`
```
Cookie: 'token=refreshToken'
```

A new `accessToken` is generated and sent back in the response
```
{
  accessToken: string
}
```

### Notes

The tokens encode the following information

1. accessToken
```
{
  username: string
  email: string
  roles: [string?]
}
```

The `accessToken` is short lived and valid for only about a few minutes. Client will periodically need to renew it.

2. refreshToken
```
{
  username: string
  tokenVersion: string
}
```

The `refreshToken` is long lived. Though it becomes invalid when a `/logout` request is received

This could lead to an issue when a user resets their password and the refresh token previously issued is still valid. In that case, we should increment the tokenVersion in the db to invalidate all existing refresh tokens. Passwrod change is not currently supported.

3. Security

* If clients store the access token in `localStorage` or `cookies`, they could be misused by a malicious script.
> Clients should store the token in a closure.

* The refresh token is not susceptible to this as it is stored as a `http only` cookie and cannot be accessed by scripts.

### Features to consider for future

1. Adding and removing roles to/from users
2. Changing user's password
