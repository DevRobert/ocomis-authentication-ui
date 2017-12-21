const request = require('request-promise')
const Config = require('config')
const logger = require('../logger')

const login = async (username, password) => {
    const requestUri = Config.get('apis.authentication.uri') + '/sessions'

    const requestData = {
        username,
        password
    }

    try {
        const response = await request({
            method: 'POST',
            uri: requestUri,
            body: requestData,
            json: true
        })

        return response
    } catch (error) {
        logger.error({
            summary: 'Error requesting the authentication api.',
            details: error.toString()
        })

        if (error.statusCode === 400) {
            throw new Error(error.error.error.message)
        }

        throw new Error('Sorry, an unexpected error occured requesting the communication api.')
    }
}

module.exports = {
    login
}
