import _ from "../util/index";
import { JSCRIPT_VERSION, DOCUMENT } from "../const";

var hooks = {get: {}, set: {}};

// fix camel cased attributes
"tabIndex readOnly maxLength cellSpacing cellPadding rowSpan colSpan useMap frameBorder contentEditable".split(" ").forEach((key) => {
    hooks.get[ key.toLowerCase() ] = (node) => node[key];
});

// style hook
hooks.get.style = (node) => node.style.cssText;
hooks.set.style = (node, value) => { node.style.cssText = value };

// title hook for DOM
hooks.get.title = (node) => {
    var doc = node.ownerDocument;

    return (node === doc.documentElement ? doc : node).title;
};

hooks.set.title = (node, value) => {
    var doc = node.ownerDocument;

    (node === doc.documentElement ? doc : node).title = value;
};

// some browsers don't recognize input[type=email] etc.
hooks.get.type = (node) => node.getAttribute("type") || node.type;
/* istanbul ignore if */
if (JSCRIPT_VERSION < 9) {
    // IE8 has innerText but not textContent
    hooks.get.textContent = (node) => node.innerText;
    hooks.set.textContent = (node, value) => { node.innerText = value };

    // IE8 sometimes breaks on innerHTML
    hooks.set.innerHTML = function(node, value) {
        try {
            node.innerHTML = value;
        } catch (err) {
            node.innerHTML = "";

            var sandbox = node.ownerDocument.createElement("div");

            sandbox.innerHTML = value;

            while (sandbox.firstChild) {
                node.appendChild(sandbox.firstChild);
            }
        }
    };
}

export default hooks;
