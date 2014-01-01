var testDivHTML;

describe('du', function() {
	before(function() {
		// Reset the test div if changed
		if (!testDivHTML)
			testDivHTML = document.getElementById('test').innerHTML;
		else
			document.getElementById('test').innerHTML = testDivHTML;
	});

	it('should inherit or have copied over the functions from document', function() {
		assert(du.getElementById('a') === document.getElementById('a'));
		// assert(du.body === document.body); // Note: this always fails on IE because IE expects non-function properties of document to stay on document.
	});
	
	describe('.toArray', function() {
		it('should convert an array-like to an array', function() {
			assert(Object.prototype.toString.call(du.toArray({length: 2, 0: 1, 1: 'b'})) === "[object Array]");
		});
	});
	describe('.each', function() {
		var str = "";
		var result = du.each({length: 2, 0: 'a', 1: 'b'}, function(el) { return str += el; });
		it('should iterate through an array-like', function() {
			assert(str === 'ab');
		});
		it('should return an array of results', function() {
			assert.deepEqual(result, ['a', 'ab']);
		});
	});
	describe('.id', function() {
		it('should be equivalent to document.getElementById', function() {
			assert(du.id('a') === document.getElementById('a'));
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
			assert(du.className('test-class')[1] === du.id('b'));
		});
		it('should work with elements too', function() {
			var a = du.id('a');
			assert(du.className(a, 'test-class')[0] === du.id('b'));
		});
	});
	describe('.qs', function() {
		it('should be equivalent to document.querySelector', function() {
			assert(du.qs('#b') === du.id('b'));
		});
		it('should work with elements too', function() {
			assert(du.qs(du.id('a'), '.test-class') === du.id('b'));
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
			assert(check === 'event dispatched');
		});
		it('should work on elements too', function() {
			var a = du.id('a');
			var check = 'event not dispatched';
			du.event(a, 'click', function() { check = 'event dispatched'; });
			a.click();
			assert(check === 'event dispatched');
		});
	});
	describe('.rmEvent', function() {
		it('should remove an attached event to window', function() {
			var check = 'event not dispatched';
			var listener = function() { check = 'event dispatched'; };
			du.event('click', listener);
			du.rmEvent('click', listener);
			document.body.click();
			assert(check === 'event not dispatched');
		});
		it('should work on elements too', function() {
			var a = du.id('a');
			var check = 'event not dispatched';
			var listener = function() { check = 'event dispatched'; };
			du.event('click', listener);
			du.rmEvent('click', listener);
			a.click();
			assert(check === 'event not dispatched');
		});
	});
	// TODO: add test for .load and .ready
	describe('.click', function() {
		it('should add a click event to window', function() {
			var check = 'event not dispatched';
			du.click(function() { check = 'event dispatched'; });
			document.body.click();
			assert(check === 'event dispatched');
		});
		it('should work on elements too', function() {
			var a = du.id('a');
			var check = 'event not dispatched';
			du.click(a, function() { check = 'event dispatched'; });
			a.click();
			assert(check === 'event dispatched');
		});
	});
	describe('.clear', function() {
		it('should remove all child nodes', function() {
			var div = du.id('clear-test');
			du.clear(div);
			assert(div.childNodes.length === 0);
		});
	});
	describe('.setChild', function() {
		it('should set the child of a node', function() {
			var div = du.id('setChild-test');
			du.setChild(div, document.createTextNode('test'));
			assert(div.innerHTML === 'test');
		});
	});
	describe('.textNode', function() {
		it('should be equivalent to document.createTextNode', function() {
			assert(du.textNode('foo').nodeValue === 'foo');
		});
	});
	describe('.prepend', function() {
		it('should prepend to a node', function() {
			var div = du.id('prepend-test');
			du.prepend(div, du.textNode('foo'));
			assert(div.innerHTML === 'foobar');
		});
	});
	describe('.append', function() {
		it('should append to a node', function() {
			var div = du.id('append-test');
			du.append(div, du.textNode('foo'));
			assert(div.innerHTML === 'barfoo');
		});
	});
	describe('.remove', function() {
		it('should remove a node', function() {
			du.remove(du.id('remove-test'));
			assert(du.id('remove-test') === null);
		});
	});
	describe('.insertAfter', function() {
		it('should insert a node after a reference node', function() {
			var div = du.id('insertAfter-test');
			var newDiv = du.textNode('');
			du.insertAfter(div, newDiv, du.id('insertAfter-ref'));
			assert(div.childNodes[1] === newDiv);
		});
	});
	describe('.setText', function() {
		it('should set the text of a node', function() {
			var div = du.id('setText-test');
			du.setText(div, "bar");
			assert(div.childNodes[1].nodeValue === 'bar');
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
	
	after(function() {
		document.getElementById('test').innerHTML = '';
	});
});
