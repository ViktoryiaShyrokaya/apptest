jQuery.sap.require("apptest.util.formatters");
sap.ui.core.mvc.Controller.extend("apptest.view.Master2", {

    onInit: function () {
        this.getRouter().getRoute("order").attachMatched(this._loadOrder, this);
    },

    getRouter: function () {
        return sap.ui.core.UIComponent.getRouterFor(this);
    },
    _loadOrder: function(oEvent){
        var orderTemplate = sap.ui.xmlfragment("apptest.fragment.MasterListItem", this);
        var param = oEvent.getParameter("arguments").id;
        this.getView().byId("list").bindItems("/" + param + "/Orders", orderTemplate);
        if (!sap.ui.Device.system.phone){
            this.getView().byId("list").attachEventOnce("updateFinished", function() {
                this.selectFirstItem();
            }, this);
        }
    },

    handleNavButtonPress : function () {
        var oHistory = sap.ui.core.routing.History.getInstance();
        var oPrevHash = oHistory.getPreviousHash();
        if (oPrevHash !== undefined) {
            window.history.go(-1);
        } else {
            this.getRouter().navTo("master", {}, true);
        }
    },

    selectFirstItem: function(){
        this.getView().byId("list").fireSelectionChange({
            listItem: this.getView().byId("list").getItems()[0]
        });
    },

    handleSelectOrder: function(oEvent){
        var oBindContext = oEvent.getParameter("listItem");
        var oModel = oBindContext.getBindingContext().getModel();
        var sCustomerId = oModel.getData(oBindContext.getBindingContext().getPath()).CustomerID;
        var sOrderId = oModel.getData(oBindContext.getBindingContext().getPath()).OrderID;
        this.getRouter().navTo("info", {id: sCustomerId, infoId: sOrderId}, !sap.ui.Device.system.phone);
    }


});