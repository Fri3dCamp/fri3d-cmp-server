/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var express         = require('express');
var bodyParser      = require('body-parser');
var errorHandler    = require('errorhandler');
var log4js          = require('log4js');
var cors            = require('cors'),
    Errors          = require('./api-errors'),
    ResponseHandler = require('./utils/response-handler'),
    jwt             = require('express-jwt');
var jwtAuthz = require('express-jwt-authz');
var jwks = require('jwks-rsa');

var LOGGER = log4js.getLogger("api");

function API(config) {
    this.config = config;

    this.middlewares = [];

    this.modules = {};
    this._storage = null;

    this.app = express();

    this.secret = jwks.expressJwtSecret({
        cache: true,
        rateLimit: true,
        jwksRequestsPerMinute: 5,
        jwksUri: "https://fri3d.eu.auth0.com/.well-known/jwks.json"
    });

    this.softJwtCheck = jwt({
        secret: this.secret,
        audience: config.auth0.audience,
        issuer: "https://fri3d.eu.auth0.com/",
        algorithms: ['RS256'],
        credentialsRequired: false
    });

    this.jwtCheck = jwt({
        secret: this.secret,
        audience: config.auth0.audience,
        issuer: "https://fri3d.eu.auth0.com/",
        algorithms: ['RS256']
    });
}

API.prototype.module = function(name) {
    this.modules[name] = require('./modules/' + name);
};

API.prototype.storage = function(storage) {
    this._storage = storage;
};

API.prototype.middleware = function(middleware) {
    this.middlewares.push(middleware);
    return this;
};

API.prototype.listen = function() {
    var self = this;

    // -- Services ----------------------------------------------------------------------------------------------------
    var services = {};
    for (var moduleName in this.modules) {
        if (! this.modules.hasOwnProperty(moduleName)) continue;

        var moduleServices = this.modules[moduleName].services(this.config, this._storage, services);
        for (var moduleServiceName in moduleServices) {
            if (! moduleServices.hasOwnProperty(moduleServiceName)) continue;

            if (services[moduleServiceName])
                throw new Errors.NameAlreadyUsedError('The service name "' + moduleServiceName + '" has already been used.');

            services[moduleServiceName] = moduleServices[moduleServiceName];

            LOGGER.info('Loaded service ' + moduleName + '::' + moduleServiceName);
        }
    }

    // -- Express -----------------------------------------------------------------------------------------------------
    this.app.use(cors({
        methods: ['GET', 'PUT', 'POST', 'DELETE', 'PATCH'],
        origin: "*"
    }));

    // for (var idx in this.middlewares) {
    //     if (! this.middlewares.hasOwnProperty(idx)) continue;
    //     this.app.use(this.middlewares[idx]);
    // }

    // this.app.use(bodyParser.urlencoded({ extended: false }));
    this.app.use(bodyParser.json());
    this.app.use(errorHandler());

    // -- Resources ----------------------------------------------------------------------------------------------------
    var responseHandler = new ResponseHandler();
    var resources = {};
    for (moduleName in this.modules) {
        if (! this.modules.hasOwnProperty(moduleName)) continue;

        var moduleResources = this.modules[moduleName].resources(this.config, this._storage, services, responseHandler);
        for (var moduleResourceName in moduleResources) {
            if (! moduleResources.hasOwnProperty(moduleResourceName)) continue;

            if (resources[moduleResourceName])
                throw new Errors.NameAlreadyUsedError('The resource name "' + moduleResourceName + '" has already been used.');

            resources[moduleResourceName] = moduleResources[moduleResourceName];

            LOGGER.info('Loaded resource ' + moduleName + '::' + moduleResourceName);
        }
    }

    // -- Modules ----------------------------------------------------------------------------------------------------
    for (moduleName in this.modules) {
        if (! this.modules.hasOwnProperty(moduleName)) continue;

        this.modules[moduleName].run(this.config, self, resources, services);
    }



    this.app.listen(this.config.port, function () {
        LOGGER.info();
        LOGGER.info('API listening on port ' + self.config.port);
        LOGGER.info();
    });
};

// ====================================================================================================================
// == API METHODS
// ====================================================================================================================

API.prototype.registerHead = function(path, fn) {
    this.app.head(path, this.softJwtCheck, fn);
    LOGGER.info('    [HEAD] ' + path);
};

API.prototype.registerSecureHead = function(path, scopes, fn) {
    this.app.head(path, this.jwtCheck, jwtAuthz(scopes), fn);
    LOGGER.info('   [sHEAD] ' + path);
};

API.prototype.registerGet = function(path, fn) {
    this.app.get(path, this.softJwtCheck, fn);
    LOGGER.info('     [GET] ' + path);
};

API.prototype.registerSecureGet = function(path, scopes, fn) {
    this.app.get(path, this.jwtCheck, jwtAuthz(scopes), fn);
    LOGGER.info('    [sGET] ' + path);
};

API.prototype.registerPut = function(path, fn) {
    this.app.put(path, this.softJwtCheck, function(req, res) { return fn(req, res); });
    LOGGER.info('     [PUT] ' + path);
};

API.prototype.registerSecurePut = function(path, scopes, fn) {
    this.app.put(path, this.jwtCheck, jwtAuthz(scopes), function(req, res) { return fn(req, res); });
    LOGGER.info('    [sPUT] ' + path);
};

API.prototype.registerPost = function(path, fn) {
    this.app.post(path, this.softJwtCheck, function(req, res) { return fn(req, res); });
    LOGGER.info('    [POST] ' + path);
};

API.prototype.registerSecurePost = function(path, scopes, fn) {
    this.app.post(path, this.jwtCheck, jwtAuthz(scopes), function(req, res) { return fn(req, res); });
    LOGGER.info('   [sPOST] ' + path);
};

API.prototype.registerPatch = function(path, fn) {
    this.app.patch(path, this.softJwtCheck, function(req, res) { return fn(req, res); });
    LOGGER.info('   [PATCH] ' + path);
};

API.prototype.registerSecurePatch = function(path, scopes, fn) {
    this.app.patch(path, this.jwtCheck, jwtAuthz(scopes), function(req, res) { return fn(req, res); });
    LOGGER.info('  [sPATCH] ' + path);
};

API.prototype.registerDelete = function(path, fn) {
    this.app.delete(path, this.softJwtCheck, function(req, res) { return fn(req, res); });
    LOGGER.info('  [DELETE] ' + path);
};

API.prototype.registerSecureDelete = function(path, scopes, fn) {
    this.app.delete(path, this.jwtCheck, jwtAuthz(scopes), function(req, res) { return fn(req, res); });
    LOGGER.info(' [sDELETE] ' + path);
};

module.exports = API;