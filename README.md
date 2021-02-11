[![main](https://github.com/jahid90/auth-service/workflows/NodeJS%20CI/badge.svg?branch=main)](https://github.com/jahid90/auth-service/actions?query=branch%3Amain) [![pull_requests](https://github.com/jahid90/auth-service/workflows/NodeJS%20CI/badge.svg?event=pull_requests)](https://github.com/jahid90/auth-service/actions?query=event%3Apull_request) [![codecov](https://codecov.io/gh/jahid90/auth-service/branch/main/graph/badge.svg)](https://codecov.io/gh/jahid90/auth-service)

# Auth Service

A service to manage user authentication/authiorization. Provides the following APIs
  * /register
  * /login
  * /logout
  * /token/renew
  * /token/authorize

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

Two tokens are generated and sent in the response
```
{
  refreshToken: string
  accessToken: string
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
}
```

2. Client sends a login request to `/login`
```
{
  username: string
  password: string
}
```

Two tokens are generated and sent in the response
```
{
  refreshToken: string
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
Header: 'Authorization: Bearer <refreshToken>'
```

The token is deleted in db
```
{
  token: null
}
```

4. Services send an authorization request at `/token/authorize`
```
Header: 'Authorization: Bearer <accessToken>'
```

`OK` status is sent back in the response

Alt:
If the token is invalid/expired, a `Forbidden` status is sent and it must be renewed

Note: The return codes for invalid and expired tokens should be varied. otherwise, a client cannot distinguish between an invalid and a bad token and might retry renewal again and again, with a bad token.
> Introduce an error code in the error response.

5. Client sends a renewal request at  `/token/renew`
```
Header: 'Authorization: Bearer <refreshToken>'
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

The `accessToken` is short lived and valid for only about a few minutes

2. refreshToken
```
{
  username: string
  email: string
}
```

The `refreshToken` is long lived and only expires (is deleted) when a `/logout` request is received
This should also be regenerated when a user's password is changed. An alternative to this could use the password hash along with a secret key to generate the `refreshToken`. That way, when the password is changed, the `refreshToken` becomes invalid. Currently, password change is not supported.

3. Security

The client will probably store the tokens in `localStorage` or `cookies` from where they could be misused by a malicious script.
> Explore storing the refreshToken in `http only cookies`