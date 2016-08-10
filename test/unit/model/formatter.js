sap.ui.require(
    [
        "apptest/apptest/util/formatters",
        "apptest/apptest/view/Detail.controller",
        "sap/ui/model/resource/ResourceModel",
        "sap/ui/thirdparty/sinon",
        "sap/ui/thirdparty/sinon-qunit"
    ],
    function (formatter, Detail, ResourceModel) {
        "use strict";
        //QUnit.module("formatter - formatDetailViewTitle", {
        //    setup: function(){
        //        this.Detail = Detail;
        //    }
        //});

        function concatenationCase(assert, sValue1,sValue2, fExpectedResult) {
            // Act
            var fTitle = formatter.concatenation.call(this.Detail, sValue1, sValue2);

            // Assert
            assert.strictEqual(fTitle, fExpectedResult, "The result was correct");
        }

        QUnit.test("Should set title to Incident title", function (assert) {
            var sTestTitle = "001 00";

            //concatenationCase.call(this, assert, "001", "00", sTestTitle);
        });

    }
);