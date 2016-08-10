jQuery.sap.declare("apptest.Component");
jQuery.sap.require("sap.m.routing.RouteMatchedHandler");
jQuery.sap.require("apptest.util.formatters");

sap.ui.core.UIComponent.extend("apptest.Component", {

	_oResourceBundle: null,

	metadata: {
		"name": "Event Management Transactional APP",
		"version": "1.0",
		"includes": [
			"css/style.css"
		],
		"dependencies": {
			"libs": ["sap.m"],
			"components": []
		},

		"config": {
			"resourceBundle": "i18n/i18n.properties",
			"titleResource": "SHELL_TITLE",

			serviceConfig: {
				name: "EM_SRV",
				serviceUrl: "http://localhost:5000/proxy/V3/Northwind/Northwind.svc"
			}
		},

		routing: {
			config: {
				viewType: "XML",
				viewPath: "apptest.view",
				controlId: "fioriContent",
				transition: "slide",
				bypassed: {
					target: ["master"]
				}
			},
			routes: [
				{
					pattern: "",
					name: "Master",
					target: "master"
				},
				{
					pattern: "order/{id}",
					name: "order",
					target: "orderView"
				},
				{
					pattern: "order/{id}/info/{infoId}",
					name: "info",
					target: ["orderView", "infoView"]
				},
				{
					pattern: "product/{productId}",
					name: "cartProduct",
					target: ["home" , "productView"]
				}
			],
			targets: {
				infoView: {
					viewName: "Detail2",
					viewLevel: 2,
					controlAggregation: "detailPages"
				},
				orderView: {
					viewName: "Master2",
					viewLevel: 2,
					controlAggregation: "masterPages"
				},
				master: {
					viewName: "Master",
					viewLevel: 1,
					controlAggregation: "masterPages"
				},
				welcome: {
					viewName: "Detail",
					viewLevel: 0,
					controlAggregation: "detailPages"
				}
			}
		}
	},

	getResourceBundle: function () {
		return this._oResourceBundle;
	},

	init: function () {
		sap.ui.core.UIComponent.prototype.init.apply(this, arguments);

		var oHashChanger = sap.ui.core.routing.HashChanger.getInstance();
		oHashChanger.replaceHash("");

		this._oRouteMatchedHandler = new sap.m.routing.RouteMatchedHandler(this.getRouter());
		// this component should automatically initialize the router
		this.getRouter().initialize();

		var oMetadataConfig = this.getMetadata().getConfig();
		var oServiceConfig = oMetadataConfig.serviceConfig;
		var sServiceUrl = oServiceConfig.serviceUrl;

		// always use absolute paths relative to our own component
		// (relative paths will fail if running in the Fiori Launchpad)
		var rootPath = jQuery.sap.getModulePath("apptest");

		// if proxy needs to be used for local testing...
		var sProxyOn = jQuery.sap.getUriParameters().get("proxyOn");
		var bUseProxy = (sProxyOn === "true");
		if (bUseProxy) {
			sServiceUrl = rootPath + "/proxy" + sServiceUrl;
		}

		// start mock server if required
		var responderOn = jQuery.sap.getUriParameters().get("responderOn");
		var bUseMockData = (responderOn === "true");
		//var bUseMockData = true;
		if (bUseMockData) {
			jQuery.sap.require("sap.ui.core.util.MockServer");
			var oMockServer = new sap.ui.core.util.MockServer({
				rootUri: sServiceUrl.replace(/\/?$/, "/")
			});
			oMockServer.simulate(rootPath + "/localService/metadata.xml", rootPath + "/localService/mockdata");
			oMockServer.start();

			var msg = "Running in demo mode with mock data."; // not translated because only for development scenario
			jQuery.sap.require("sap.m.MessageToast");
			sap.m.MessageToast.show(msg, {
				duration: 4000
			});
		}

		// set i18n model
		var i18nModel = new sap.ui.model.resource.ResourceModel({
			bundleUrl: rootPath + "/i18n/i18n.properties"
		});
		this.setModel(i18nModel, "i18n");

		this._oResourceBundle = jQuery.sap.resources({
			url: rootPath + "/i18n/i18n.properties",
			locale: sap.ui.getCore().getConfiguration().getLanguage()
		});

		sap.apptest.util.formatters.init(this._oResourceBundle);
		function parseXML(text) {
			var doc;
			if (window.DOMParser) {
				var parser = new DOMParser();
				doc = parser.parseFromString(text, "text/xml");
			} else { // Internet Explorer
				doc = new ActiveXObject("Microsoft.XMLDOM");
				doc.async = "false";
				doc.loadXML(text);
			}
			return doc;
		}

		// set data model
		var m = new sap.ui.model.odata.ODataModel(sServiceUrl, {
			json: true,
			loadMetadataAsync: true,
			useBatch: true
		});
		m.attachMetadataFailed(function (oError) {
			jQuery.sap.require("sap.ca.ui.message.message");
			var xResponse = parseXML(oError.getParameter("responseText"));

			if (!xResponse.getElementsByTagName("message")[0]){
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: oError.getParameters().message
				});
			}else{
				sap.ca.ui.message.showMessageBox({
					type: sap.ca.ui.message.Type.ERROR,
					message: xResponse.getElementsByTagName("message")[0].childNodes[0].nodeValue
				});
			}

		});

		m.setDefaultCountMode(sap.ui.model.odata.CountMode.Inline);
		m.attachRequestFailed(function (oError) {
			jQuery.sap.require("sap.ca.ui.message.message");
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: jQuery.sap.parseJS(oError.getParameter("responseText")).error.message.value
			});
		});
		m.attachMetadataFailed(function (oError) {
			jQuery.sap.require("sap.ca.ui.message.message");
			sap.ca.ui.message.showMessageBox({
				type: sap.ca.ui.message.Type.ERROR,
				message: jQuery.sap.parseXML(oError.getParameter("responseText")).getElementsByTagName("message")[0].childNodes[0].nodeValue
			});
		});
		this.setModel(m);

		// set device model
		var deviceModel = new sap.ui.model.json.JSONModel({
			isTouch: sap.ui.Device.support.touch,
			isNoTouch: !sap.ui.Device.support.touch,
			isPhone: sap.ui.Device.system.phone,
			isNoPhone: !sap.ui.Device.system.phone,
			isDesktop: sap.ui.Device.system.desktop,
			listMode: (sap.ui.Device.system.phone) ? "None" : "SingleSelectMaster",
			listItemType: (sap.ui.Device.system.phone) ? "Active" : "Inactive"
		});
		deviceModel.setDefaultBindingMode("OneWay");
		this.setModel(deviceModel, "device");
		if (!sap.ui.Device.system.phone) {
			this.getRouter().getTargets().display("welcome");
		}
	},

	/**
	 * Initialize the application
	 *
	 * @returns {sap.ui.core.Control} the content
	 */
	createContent: function () {

		var oViewData = {
			component: this
		};
		return sap.ui.view({
			viewName: "apptest.view.App",
			type: sap.ui.core.mvc.ViewType.XML,
			viewData: oViewData
		});
	}
});
