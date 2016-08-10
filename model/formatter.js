sap.ui.define([
], function(constant) {
    "use strict";

    return {

        /**
         * Formats timeframe to hardcoded string
         * @public
         * @param {int} value
         * @returns {string} sValue
         */
        timeframeFormat: function(value) {
            if (value > 100000) {
                return "HIGH";
            } else if (value > 10000) {
                return "MEDIUM";
            } else if (value > 1000) {
                return "LOW";
            } else {
                return "N/A";
            }
        }
    };

});