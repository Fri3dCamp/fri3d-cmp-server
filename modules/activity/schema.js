module.exports = {
    "id": "/Activity",
    "type": "object",
    "properties": {
        "name": {"type": "string"},
        "address": {"$ref": "/SimpleAddress"},
        "votes": {"type": "integer", "minimum": 1}
    }
};