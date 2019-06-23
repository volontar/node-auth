const Client = require('../index')
const client = new Client({
  clientId: 'myClientId',
  clientSecret: 'myClientSecret',
  redirectUri: 'myRedirectUri',

  host: 'host',
  authorizationEndpoint: '/oauth/authorize',
  tokenEndpoint: '/oauth/token'
})

test('generate an authorization-code', () => {
  expect(client.authorize('scope')).toBe('host/oauth/authorize?client_id=myClientId&redirect_uri=myRedirectUri&response_type=code&scope=scope&state=none')
})