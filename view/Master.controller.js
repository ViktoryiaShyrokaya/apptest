jQuery.sap.require("apptest.util.formatters");
sap.ui.core.mvc.Controller.extend("apptest.view.Master", {

    onInit: function () {
        this._oListItemTemplate = this.getView().byId("listItem");
        //this.getView().byId("list").attachEventOnce("updateFinished", function() {
        //    this.selectFirstItem();
        //}, this);
    },

    selectFirstItem: function(oEvent){
        //this.getView().byId("list").fireSelectionChange({
        //    listItem: this.getView().byId("list").getItems()[0]
        //});
    },

    onSelectionChange: function(oEvent){
        var oListItem = oEvent.getParameter("listItem") || oEvent.getSource();
        if ((sap.ui.Device.system.phone) || !sap.ui.Device.system.phone){
            sap.ui.core.UIComponent.getRouterFor(this).navTo("order", {
                from: "master",
                id: oListItem.getBindingContext().getPath().substr(1)
            });
        }
    },

    handleSearch: function(oEvent) {
        var searchField = this.getView().byId("searchField").getValue();
        aSearchFilters = [];
        aSearchFilters.push(new sap.ui.model.Filter("ContactName", sap.ui.model.FilterOperator.Contains, searchField));
        this.getView().byId("list").bindItems("/Customers", this._oListItemTemplate, null, aSearchFilters);
    }
});