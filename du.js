/*
DOM Utils (du) JS Library
https://github.com/j201/du
©2013 j201
Licensed under the MIT Licence: http://opensource.org/licenses/MIT
*/
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
	var docFunctions = ["getElementsByAttribute", "getElementsByAttributeNS", "addBroadcastListenerFor", "removeBroadcastListenerFor", "persist", "getBoxObjectFor", "loadOverlay", "getElementsByTagName", "getElementsByTagNameNS", "getElementsByClassName", "getElementById", "createElement", "createElementNS", "createDocumentFragment", "createTextNode", "createComment", "createProcessingInstruction", "importNode", "adoptNode", "createEvent", "createRange", "createNodeIterator", "createTreeWalker", "createCDATASection", "createAttribute", "createAttributeNS", "hasFocus", "releaseCapture", "enableStyleSheetsForSet", "elementFromPoint", "caretPositionFromPoint", "querySelector", "querySelectorAll", "getAnonymousNodes", "getAnonymousElementByAttribute", "getBindingParent", "loadBindingDocument", "createExpression", "createNSResolver", "evaluate", "obsoleteSheet", "hasChildNodes", "insertBefore", "appendChild", "replaceChild", "removeChild", "normalize", "cloneNode", "isEqualNode", "compareDocumentPosition", "contains", "lookupPrefix", "lookupNamespaceURI", "isDefaultNamespace", "hasAttributes", "setUserData", "getUserData", "addEventListener", "removeEventListener", "dispatchEvent", "setEventHandler", "getEventHandler"];
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

	///// UTILITIES /////

	// Converts an arrayLike to an array
	du.toArray = function(arrayLike) {
		return Array.prototype.slice.call(arrayLike);
	};

	// More or less equivalent to Array#map but works on an array-like and iterates to the value of .length
	du.each = function(arrayLike, fn) {
		var result = [];
		for (var i = 0; i < arrayLike.length; i++) {
			result.push(fn(arrayLike[i], i, arrayLike));
		}
		return result;
	};

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
	du['class'] = du.className = function(elOrClassName, className) {
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
			var cancelBubble = false;
			var wrapper = function(e) {
				e.target=e.srcElement;
				e.currentTarget=self;
				e.stopPropagation = function() {
					cancelBubble = true;
				};
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
					var e = (document.createEvent || document.createEventObject)('DOMContentLoaded');
					e.srcElement=window;
					wrapper2(e);
				}
			} else {
				this.attachEvent("on"+type,wrapper);
				var manualBubble;
				if (this === window && eventBubbles(type)) { // attachEvent doesn't bubble to window, so we have to do it manually
					manualBubble = function(e) {
						if (!cancelBubble)
							wrapper(e);
					};
					document.attachEvent('on' + type, manualBubble);
				}
				eventListeners.push({object: this, type: type, listener: listener, wrapper: wrapper, manualBubble: manualBubble});
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
						if (eventListener.manualBubble)
							document.detachEvent("on" + type, eventListener.manualBubble);
					}
					break;
				}
				++counter;
			}
		};
		var nonBubblingEventTypes = {DOMNodeRemovedFromDocument: null, DOMNodeInsertedIntoDocument: null, load: null, unload: null, focus: null, blur: null, abort: null, error: null, mouseenter: null, mouseleave: null, resize: null, scroll: null};
		var eventBubbles = function(type) {
			return !(type in nonBubblingEventTypes);
		};
	}
	du.event = function(target, type, listener, useCapture) {
		// If a target isn't passed (that is, if the first argument is a string), run the event on window
		if (Object.prototype.toString.call(target) === '[object String]')
			return du.event(window, target, type, listener, useCapture);
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
		if (arguments.length < 2)
			du.event(window, "click", el);
		else
			du.event(el, "click", listener);
	};
	du.rmEvent = function(target, type, listener, useCapture) {
		if (Object.prototype.toString.call(target) === '[object String]')
			return du.rmEvent(window, target, type, listener, useCapture);
		if (Element.prototype.removeEventListener) {
			target.removeEventListener(type, listener, useCapture || false);
		} else {
			removeEventListener.call(target, type, listener);
		}
	};

	// Equivalent to the DOMContentLoaded event
	du.ready = function(listener) {
		du.event(window, "DOMContentLoaded", listener);
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
	du.prepend = function(node, child) {
		return node.insertBefore(child, node.firstChild);
	};
	// Equivalent to node.appendChild
	du.append = function(node, child) {
		return node.appendChild(child);
	};
	// Removes the given node
	du.remove = function(node) {
		return node.parentNode.removeChild(node);
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
		return du.appendText(node, text);
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

	du.hasClass = function(el, className) {
		var splitClassName = el.className.split(' ');
		for (var i = 0; i < splitClassName.length; i++)
			if (splitClassName[i] === className)
				return true;
		return false;
	};

	// Adapted from https://github.com/jonathantneal/polyfill/
	function getComputedStylePixel(element, property, fontSize) {
		element.document; // Internet Explorer sometimes struggles to read currentStyle until the element's document is accessed.

		var
		value = element.currentStyle[property].match(/([\d\.]+)(%|cm|em|in|mm|pc|pt|)/) || [0, 0, ''],
		size = value[1],
		suffix = value[2],
		rootSize;

		fontSize = !fontSize ? fontSize : /%|em/.test(suffix) && element.parentElement ? getComputedStylePixel(element.parentElement, 'fontSize', null) : 16;
		rootSize = property == 'fontSize' ? fontSize : /width/i.test(property) ? element.clientWidth : element.clientHeight;

		return suffix == '%' ? size / 100 * rootSize :
			suffix == 'cm' ? size * 0.3937 * 96 :
			suffix == 'em' ? size * fontSize :
			suffix == 'in' ? size * 96 :
			suffix == 'mm' ? size * 0.3937 * 96 / 10 :
			suffix == 'pc' ? size * 12 * 96 / 72 :
			suffix == 'pt' ? size * 96 / 72 :
			size;
	}

	function setShortStyleProperty(style, property) {
		var
		borderSuffix = property == 'border' ? 'Width' : '',
		t = property + 'Top' + borderSuffix,
		r = property + 'Right' + borderSuffix,
		b = property + 'Bottom' + borderSuffix,
		l = property + 'Left' + borderSuffix;

		style[property] = (style[t] == style[r] && style[t] == style[b] && style[t] == style[l] ? [ style[t] ] :
						   style[t] == style[b] && style[l] == style[r] ? [ style[t], style[r] ] :
						   style[l] == style[r] ? [ style[t], style[r], style[b] ] :
						   [ style[t], style[r], style[b], style[l] ]).join(' ');
	}

	// <CSSStyleDeclaration>
	function CSSStyleDeclaration(element) {
		var
		style = this,
		currentStyle = element.currentStyle,
		fontSize = getComputedStylePixel(element, 'fontSize'),
		unCamelCase = function (match) {
			return '-' + match.toLowerCase();
		},
		property;

		for (property in currentStyle) {
			Array.prototype.push.call(style, property == 'styleFloat' ? 'float' : property.replace(/[A-Z]/, unCamelCase));

			if (property == 'width') {
				style[property] = element.offsetWidth + 'px';
			} else if (property == 'height') {
				style[property] = element.offsetHeight + 'px';
			} else if (property == 'styleFloat') {
				style.float = currentStyle[property];
			} else if (/margin.|padding.|border.+W/.test(property) && style[property] != 'auto') {
				style[property] = Math.round(getComputedStylePixel(element, property, fontSize)) + 'px';
			} else if (/^outline/.test(property)) {
				// errors on checking outline
				try {
					style[property] = currentStyle[property];
				} catch (error) {
					style.outlineColor = currentStyle.color;
					style.outlineStyle = style.outlineStyle || 'none';
					style.outlineWidth = style.outlineWidth || '0px';
					style.outline = [style.outlineColor, style.outlineWidth, style.outlineStyle].join(' ');
				}
			} else {
				style[property] = currentStyle[property];
			}
		}

		setShortStyleProperty(style, 'margin');
		setShortStyleProperty(style, 'padding');
		setShortStyleProperty(style, 'border');

		style.fontSize = Math.round(fontSize) + 'px';
	}

	CSSStyleDeclaration.prototype = {
		constructor: CSSStyleDeclaration,
		// <CSSStyleDeclaration>.getPropertyPriority
		getPropertyPriority: function () {
			throw new Error('NotSupportedError: DOM Exception 9');
		},
		// <CSSStyleDeclaration>.getPropertyValue
		getPropertyValue: function (property) {
			return this[property.replace(/-\w/g, function (match) {
				return match[1].toUpperCase();
			})];
		},
		// <CSSStyleDeclaration>.item
		item: function (index) {
			return this[index];
		},
		// <CSSStyleDeclaration>.removeProperty
		removeProperty: function () {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		// <CSSStyleDeclaration>.setProperty
		setProperty: function () {
			throw new Error('NoModificationAllowedError: DOM Exception 7');
		},
		// <CSSStyleDeclaration>.getPropertyCSSValue
		getPropertyCSSValue: function () {
			throw new Error('NotSupportedError: DOM Exception 9');
		}
	};

	// Equivalent to window.getComputedStyle
	du.getComputedStyle = function (el) {
		return window.getComputedStyle ? 
			window.getComputedStyle(el) :
			new CSSStyleDeclaration(el);
	};

	// Gets the computed value of a CSS style property, accepting camel-cased names
	du.getStyle = function(el, style) {
		return du.getComputedStyle(el).getPropertyValue(style.replace(/[A-Z]/g, function(c) { return '-' + c.toLowerCase(); }));
	};

	// Sets the value of a CSS style property, accepting hyphenated names
	du.setStyle = function(el, style, val) {
		style = style.replace(/-(\w)/g, function(_, grp) { return grp.toUpperCase(); });
		el.style[style] = val;
	};

	if (typeof module !== 'undefined' && module !== null && module.exports)
		module.exports = du;
	else if (typeof define == 'function' && typeof define.amd == 'object')
		define(function(){ return du; });
	else
		window.du = du;
})(typeof window !== 'undefined' ? window : this);
