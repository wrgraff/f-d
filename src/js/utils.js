(function() {
	window.utils = {
		addElement: function(elTag, elClass) {
		    var element = document.createElement(elTag);
		    element.className = elClass;
		    return element;
		}
	};
})();
