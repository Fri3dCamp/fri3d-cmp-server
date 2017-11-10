function ConfigEnvironmentVariableMissingError(envVarName) {
    this.name = "ConfigEnvironmentVariableMissingError";
    this.message = "No value for the " + envVarName + " environment variable could be found.";
    this.variable = envVarName;
    this.stack = Error().stack;
}
ConfigEnvironmentVariableMissingError.prototype = Object.create(Error.prototype);
module.exports.ConfigEnvironmentVariableMissingError = ConfigEnvironmentVariableMissingError;

function NotFoundError(message) {
    this.name = "NotFoundError";
    this.message = message;
    this.stack = Error().stack;
}
NotFoundError.prototype = Object.create(Error.prototype);
module.exports.NotFoundError = NotFoundError;

function AuthorizationError(message) {
    this.name = "AuthorizationError";
    this.message = message;
    this.stack = Error().stack;
}
AuthorizationError.prototype = Object.create(Error.prototype);
module.exports.AuthorizationError = AuthorizationError;

function MissingParameterError(message) {
    this.name = "MissingParameterError";
    this.message = message;
    this.stack = Error().stack;
}
MissingParameterError.prototype = Object.create(Error.prototype);
module.exports.MissingParameterError = MissingParameterError;

function IllegalParameterError(message) {
    this.name = "IllegalParameterError";
    this.message = message;
    this.stack = Error().stack;
}
IllegalParameterError.prototype = Object.create(Error.prototype);
module.exports.IllegalParameterError = IllegalParameterError;

function BadPayloadError(message) {
    this.name = "BadPayloadError";
    this.message = message;
//    this.stack = Error().stack;
}
BadPayloadError.prototype = Object.create(Error.prototype);
module.exports.BadPayloadError = BadPayloadError;

function AlreadyExistsError(message) {
    this.name = "AlreadyExistsError";
    this.message = message;
    this.stack = Error().stack;
}
AlreadyExistsError.prototype = Object.create(Error.prototype);
module.exports.AlreadyExistsError = AlreadyExistsError;

function InvalidTokenError(message) {
    this.name = "InvalidTokenError";
    this.message = message;
    this.stack = Error().stack;
}
InvalidTokenError.prototype = Object.create(Error.prototype);
module.exports.InvalidTokenError = InvalidTokenError;

function MissingConfigurationError(message) {
    this.name = "MissingConfigurationError";
    this.message = message;
    this.stack = Error().stack;
}
MissingConfigurationError.prototype = Object.create(Error.prototype);
module.exports.MissingConfigurationError = MissingConfigurationError;

function AuthenticationError(message) {
    this.name = "AuthenticationError";
    this.message = message;
    this.stack = Error().stack;
}
MissingConfigurationError.prototype = Object.create(Error.prototype);
module.exports.AuthenticationError = AuthenticationError;