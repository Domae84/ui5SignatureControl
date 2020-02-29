sap.ui.define(["sap/ui/core/Control"], (Control) => {

    const drawing = new WeakMap();
    const firstDraw = new WeakMap();
    const oSignatureControl = Control.extend("signature.FancySignature", (function () {                  // call the new Control type "my.Hello"
        // and let it inherit from sap.ui.core.Control
        let svg,id,currentX,currentY,line,path;

        return {
            metadata: {                              // the Control API
                properties: {
                    "name": "string",// setter and getter are created behind the scenes,
                    "width": "string",
                    "height": "string"// including data binding and type validation
                }
            },

            renderer: {
                apiVersion: 2,                        // see 'Renderer Methods' for an explanation of this flag
                render: function (oRm, oControl) {     // the part creating the HTML
                    id = `${oControl.getId()}-svg`;
                    svg = `<svg id="${id}" height="${oControl.getHeight()}" width="${oControl.getWidth()}"></svg>`;
                    oRm.write("<div");
                    oRm.writeControlData(oControl);
                    oRm.addClass('signatureControl');
                    oRm.writeClasses();
                    oRm.write(">");
                    oRm.write(svg);
                    oRm.write("</div>");
                }
            },

            onmousedown: function (oEvent) {
                const oControlHtml = document.getElementById(id);
                let oPath = document.createElementNS('http://www.w3.org/2000/svg',"path");
                oPath.setAttributeNS(null, "stroke", "black");
                oPath.setAttributeNS(null, "stroke-width", 2);
                oPath.setAttributeNS(null, "opacity", 1);
                oPath.setAttributeNS(null, "stroke-linecap", 'round');
                oPath.setAttributeNS(null, "stroke-linejoin", 'round');
                oPath.setAttributeNS(null, "fill", "none");
                oPath.setAttributeNS(null, "d", `M${oEvent.offsetX},${oEvent.offsetY}`);
                oControlHtml.appendChild(oPath);
                drawing.set(this, true);
                firstDraw.set(this,false);
            },
            onmouseup: function () {
                drawing.set(this, false);
            },
            onmouseout: function (oEvent) {
                const id = `${this.getId()}-svg`;
                const parentId = oEvent.relatedTarget.parentNode.getAttribute("id");
                if (oEvent.relatedTarget && (parentId !== id && parentId !== `${this.getId()}`)) {
                    drawing.set(this, false);
                }
            }
        }
    })());

    oSignatureControl.prototype.onAfterRendering = function () {
        this.$().bind("mousemove", (evt) => {
            if (drawing.get(this)) {
                const id = `${this.getId()}-svg`;
                const oControlHtml = document.getElementById(id);
                const oCurrentPath = oControlHtml.children[oControlHtml.children.length-1];
                let sLine;
                if(firstDraw.get(this)){
                   sLine = `${oCurrentPath.getAttributeNS(null,'d')} ${evt.offsetX} ${evt.offsetY}`;
                } else {
                    firstDraw.set(this,true);
                    sLine =`${oCurrentPath.getAttributeNS(null,'d')} L ${evt.offsetX} ${evt.offsetY}`;
                }
                console.log(sLine);
                try {
                    oCurrentPath.setAttributeNS(null, 'd', sLine);
                } catch (ex){
                    debugger;
                }
            }
        });
    };
    return oSignatureControl;
});
