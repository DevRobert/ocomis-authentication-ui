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

        logger.info('The Authentication API successfully validated the credentials.')

        return response
    } catch (error) {
        logger.error({
            summary: 'Error requesting the Authentication API.',
            details: error.toString()
        })

        if (error.statusCode === 400) {
            throw new Error(error.error.message)
        }

        throw new Error('Sorry, an unexpected error occured requesting the Authentication API.')
    }
}

module.exports = {
    login
}
