var Hapi = require('hapi');
var expect = require('chai').expect;

// Declare internals
var server;

beforeEach(function (done) {
    server = new Hapi.Server();
    server.connection();

    var options = {
        tag: 'debugTest',
        debugPassword: 'testPassword',
        cookiePassword: 'test',
        debugTags: {
            session: 'session'
        }
    };

    server.register({
        register: require("../"),
        options: options
    }, function (err) {
        done(err);
    });
});

afterEach(function () {
    server.stop();
});

describe("hapi debug manager session mode", function () {

    it("should register without error", function (done) {
        done();
    });

    it("should enable the session mode if injected the correct debugPassword", function (done) {
        server.route({
            method: 'GET',
            path: '/1',
            config: {
                handler: function (request, reply) {
                    var debugInfo = server.methods.debugManager.getDebugInformation(request);
                    expect(debugInfo).to.be.an.object;
                    expect(debugInfo.debug).to.equal(true);
                    expect(debugInfo.tags).to.contain('session');
                    expect(debugInfo.tags).to.contain('debugTest');
                    expect(debugInfo.tags.length).to.equal(2);
                    return reply('OK');
                }
            }
        });

        server.start(function (err) {
            server.inject({
                method: 'GET',
                url: '/1?debugMode=true&debugPassword=testPassword'
            }, function (res) {
                expect(res.result).to.equal('OK');
                done();
            });
        });
    });

    it("should use the passed in debugTag", function (done) {
        server.route({
            method: 'GET',
            path: '/1',
            config: {
                handler: function (request, reply) {
                    var debugInfo = server.methods.debugManager.getDebugInformation(request);
                    expect(debugInfo).to.be.an.object;
                    expect(debugInfo.debug).to.equal(true);
                    expect(debugInfo.tags).to.contain('Bug123');
                    expect(debugInfo.tags.length).to.equal(3);
                    return reply('OK');
                }
            }
        });

        server.start(function (err) {
            server.inject({
                method: 'GET',
                url: '/1?debugMode=true&debugPassword=testPassword&debugTag=Bug123'
            }, function (res) {
                expect(res.result).to.equal('OK');
                done();
            });
        });
    });
});