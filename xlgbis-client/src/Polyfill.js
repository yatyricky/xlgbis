if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

if (!String.isEmptyText) {
    String.isEmptyText = function (str) {
        return typeof str !== "string" || str.length === 0
    }
}

export default {}
