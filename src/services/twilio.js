const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID
const { v4: uuidv4 } = require('uuid')
// const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN
const TWILIO_API_KEY_SID = process.env.TWILIO_API_KEY_SID
const TWILIO_API_KEY_SECRET = process.env.TWILIO_API_KEY_SECRET
const AccessToken = require('twilio').jwt.AccessToken
const VideoGrant = AccessToken.VideoGrant

const twilioClient = require('twilio')(
    TWILIO_API_KEY_SID,
    TWILIO_API_KEY_SECRET,
    {
        accountSid: TWILIO_ACCOUNT_SID,
    }
)
module.exports = {
    twilioClient,
    /**
     * @function generateAccessToken
     * @description generate access token for user to join video call
     * @param {Object} request - the request object
     * @param {Object} response - the response object
     */
    getAccessToken: async (identity) => {
        // create an access token
        const token = new AccessToken(
            TWILIO_ACCOUNT_SID,
            TWILIO_API_KEY_SID,
            TWILIO_API_KEY_SECRET,
            { identity: `${uuidv4()}${identity}` }
        )
        // create a video grant
        let videoGrant
        // videoGrant = new VideoGrant({
        //     room: roomName,
        // })
        videoGrant = new VideoGrant()
        // add the video grant
        token.addGrant(videoGrant)
        // serialize the token and return it
        return token.toJwt()
    },
}
