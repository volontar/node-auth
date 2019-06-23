/**
 * Axel Boberg © 2019
 */

module.exports = class ServerError extends Error {
  constructor (err) {
    super(err.message)
    this.name = 'ServerError'
    this.code = err.code
  }
}