var testDivHTML;

describe('du', function() {
	var assertEq = assert.strictEqual;

	before(function() {
		// Reset the test div if changed
		if (!testDivHTML)
			testDivHTML = document.getElementById('test').innerHTML;
		else
			document.getElementById('test').innerHTML = testDivHTML;
	});

	it('should inherit or have copied over the functions from document', function() {
		assertEq(du.getElementById('a'), document.getElementById('a'));
		// assertEq(du.body, document.body); // Note: this always fails on IE because IE expects non-function properties of document to stay on document.
	});
	
	describe('.toArray', function() {
		it('should convert an array-like to an array', function() {
			assertEq(Object.prototype.toString.call(du.toArray({length: 2, 0: 1, 1: 'b'})), "[object Array]");
		});
	});
	describe('.each', function() {
		var str = "";
		var result = du.each({length: 2, 0: 'a', 1: 'b'}, function(el) { return str += el; });
		it('should iterate through an array-like', function() {
			assertEq(str, 'ab');
		});
		it('should return an array of results', function() {
			assert.deepEqual(result, ['a', 'ab']);
		});
	});
	describe('.id', function() {
		it('should be equivalent to document.getElementById', function() {
			assertEq(du.id('a'), document.getElementById('a'));
		});
	});
	describe('.tag', function() {
		it('should be equivalent to document.getElementsByTagName', function() {
			assert.deepEqual(du.tag('div'), document.getElementsByTagName('div'));
		});
		it('should work with elements too', function() {
			var a = du.id('a');
			assert.deepEqual(du.tag(a, 'div'), a.getElementsByTagName('div'));
		});
	});
	describe('.className', function() {
		it('should be equivalent to document.getElementsByClassName', function() {
			assertEq(du.className('test-class')[1], du.id('b'));
		});
		it('should work with elements too', function() {
			var a = du.id('a');
			assertEq(du.className(a, 'test-class')[0], du.id('b'));
		});
	});
	describe('.qs', function() {
		it('should be equivalent to document.querySelector', function() {
			assertEq(du.qs('#b'), du.id('b'));
		});
		it('should work with elements too', function() {
			assertEq(du.qs(du.id('a'), '.test-class'), du.id('b'));
		});
	});
	describe('.qsa', function() {
		it('should be equivalent to document.querySelectorAll', function() {
			assert.deepEqual(du.qsa('.test-class'), document.querySelectorAll('.test-class'));
		});
		it('should work with elements too', function() {
			var a = du.id('a');
			assert.deepEqual(du.qsa(a, '.test-class'), a.querySelectorAll('.test-class'));
		});
	});
	describe('.event', function() {
		it('should attach an event to window', function() {
			var check = 'event not dispatched';
			du.event('click', function() { check = 'event dispatched'; });
			document.body.click();
			assertEq(check, 'event dispatched');
		});
		it('should work on elements too', function() {
			var a = du.id('a');
			var check = 'event not dispatched';
			du.event(a, 'click', function() { check = 'event dispatched'; });
			a.click();
			assertEq(check, 'event dispatched');
		});
	});
	describe('.rmEvent', function() {
		it('should remove an attached event to window', function() {
			var check = 'event not dispatched';
			var listener = function() { check = 'event dispatched'; };
			du.event('click', listener);
			du.rmEvent('click', listener);
			document.body.click();
			assertEq(check, 'event not dispatched');
		});
		it('should work on elements too', function() {
			var a = du.id('a');
			var check = 'event not dispatched';
			var listener = function() { check = 'event dispatched'; };
			du.event('click', listener);
			du.rmEvent('click', listener);
			a.click();
			assertEq(check, 'event not dispatched');
		});
	});
	// TODO: add test for .load and .ready
	describe('.click', function() {
		it('should add a click event to window', function() {
			var check = 'event not dispatched';
			du.click(function() { check = 'event dispatched'; });
			document.body.click();
			assertEq(check, 'event dispatched');
		});
		it('should work on elements too', function() {
			var a = du.id('a');
			var check = 'event not dispatched';
			du.click(a, function() { check = 'event dispatched'; });
			a.click();
			assertEq(check, 'event dispatched');
		});
	});
	describe('.clear', function() {
		it('should remove all child nodes', function() {
			var div = du.id('clear-test');
			du.clear(div);
			assertEq(div.childNodes.length, 0);
		});
	});
	describe('.setChild', function() {
		it('should set the child of a node', function() {
			var div = du.id('setChild-test');
			du.setChild(div, document.createTextNode('test'));
			assertEq(div.innerHTML, 'test');
		});
	});
	describe('.textNode', function() {
		it('should be equivalent to document.createTextNode', function() {
			assertEq(du.textNode('foo').nodeValue, 'foo');
		});
	});
	describe('.prepend', function() {
		it('should prepend to a node', function() {
			var div = du.id('prepend-test');
			du.prepend(div, du.textNode('foo'));
			assertEq(div.innerHTML, 'foobar');
		});
	});
	describe('.append', function() {
		it('should append to a node', function() {
			var div = du.id('append-test');
			du.append(div, du.textNode('foo'));
			assertEq(div.innerHTML, 'barfoo');
		});
	});
	describe('.remove', function() {
		it('should remove a node', function() {
			du.remove(du.id('remove-test'));
			assertEq(du.id('remove-test'), null);
		});
	});
	describe('.insertAfter', function() {
		it('should insert a node after a reference node', function() {
			var div = du.id('insertAfter-test');
			var newDiv = du.textNode('');
			du.insertAfter(div, newDiv, du.id('insertAfter-ref'));
			assertEq(div.childNodes[1], newDiv);
		});
	});
	describe('.setText', function() {
		it('should set the text of a node', function() {
			var div = du.id('setText-test');
			du.setText(div, "bar");
			assertEq(div.childNodes[1].nodeValue, 'bar');
		});
	});
	describe('.addClass', function() {
		it('should add a class to an element', function() {
			var div = du.id('class-test');
			du.addClass(div, 'bar');
			assert(/bar/.test(div.className));
		});
	});
	describe('.rmClass', function() {
		it('should remove a class from an element', function() {
			var div = du.id('class-test');
			du.rmClass(div, 'foo');
			assert(!/foo/.test(div.className));
		});
	});
	describe('.hasClass', function() {
		it('should return true if a class is present', function() {
			var div = du.id('class-test');
			div.className = ' foo  bar ';
			assert(du.hasClass(div, 'bar'));
		});
		it('should return false if a class is not present', function() {
			var div = du.id('class-test');
			div.className = ' foo  bar ';
			assert(!du.hasClass(div, 'baz'));
		});
	});
	// Note: getComputedStyle is quite complicated, and I'm mostly trusting the polyfill implementation I'm using
	describe('.getComputedStyle', function() {
		it('should get a computed property with .getPropertyValue', function() {
			var propertyValue = du.getComputedStyle(du.id("style-test")).getPropertyValue('width');
			assertEq(typeof propertyValue, 'string');
			assert(/px/.test(propertyValue));
			assert(parseInt(propertyValue) > 0);
		});
	});
	describe('.getStyle', function() {
		it('should get a computed style directly', function() {
			var div = du.id('style-test');
			assertEq(du.getStyle(div, 'width'), du.getComputedStyle(div).getPropertyValue('width'));
		});
		it('should work with camel-cased properties', function() {
			assertEq(du.getStyle(du.id('style-test'), 'maxWidth'), '1000px');
		});
	});
	describe('.setStyle', function() {
		it('should set a CSS style', function() {
			var div = du.id('style-test');
			var oldWidth = du.getStyle(div, 'width');
			du.setStyle(div, 'width', parseInt(oldWidth) * 2 + 'px');
			assertEq(du.getStyle(div, 'width'), parseInt(oldWidth) * 2 + 'px');
		});
		it('should work with hyphenated properties', function() {
			var div = du.id('style-test');
			du.setStyle(div, 'min-width', '2px');
			assertEq(du.getStyle(div, 'min-width'), '2px');
		});
	});
	
	after(function() {
		document.getElementById('test').innerHTML = '';
	});
});
