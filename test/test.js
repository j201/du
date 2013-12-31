describe('du', function() {
	it('should inherit properties from document', function() {
		assert(du.getElementsByAttribute === document.getElementsByAttribute);
		assert(du.body === document.body);
	});
});
