const lab = exports.lab = require('lab').script()
const { before, describe, it } = lab
const { expect } = require('code')
const Server = require('../../')
const generateToken = require('./generate_token')
const Config = require('config')

describe('IndexController', () => {
    describe('GET /authentication/', () => {
        describe('if the user does not present any token', () => {
            let response

            before(async () => {
                response = await Server.inject({
                    method: 'GET',
                    url: '/authentication/'
                })
            })

            it('should response with 200 OK', () => {
                expect(response.statusCode).equals(200)
            })

            it('should display a link to the login form', () => {
                expect(response.result).contains('/authentication/login')
            })
        })

        describe('if the user presents a valid token', () => {
            let response

            before(async () => {
                const token = generateToken(
                    { userId: 9999, userName: 'robert' },
                    { expiresIn: 10 }
                )

                response = await Server.inject({
                    method: 'GET',
                    url: '/authentication/',
                    headers: {
                        Cookie: Config.get('jwt.cookieKey') + '=' + token
                    }
                })
            })

            it('should response with 200 OK', () => {
                expect(response.statusCode).equals(200)
            })

            it('should display the user id', () => {
                expect(response.result).contains('9999')
            })

            it('should display the user name', () => {
                expect(response.result).contains('robert')
            })

            it('should display a link for logout', () => {
                expect(response.result).contains('/authentication/logout')
            })
        })

        describe('if the token has expired', () => {
            let response

            before(async () => {
                const token = generateToken(
                    { userId: 100, userName: 'robert' },
                    { expiresIn: -1 }
                )

                response = await Server.inject({
                    method: 'GET',
                    url: '/authentication/',
                    headers: {
                        Cookie: Config.get('jwt.cookieKey') + '=' + token
                    }
                })
            })

            it('should response with 200 OK', () => {
                expect(response.statusCode).equals(200)
            })

            it('should display that the token has been expired', () => {
                expect(response.result).contains('Your token has been expired. Please login again.')
            })

            it('should display a link to the login form', () => {
                expect(response.result).contains('/authentication/login')
            })
        })
    })
})
