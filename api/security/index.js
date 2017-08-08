/**
 * Permissions
 *
 * - action on any kind of document
 *   get: ["*:*"]
 *
 * - action on a document of a specific type
 *   set: ["tint:*]
 *
 * - action on a specific document
 *   set: ["tint:55449cf9d009d"]
 *
 * operation:
 * doctypePattern:idPattern:operations
 */

module.exports = {
    check: check
};

/**
 * check if the given action on the entity with the given id is allowed.
 *
 * @param docType   the type of document on which to validate the permissions
 * @param key       the key of the document on which to validate the permissions
 * @param action    the action to validate
 * @param permissions   the list of permissions
 */
function check(docType, key, action, permissions) {

}