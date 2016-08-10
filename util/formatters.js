/**
 * Created by viktoryia.shyrokaya on 03.08.2016.
 */
jQuery.sap.declare("sap.apptest.util.formatters");

sap.apptest.util.formatters = {};

sap.apptest.util.formatters.init = function(oResourceBundle) {
    sap.apptest.util.formatters._oBundle = oResourceBundle;
    jQuery.sap.require("sap.ui.core.format.DateFormat");
};

sap.apptest.util.formatters.concatenation = function(label, text){
    if (text){
        return label + ' ' + text;
    }
};

sap.apptest.util.formatters.concatenationDate = function(label, text){
    if (text){
        var textPart = new Date(text);
        if (textPart.toString() === "Invalid Date") return '';
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd.MM.YYYY hh:mm" });
        return label + ' ' + dateFormat.format(textPart);
    }
};

sap.apptest.util.formatters.concatenationDateShort = function(text){
    if (text){
        var textPart = new Date(text);
        if (textPart.toString() === "Invalid Date") return '';
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({pattern : "dd.MM.YYYY" });
        return dateFormat.format(textPart);
    }
};