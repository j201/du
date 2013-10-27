#du

### The DOM library for coders who don't need a DOM library.

`du` (**D**OM **U**tilities) is a simple, light library that makes common DOM manipulation tasks easy by providing cross-browser helper functions. It operates on native DOM objects and doesn't force you into any major changes from a vanilla JS approach.

`du` is still a work in progress with a very unstable API. Feel free to make comments and recommend changes at this time.

---

###Background

I started out in web development using vanilla DOM methods. It was useful to learn about things like w3c standards and cross-browser compatibility issues, but it was rather tedious dealing with those and the DOM API's wordiness. After a bit of searching I couldn't find a library I liked that both made using the DOM terse and simple and didn't force entirely new coding styles on me. So I decided to put together some of the utility functions I found useful to make a library that could make web programming quicker and easier without deviating from the way the DOM was meant to be used.

---

###API

First of all, `du` inherits from `document`, so the properties of `document` can be accessed as properties of `du`. For example, `du.body` is a quicker way of accessing `document.body`. (Note that modifying these properties will not modify the corresponding `document` properties.)

Note: `el` as a parameter means an HTMLElement.

**du.id(id)** - Equivalent to `document.getElementById(id)`  

**du.tag(tag)** - Equivalent to `document.getElementsByTagName(tag)`  
**du.tag(el, tag)** - Equivalent to `el.getElementsByTagName(tag)`

**du.className(className)** - Equivalent to `document.getElementsByClassName(className)`. `className` was used instead of `class` to avoid reserved word errors in IE8.  
**du.className(el, className)** - Equivalent to `document.getElementsByClassName(className)`

**du.query(selector)** - Equivalent to `document.querySelector(selector)`  
**du.query(el, selector)** - Equivalent to `document.querySelector(selector)`  
**du.queryAll(selector)** - Equivalent to `document.querySelectorAll(selector)`  
**du.queryAll(el, selector)** - Equivalent to `document.querySelectorAll(selector)`

**du.event(target, type, listener, [useCapture])** - Equivalent to `target.addEventListener(type, listener, useCapture)`. Note that `useCapture` will not do anything on browsers that don't support `addEventListener`.  
**du.rmEvent(target, type, listener, [useCapture])** - Equivalent to `target.removeEventListener(type, listener, useCapture)`

**du.load(listener)** - Equivalent to `document.addEventListener(window, "load", listener)`  
**du.click(target, listener)** - Equivalent to `target.addEventListener("click", listener)`

**du.clear(node)** - Removes all of the child nodes of a node.  
**du.setChild(node, child)** - Removes all the child nodes of a node and appends `child` to it.

**du.appendText(node, text)** - Appends the given text to `node`.
**du.setText(node, text)** - Removes all child text nodes from a node and appends the given text to it.

---

###Todo

- Moar functions, in particular AJAX and CSS handling
- Automated documentation
- Automated testing

---

###Compatibility

`du` is compatible with IE8 and newer (and Firefox and Chrome, of course).

---

©2013 j201. Released under the [MIT License](http://opensource.org/licenses/MIT).
