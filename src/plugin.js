var joi = require("joi");
var spec = require("./specification");
/*
 * debugTag can be passed in as a url parameter and will be appended to every log from the current session
 * therefore easily enabling filtering within the log files in production systems
 */
var defaultTag,
    debugTags;

exports.register = function (server, options, next) {
    var opts;
    joi.validate(options, spec, function (err, res) {
        opts = res;
        if (err) {
            console.log("Debug Manager Config Validation failed", err, res);
            next();
        }
    });

    server.state("debugManager", {
        isHttpOnly: true,
        encoding: 'iron',
        password: opts.cookiePassword || '3KvkZ7aH!EwexL$-'
    });

    defaultTag = opts.tag;
    debugTags = opts.debugTags;

    var debugPassword = opts.debugPassword;

    server.ext('onPreHandler', function (request, reply) {
        var debugMode = !!request.query.debugMode;
        var pass = request.query.debugPassword;
        var debugTag = request.query.debugTag;
        var cookie = request.state.debugManager;
        if (!cookie && debugMode && pass == debugPassword) {
            cookie = {
                debugMode: true
            };
            if (debugTag) {
                cookie.debugTag = debugTag;
            }
            reply.state("debugManager", cookie);
            //allow the first request to be debuggable as well
            request.state.debugManager = cookie;
        }
        reply.continue();
    });

    server.method({
        name: 'debugManager.getDebugInformation',
        method: getDebugInformationFromRequest
    });
    next();
};

function getDebugInformationFromRequest(request) {
    //TODO enable different sources for request logging
    //easiest is the url enabled debug mode
    //but one could think of modes which trigger request logging via a DB setting or something comparable as well
    var debugInfo = {
        debug: false,
        tags: [defaultTag]
    };
    //now we figure out if the request shall count as beeing in debug mode
    debugInfo = getSessionDebugInfo(request, debugInfo);
    return debugInfo;
};

function getSessionDebugInfo(request, debugInfo) {
    if (request.state && request.state.debugManager) {
        var cookie = request.state.debugManager;
        if (cookie.debugMode === true) {
            debugInfo.debug = true;
            if (debugTags.session) {
                debugInfo.tags.push(debugTags.session);
            }
            if (cookie.debugTag) {
                debugInfo.tags.push(cookie.debugTag);
            }
        }
    }
    return debugInfo;
};

exports.register.attributes = {
    pkg: require('./../package.json')
};