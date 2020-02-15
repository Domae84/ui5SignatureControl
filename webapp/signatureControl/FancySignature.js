sap.ui.define(["sap/ui/core/Control"], (Control) => {

    const drawing = new WeakMap();
    const pixels = new WeakMap();
    const oSignatureControl = Control.extend("signature.FancySignature", {                  // call the new Control type "my.Hello"
        // and let it inherit from sap.ui.core.Control
        metadata: {                              // the Control API
            properties: {
                "name": "string"// setter and getter are created behind the scenes,
                // including data binding and type validation
            }
        },

        renderer: {
            apiVersion: 2,                        // see 'Renderer Methods' for an explanation of this flag
            render: function (oRm, oControl) {     // the part creating the HTML
                oRm.openStart("div", oControl).class("signatureControl").openEnd();
                oRm.text("Hello " + oControl.getName()); // write the Control property 'name', with automatic XSS protection
                oRm.close("div");
            }
        },

        onmousedown: function (evt) {
            pixels.set(this,0);
            drawing.set(this, true);
        },
        onmouseup: function (evt) {
            drawing.set(this, false);
            alert(pixels.get(this));
        },
        onmouseout:function(){
            drawing.set(this, false);
        }
    });
    oSignatureControl.prototype.onAfterRendering = function () {
        this.$().bind("mousemove", (evt) => {
            if (drawing.get(this)) {
                pixels.set(this,[evt.clientX,evt.clientY]);
            }
        });
    };
    return oSignatureControl;
});