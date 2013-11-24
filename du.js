// DOM Utils (du) JS Library
// https://github.com/j201/du
// ©2013 j201 
/* jshint loopfunc:true */

(function(window, undefined) {
	var du, duCtor;
	if (Object.create) {
		du = Object.create(document);
	} else {
		duCtor = function(){};
		duCtor.prototype = document;
		du = new duCtor();
	}

	// Functions on document don't seem to work unless called with document as `this`
	// IE8 doesn't seem to iterate through all of the functions using a for in loop, so I grabbed the function names from Firefox 25
	// Looking for a better solution, but this should work for now
	var docFunctions = ["getElementsByAttribute", "getElementsByAttributeNS", "addBroadcastListenerFor", "removeBroadcastListenerFor", "persist", "getBoxObjectFor", "loadOverlay", "getElementsByTagName", "getElementsByTagNameNS", "getElementsByClassName", "getElementById", "createElement", "createElementNS", "createDocumentFragment", "createTextNode", "createComment", "createProcessingInstruction", "importNode", "adoptNode", "createEvent", "createRange", "createNodeIterator", "createTreeWalker", "createCDATASection", "createAttribute", "createAttributeNS", "hasFocus", "releaseCapture", "mozSetImageElement", "mozCancelFullScreen", "mozExitPointerLock", "enableStyleSheetsForSet", "elementFromPoint", "caretPositionFromPoint", "querySelector", "querySelectorAll", "getAnonymousNodes", "getAnonymousElementByAttribute", "getBindingParent", "loadBindingDocument", "createExpression", "createNSResolver", "evaluate", "obsoleteSheet", "hasChildNodes", "insertBefore", "appendChild", "replaceChild", "removeChild", "normalize", "cloneNode", "isEqualNode", "compareDocumentPosition", "contains", "lookupPrefix", "lookupNamespaceURI", "isDefaultNamespace", "hasAttributes", "setUserData", "getUserData", "addEventListener", "removeEventListener", "dispatchEvent", "setEventHandler", "getEventHandler"];
	for (var key, i = 0; i < docFunctions.length; i++) {
		key = docFunctions[i];
		if (document[key]) {
			du[key] = (function(key) {
				return function() {
					return document[key].apply(document, arguments);
				};
			})(key);
		}
	}

	///// QUERIES /////

	// Equivalent to getElementById
	du.id = function(id) {
		return document.getElementById(id);
	};

	// Equivalent to getElementsByTagName
	du.tag = function(elOrTag, tag) {
		return arguments.length > 1 ?
			elOrTag.getElementsByTagName(tag) :
			document.getElementsByTagName(elOrTag);
	};

	// Equivalent to getElementsByClassName
	du.className = function(elOrClassName, className) {
		if (document.getElementsByClassName)
			return arguments.length > 1 ?
				elOrClassName.getElementsByClassName(className) :
				document.getElementsByClassName(elOrClassName);
		return arguments.length > 1 ?
			elOrClassName.querySelectorAll(className.replace(/^\s*|\s+(?=\S)/g, ".")) :
			document.querySelectorAll(elOrClassName.replace(/^\s*|\s+(?=\S)/g, "."));
	};

	// Equivalent to querySelector
	du.qs = function(elOrSelector, selector) {
		return arguments.length > 1 ?
			elOrSelector.querySelector(selector) :
			document.querySelector(elOrSelector);
	};
	// Equivalent to querySelectorAll
	du.qsa = function(elOrSelector, selector) {
		return arguments.length > 1 ?
			elOrSelector.querySelectorAll(selector) :
			document.querySelectorAll(elOrSelector);
	};

	///// EVENTS //////

	// Event code - adapted from mdn.io/addevent
	/*if (!Event.prototype.preventDefault) {
		Event.prototype.preventDefault=function() {
			this.returnValue=false;
		};
	}
	if (!Event.prototype.stopPropagation) {
		Event.prototype.stopPropagation=function() {
			this.cancelBubble=true;
		};
	}*/
	if (!Element.prototype.addEventListener) {
		var eventListeners=[];

		var addEventListener=function(type, listener /*, useCapture (will be ignored) */) {
			var self=this;
			var wrapper=function(e) {
				e.target=e.srcElement;
				e.currentTarget=self;
				if (listener.handleEvent) {
					listener.handleEvent(e);
				} else {
					listener.call(self,e);
				}
			};
			if (type=="DOMContentLoaded") {
				var wrapper2=function(e) {
					if (document.readyState=="complete") {
						wrapper(e);
					}
				};
				document.attachEvent("onreadystatechange",wrapper2);
				eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper2});

				if (document.readyState=="complete") {
					var e=new Event();
					e.srcElement=window;
					wrapper2(e);
				}
			} else {
				this.attachEvent("on"+type,wrapper);
				eventListeners.push({object:this,type:type,listener:listener,wrapper:wrapper});
			}
		};
		var removeEventListener=function(type, listener /*, useCapture (will be ignored) */) {
			var counter=0;
			while (counter<eventListeners.length) {
				var eventListener=eventListeners[counter];
				if (eventListener.object==this && eventListener.type==type && eventListener.listener==listener) {
					if (type=="DOMContentLoaded") {
						this.detachEvent("onreadystatechange",eventListener.wrapper);
					} else {
						this.detachEvent("on"+type,eventListener.wrapper);
					}
					break;
				}
				++counter;
			}
		};
	}
	du.event = function(target, type, listener, useCapture) {
		// If a target isn't passed (that is, if the first argument is a string), run the event on window
		if (Object.prototype.toString.call(target) === '[object String]')
			return du.event(window, target, type, listener);
		if (Element.prototype.addEventListener) {
			target.addEventListener(type, listener, useCapture || false);
		} else {
			addEventListener.call(target, type, listener);
		}
	};
	du.load = function(listener) {
		du.event(window, "load", listener);
	};
	du.click = function(el, listener) {
		du.event(el, "click", listener);
	};
	du.rmEvent = function(target, type, listener, useCapture) {
		if (Element.prototype.removeEventListener) {
			target.removeEventListener(type, listener, useCapture || false);
		} else {
			removeEventListener.call(target, type, listener);
		}
	};

	///// DOM MUTATIONS /////

	// Removes all children from a node
	du.clear = function(node) {
		var removed = [];
		while(node.firstChild) {
			removed.push(node.removeChild(node.firstChild));
		}
		return removed;
	};
	
	// Clears a node and appends the given child
	du.setChild = function(node, child) {
		du.clear(node);
		return node.appendChild(child);
	};

	// Equivalent to document.createTextNode
	du.textNode = function(text) {
		return document.createTextNode(text);
	};

	// Appends a text node with the given text to a node
	du.appendText = function(node, text) {
		return node.appendChild(document.createTextNode(text));
	};

	// Prepends a child node to a node
	du.prepend = function(node, el) {
		return node.insertBefore(el, node.firstChild);
	};
	// Equivalent to node.appendChild
	du.append = function(node, el) {
		return node.appendChild(el);
	};

	// Inserts a child node after a given child node
	du.insertAfter = function(node, newEl, refEl) {
		return node.insertBefore(newEl, refEl.nextSibling);
	};

	// Removes all child text nodes and appends the given text
	du.setText = function(node, text) {
		var children = node.childNodes;
		for (var i = 0; i < children.length; i++) {
			if (children[i].nodeType === 3) {
				node.removeChild(children[i]);
				i--;
			}
		}
		du.appendText(node, text);
	};

	///// CSS /////
	
	du.addClass = function(el /*, ...classes */) {
		for (var i = 1; i < arguments.length; i++) {
			el.className += ' ' + arguments[i];
		}
	};

	du.rmClass = function(el /*, ...classes */) {
		if (el.className)
			el.className = el.className.replace(new RegExp("\\b(" +
						Array.prototype.slice.call(arguments, 1).join("|").replace("\\", "\\\\") +
						")\\b", "g"), '');
	};

	if (typeof module !== 'undefined' && module !== null && module.exports)
		module.exports = du;
	else if (typeof define == 'function' && typeof define.amd == 'object')
		define(function(){ return du; });
	else
		window.du = du;
})(typeof window !== 'undefined' ? window : this);
