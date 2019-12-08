class InvalidFieldsDto {
    constructor(fields, message) {
        this.setFields(fields);
        this.message = message;
    }

    setFields(fields) {
        this.fields = Array.isArray(fields) ? fields : [ fields ];
    }
}

module.exports = { InvalidFieldsDto };
