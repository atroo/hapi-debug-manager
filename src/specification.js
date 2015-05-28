var joi = require("joi");

module.exports = joi.object().keys({
    tag: joi.string().default('debug').description('pass in a tag which shall be always present in the tags list'),
    debugPassword: joi.string().required().description('pass in a password which has to be provided when enabling the debug mode via url parameter'),
    cookiePassword: joi.string().description('debug mode is managed via a cokkie beeing encrypte and signed by iron'),
    debugTags: joi.object().default({
        session: 'debugSession'
    }).description('a object mapping different debug modes to different tags')
});