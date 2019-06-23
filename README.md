# node-volontar
A NodeJS library for authorizing a registered client against the Volontär-API

## Installation
`npm install volontar`

## Usage
```javascript
const express = require('express')
const app = express()

const Client = require('volontar')
const myClient = new Client({
    clientId: 'myClientId',
    clientSecret: 'myClientSecret',
    redirectUri: 'https://example.com/callback'
})

app.get('/signin', (req, res, next) => {
	const authorizationUrl = myClient.authorize('user.read')
	res.redirect(authorizationUrl)
})

app.get('/callback', async (req, res, next) => {
	const authorizationCode = req.query.code
    
    try {
    	const { accessToken } = await myClient.token(authorizationCode)
        // Use accessToken
    } catch(err) {
    	// Handle error
    }
})

app.listen(8080)
```

## API

### `new Client(opts)`
Instantiate a new client

- **`opts`** **required** Options as an object

#### Available options
```javascript
{
	clientId: String //required
    clientSecret: String //required,
    redirectUri: String //required
}
```

### `client.authorize(scope [, opts])`
Generate an authorization-url for a scope as a `String` to redirect users to

- **`scope`** **required** Must be a string containing at least one valid scope, multiple scopes are separated by spaces
- **`opts`** **optional** Options as an object

#### Available options
```javascript
{
	state: String //optional, defaults to 'none',
    responseType: String //optional, defaults to 'code'
}
```

### `client.token(authorizationCode)`
Obtain an `access_token` and `refresh_token` from an `authorization_code`.

- **`authorizationCode`** **required** A valid `authorization_code` as a string, normally retrieved from a query-parameter passed to the client's `redirectUri`

#### Response
```javascript
{
	access_token: String, //JWT
    access_token_expires_at: String, //Date
    refresh_token: String,
    refresh_token_expires_at: String //Date
    scope: String //Accepted scopes, space-separated
}
```

### `client.refresh(refreshToken)`
Obtain a new `access_token` and `refresh_token`.

- **`refreshToken`** **required** A valid `refresh_token` as a string, normally obtained from a previous `client.token()` call

#### Response
```javascript
{
	access_token: String, //JWT
    access_token_expires_at: String, //Date
    refresh_token: String,
    refresh_token_expires_at: String //Date
    scope: String //Accepted scopes, space-separated
}
```

## License
MIT