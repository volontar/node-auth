/**
 * Axel Boberg © 2019
 */

const ServerError = require('./lib/error/ServerError')

const uri = require('./lib/uri')
const defaults = require('./lib/defaults')

const request = require('request')

const DEFAULT_OPTS = {
  'host': 'https://accounts.volontar.app',
  'authorizationEndpoint': '/oauth/authorize',
  'tokenEndpoint': '/oauth/token'
}

/**
 * Make a request to the token-endpoint
 * @param { Object } body
 * @returns { Promise<Object> } 
 */
function tokenRequest (body, opts) {

  /*
    Setup default body, which
    should always authenticate
    the client as per spec
  */
  const _body = defaults(body, {
    client_id: opts.clientId,
    client_secret: opts.clientSecret
  })

  /*
    Setup default request-options
  */
  const _opts = {
    uri: opts.host + opts.tokenEndpoint,
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    body: uri.serialize(_body)
  }

  return new Promise((resolve, reject) => {
    request(_opts, (err, res) => {
      if (err) {
        return reject(err)
      }

      const body = JSON.parse(res.body)

      /*
        If a server-side error occured,
        throw it as a ServerError for
        easier handling
       */
      if (res.statusCode !== 200) {
        return reject(
          new ServerError(body)
        )
      }

      return resolve(body)
    })
  })
}

/**
 * An OAuth2 client for authentication
 * against the Volontar-API
 * @param { Object } opts 
 */
function Client (opts = {}) {
  const _opts = defaults(opts, DEFAULT_OPTS)

  if (!_opts.clientId) throw new ReferenceError(`Missing required parameter 'clientId'`)
  if (!_opts.redirectUri) throw new ReferenceError(`Missing required parameter 'redirectUri'`)
  if (!_opts.clientSecret) throw new ReferenceError(`Missing required parameter 'clientSecret'`)

  /**
   * Generate a url for authorization
   * @param { String } scope A space-separated string of the requested scopes
   * @param { Object? } opts
   * @returns { String }
   */
  this.authorize = function (scope, opts) {
    if (!scope) throw new TypeError('Scope cannot be undefined')

    const authzOpts = defaults(opts || {}, {
      state: 'none',
      responseType: 'code'
    })

    const baseUrl = `${_opts.host}${_opts.authorizationEndpoint}`
    const params = {
      client_id: _opts.clientId,
      redirect_uri: _opts.redirectUri,
      response_type: authzOpts.responseType,
      scope: scope,
      state: authzOpts.state
    }

    return uri.appendQueryParameters(baseUrl, params)
  }

  /**
   * Get an access-token
   * @param { String } authorizationCode A valid authorization-code
   * @returns { Promise<Object> }
   */
  this.token = function (authorizationCode) {
    const body = {
      code: authorizationCode,
      grant_type: 'authorization_code'
    }

    return tokenRequest(body, _opts)
  }

  /**
   * Refresh an access-token
   * @param { String } refreshToken A valid refresh-token
   * @returns { Promise<Object> }
   */
  this.refresh = function (refreshToken) {
    const body = {
      refresh_token: refreshToken,
      grant_type: 'refresh_token'
    }

    return tokenRequest(body, _opts)
  }
}

module.exports = Client