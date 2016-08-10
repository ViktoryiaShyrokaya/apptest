sap.ui.core.mvc.Controller.extend("apptest.view.Detail2", {
	productArray: [],
	categoryArray: [],
	supplierArray: [],
	product: 0,
	category: 0,
    supplier: 0,

	onInit: function () {
		this.getRouter().getRoute("info").attachMatched(this._loadInfoOrder, this);
	},
	getRouter: function () {
		return sap.ui.core.UIComponent.getRouterFor(this);
	},

	onNavBack: function(){
		var oHistory = sap.ui.core.routing.History.getInstance();
		var oPrevHash = oHistory.getPreviousHash();
		if (oPrevHash !== undefined) {
			window.history.go(-1);
		} else {
			this.getRouter().navTo("info", {}, true);
		}
	},
	_loadInfoOrder: function(oEvent){
		this.oInitial = undefined;
		this.productArray = [];
		this.categoryArray = [];
		this.supplierArray = [];
		var params = oEvent.getParameter("arguments");
		var contextHeader = new sap.ui.model.Context(this.getView().getModel(), "/Orders(" + params.infoId + ")");
		var contextCustomer = new sap.ui.model.Context(this.getView().getModel(), "/Customers('" + params.id + "')");
		var oHeader = this.getView().byId("detailHeader");
		oHeader.setBindingContext(contextHeader);
		var customerForm = this.getView().byId("FormCustomer");
		customerForm.setBindingContext(contextCustomer);
		var employeeForm = this.getView().byId("FormEmployee");
		employeeForm.bindElement("/Orders(" + params.infoId + ")/Employee");
		var shipperForm = this.getView().byId("FormShipper");
		shipperForm.bindElement("/Orders(" + params.infoId + ")/Shipper");
		this.readOrderDetail(params.infoId);
		//var image = this.getView().byId("ff");
		//var dat = "data:image/bmp;base64,"+ this.hexToBase64
		//image.setSrc('http://accweb/emmployees/davolio.bmp');
	},

	readOrderDetail: function(order){
		this.orderDetailModel = new sap.ui.model.json.JSONModel();
		var that = this;
		this.oInitial = jQuery.Deferred();
		jQuery.when(this.oInitial).then(jQuery.proxy(function(){
				that.createModel();
		}, this));
		this.category = this.product = this.supplier = 0;
		this.getView().getModel().read("/Orders(" + order +")/Order_Details",{
			success: function (oData) {
				for (var i=0; i< oData.results.length; i++){
					var id = oData.results[i].ProductID;
					that.check = oData.results.length;
					that.orderDetailModel.setData(oData.results);
					that.getView().byId("idTable").setModel(that.orderDetailModel, "model");
					that.readProduct(id);
					that.readSupplier(id);
					that.readCategory(id);
				}
			},
			error: function (Error) {

			}
		})
	},

	createModel: function(){
		for (var i=0; i<this.productArray.length; i++){
			var object = this.orderDetailModel.getData()[i];
			object.ProductName = this.productArray[i].ProductName;
			object.CategoryName = this.categoryArray[i].CategoryName;
			object.Description = this.categoryArray[i].Description;
			object.CompanyName = this.supplierArray[i].CompanyName;
			object.ContactName = this.supplierArray[i].ContactName;
			object.ContactTitle = this.supplierArray[i].ContactTitle;
			object.Address= this.supplierArray[i].Address;
			object.City= this.supplierArray[i].City;
			object.Region= this.supplierArray[i].Region;
			object.PostalCode= this.supplierArray[i].PostalCode;
			object.Country= this.supplierArray[i].Country;
			object.Phone= this.supplierArray[i].Phone;
			this.orderDetailModel.setProperty("/" + i + "/", object);
		}
	},
	readProduct: function(id){
		var that = this;
		this.getView().getModel().read("/Products(" + id + ")",{
			success: function (oData) {
				that.product++;
				that.productArray.push(oData);
				that.checkFinished();
			},
			error: function (Error) {

			}
		})
	},
	readSupplier: function(id){
		var that = this;
		this.getView().getModel().read("/Products(" + id + ")/Supplier",{
			success: function (oData) {
				that.supplier++
				that.supplierArray.push(oData);
				that.checkFinished();
			},
			error: function (Error) {

			}
		})
	},
	readCategory: function(id){
		var that = this;
		this.getView().getModel().read("/Products(" + id + ")/Category",{
			success: function (oData) {
				that.category++;
				that.categoryArray.push(oData);
				that.checkFinished();
			},
			error: function (Error) {

			}
		})
	},

	checkFinished: function(){
		if ((this.product === this.check) && (this.check === this.supplier) && (this.check === this.category)){
			this.oInitial.resolve();
		}
	}
});