(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('util')) :
	typeof define === 'function' && define.amd ? define(['exports', 'util'], factory) :
	(factory((global['caret-pos'] = {}),global.util));
}(this, (function (exports,util) { 'use strict';

util = util && util.hasOwnProperty('default') ? util['default'] : util;

var attributes = ['borderBottomWidth', 'borderLeftWidth', 'borderRightWidth', 'borderTopStyle', 'borderRightStyle', 'borderBottomStyle', 'borderLeftStyle', 'borderTopWidth', 'boxSizing', 'fontFamily', 'fontSize', 'fontWeight', 'height', 'letterSpacing', 'lineHeight', 'marginBottom', 'marginLeft', 'marginRight', 'marginTop', 'outlineWidth', 'overflow', 'overflowX', 'overflowY', 'paddingBottom', 'paddingLeft', 'paddingRight', 'paddingTop', 'textAlign', 'textOverflow', 'textTransform', 'whiteSpace', 'wordBreak', 'wordWrap'];

/**
 * Create a mirror
 *
 * @param {Element} element The element
 * @param {string} html The html
 *
 * @return {object} The mirror object
 */
var createMirror = function createMirror(element, html) {

  /**
   * The mirror element
   */
  var mirror = document.createElement('div');

  /**
   * Create the CSS for the mirror object
   *
   * @return {object} The style object
   */
  var mirrorCss = function mirrorCss() {
    var css = {
      position: 'absolute',
      left: -9999,
      top: 0,
      zIndex: -2000
    };

    if (element.tagName === 'TEXTAREA') {
      attributes.push('width');
    }

    attributes.forEach(function (attr) {
      css[attr] = getComputedStyle(element)[attr];
    });

    return css;
  };

  /**
   * Initialize the mirror
   *
   * @param {string} html The html
   *
   * @return {void}
   */
  var initialize = function initialize(html) {
    var styles = mirrorCss();
    Object.keys(styles).forEach(function (key) {
      mirror.style[key] = styles[key];
    });
    mirror.innerHTML = html;
    element.parentNode.insertBefore(mirror, element.nextSibling);
  };

  /**
   * Get the rect
   *
   * @return {Rect} The bounding rect
   */
  var rect = function rect() {
    var marker = mirror.ownerDocument.getElementById('caret-position-marker');
    var boundingRect = {
      left: marker.offsetLeft,
      top: marker.offsetTop,
      height: marker.offsetHeight
    };
    mirror.parentNode.removeChild(mirror);

    return boundingRect;
  };

  initialize(html);

  return {
    rect: rect
  };
};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

/**
 * A Javascript object to encode and/or decode html characters using HTML or Numeric entities that handles double or partial encoding
 * Author: R Reid
 * source: http://www.strictly-software.com/htmlencode
 * Licences: GPL, The MIT License (MIT)
 * Copyright: (c) 2011 Robert Reid - Strictly-Software.com
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * Revision:
 *  2011-07-14, Jacques-Yves Bleau: 
 *       - fixed conversion error with capitalized accentuated characters
 *       + converted arr1 and arr2 to object property to remove redundancy
 *
 * Revision:
 *  2011-11-10, Ce-Yi Hio: 
 *       - fixed conversion error with a number of capitalized entity characters
 *
 * Revision:
 *  2011-11-10, Rob Reid: 
 *		 - changed array format
 *
 * Revision:
 *  2012-09-23, Alex Oss: 
 *		 - replaced string concatonation in numEncode with string builder, push and join for peformance with ammendments by Rob Reid
 *
 * Revision:
 * 2013-01-21, Dan MacTough:
 * 		 - renamed Encoder to module.exports; fixed leaking global in htmlDecode
 */

// Encoder = {
var encoder = {

	// When encoding do we convert characters into html or numerical entities
	EncodeType : "entity",  // entity OR numerical

	isEmpty : function(val){
		if(val){
			return ((val===null) || val.length==0 || /^\s+$/.test(val));
		}else{
			return true;
		}
	},
	
	// arrays for conversion from HTML Entities to Numerical values
	arr1: ['&nbsp;','&iexcl;','&cent;','&pound;','&curren;','&yen;','&brvbar;','&sect;','&uml;','&copy;','&ordf;','&laquo;','&not;','&shy;','&reg;','&macr;','&deg;','&plusmn;','&sup2;','&sup3;','&acute;','&micro;','&para;','&middot;','&cedil;','&sup1;','&ordm;','&raquo;','&frac14;','&frac12;','&frac34;','&iquest;','&Agrave;','&Aacute;','&Acirc;','&Atilde;','&Auml;','&Aring;','&AElig;','&Ccedil;','&Egrave;','&Eacute;','&Ecirc;','&Euml;','&Igrave;','&Iacute;','&Icirc;','&Iuml;','&ETH;','&Ntilde;','&Ograve;','&Oacute;','&Ocirc;','&Otilde;','&Ouml;','&times;','&Oslash;','&Ugrave;','&Uacute;','&Ucirc;','&Uuml;','&Yacute;','&THORN;','&szlig;','&agrave;','&aacute;','&acirc;','&atilde;','&auml;','&aring;','&aelig;','&ccedil;','&egrave;','&eacute;','&ecirc;','&euml;','&igrave;','&iacute;','&icirc;','&iuml;','&eth;','&ntilde;','&ograve;','&oacute;','&ocirc;','&otilde;','&ouml;','&divide;','&oslash;','&ugrave;','&uacute;','&ucirc;','&uuml;','&yacute;','&thorn;','&yuml;','&quot;','&amp;','&lt;','&gt;','&OElig;','&oelig;','&Scaron;','&scaron;','&Yuml;','&circ;','&tilde;','&ensp;','&emsp;','&thinsp;','&zwnj;','&zwj;','&lrm;','&rlm;','&ndash;','&mdash;','&lsquo;','&rsquo;','&sbquo;','&ldquo;','&rdquo;','&bdquo;','&dagger;','&Dagger;','&permil;','&lsaquo;','&rsaquo;','&euro;','&fnof;','&Alpha;','&Beta;','&Gamma;','&Delta;','&Epsilon;','&Zeta;','&Eta;','&Theta;','&Iota;','&Kappa;','&Lambda;','&Mu;','&Nu;','&Xi;','&Omicron;','&Pi;','&Rho;','&Sigma;','&Tau;','&Upsilon;','&Phi;','&Chi;','&Psi;','&Omega;','&alpha;','&beta;','&gamma;','&delta;','&epsilon;','&zeta;','&eta;','&theta;','&iota;','&kappa;','&lambda;','&mu;','&nu;','&xi;','&omicron;','&pi;','&rho;','&sigmaf;','&sigma;','&tau;','&upsilon;','&phi;','&chi;','&psi;','&omega;','&thetasym;','&upsih;','&piv;','&bull;','&hellip;','&prime;','&Prime;','&oline;','&frasl;','&weierp;','&image;','&real;','&trade;','&alefsym;','&larr;','&uarr;','&rarr;','&darr;','&harr;','&crarr;','&lArr;','&uArr;','&rArr;','&dArr;','&hArr;','&forall;','&part;','&exist;','&empty;','&nabla;','&isin;','&notin;','&ni;','&prod;','&sum;','&minus;','&lowast;','&radic;','&prop;','&infin;','&ang;','&and;','&or;','&cap;','&cup;','&int;','&there4;','&sim;','&cong;','&asymp;','&ne;','&equiv;','&le;','&ge;','&sub;','&sup;','&nsub;','&sube;','&supe;','&oplus;','&otimes;','&perp;','&sdot;','&lceil;','&rceil;','&lfloor;','&rfloor;','&lang;','&rang;','&loz;','&spades;','&clubs;','&hearts;','&diams;'],
	arr2: ['&#160;','&#161;','&#162;','&#163;','&#164;','&#165;','&#166;','&#167;','&#168;','&#169;','&#170;','&#171;','&#172;','&#173;','&#174;','&#175;','&#176;','&#177;','&#178;','&#179;','&#180;','&#181;','&#182;','&#183;','&#184;','&#185;','&#186;','&#187;','&#188;','&#189;','&#190;','&#191;','&#192;','&#193;','&#194;','&#195;','&#196;','&#197;','&#198;','&#199;','&#200;','&#201;','&#202;','&#203;','&#204;','&#205;','&#206;','&#207;','&#208;','&#209;','&#210;','&#211;','&#212;','&#213;','&#214;','&#215;','&#216;','&#217;','&#218;','&#219;','&#220;','&#221;','&#222;','&#223;','&#224;','&#225;','&#226;','&#227;','&#228;','&#229;','&#230;','&#231;','&#232;','&#233;','&#234;','&#235;','&#236;','&#237;','&#238;','&#239;','&#240;','&#241;','&#242;','&#243;','&#244;','&#245;','&#246;','&#247;','&#248;','&#249;','&#250;','&#251;','&#252;','&#253;','&#254;','&#255;','&#34;','&#38;','&#60;','&#62;','&#338;','&#339;','&#352;','&#353;','&#376;','&#710;','&#732;','&#8194;','&#8195;','&#8201;','&#8204;','&#8205;','&#8206;','&#8207;','&#8211;','&#8212;','&#8216;','&#8217;','&#8218;','&#8220;','&#8221;','&#8222;','&#8224;','&#8225;','&#8240;','&#8249;','&#8250;','&#8364;','&#402;','&#913;','&#914;','&#915;','&#916;','&#917;','&#918;','&#919;','&#920;','&#921;','&#922;','&#923;','&#924;','&#925;','&#926;','&#927;','&#928;','&#929;','&#931;','&#932;','&#933;','&#934;','&#935;','&#936;','&#937;','&#945;','&#946;','&#947;','&#948;','&#949;','&#950;','&#951;','&#952;','&#953;','&#954;','&#955;','&#956;','&#957;','&#958;','&#959;','&#960;','&#961;','&#962;','&#963;','&#964;','&#965;','&#966;','&#967;','&#968;','&#969;','&#977;','&#978;','&#982;','&#8226;','&#8230;','&#8242;','&#8243;','&#8254;','&#8260;','&#8472;','&#8465;','&#8476;','&#8482;','&#8501;','&#8592;','&#8593;','&#8594;','&#8595;','&#8596;','&#8629;','&#8656;','&#8657;','&#8658;','&#8659;','&#8660;','&#8704;','&#8706;','&#8707;','&#8709;','&#8711;','&#8712;','&#8713;','&#8715;','&#8719;','&#8721;','&#8722;','&#8727;','&#8730;','&#8733;','&#8734;','&#8736;','&#8743;','&#8744;','&#8745;','&#8746;','&#8747;','&#8756;','&#8764;','&#8773;','&#8776;','&#8800;','&#8801;','&#8804;','&#8805;','&#8834;','&#8835;','&#8836;','&#8838;','&#8839;','&#8853;','&#8855;','&#8869;','&#8901;','&#8968;','&#8969;','&#8970;','&#8971;','&#9001;','&#9002;','&#9674;','&#9824;','&#9827;','&#9829;','&#9830;'],
		
	// Convert HTML entities into numerical entities
	HTML2Numerical : function(s){
		return this.swapArrayVals(s,this.arr1,this.arr2);
	},	

	// Convert Numerical entities into HTML entities
	NumericalToHTML : function(s){
		return this.swapArrayVals(s,this.arr2,this.arr1);
	},


	// Numerically encodes all unicode characters
	numEncode : function(s){ 
		if(this.isEmpty(s)) return ""; 

		var a = [],
			l = s.length; 
		
		for (var i=0;i<l;i++){ 
			var c = s.charAt(i); 
			if (c < " " || c > "~"){ 
				a.push("&#"); 
				a.push(c.charCodeAt()); //numeric value of code point 
				a.push(";"); 
			}else{ 
				a.push(c); 
			} 
		} 
		
		return a.join(""); 	
	}, 
	
	// HTML Decode numerical and HTML entities back to original values
	htmlDecode : function(s){

		var c,m,d = s;
		var arr;
		
		if(this.isEmpty(d)) return "";

		// convert HTML entites back to numerical entites first
		d = this.HTML2Numerical(d);
		
		// look for numerical entities &#34;
		arr=d.match(/&#[0-9]{1,5};/g);
		
		// if no matches found in string then skip
		if(arr!=null){
			for(var x=0;x<arr.length;x++){
				m = arr[x];
				c = m.substring(2,m.length-1); //get numeric part which is refernce to unicode character
				// if its a valid number we can decode
				if(c >= -32768 && c <= 65535){
					// decode every single match within string
					d = d.replace(m, String.fromCharCode(c));
				}else{
					d = d.replace(m, ""); //invalid so replace with nada
				}
			}			
		}

		return d;
	},		

	// encode an input string into either numerical or HTML entities
	htmlEncode : function(s,dbl){
			
		if(this.isEmpty(s)) return "";

		// do we allow double encoding? E.g will &amp; be turned into &amp;amp;
		dbl = dbl || false; //default to prevent double encoding
		
		// if allowing double encoding we do ampersands first
		if(dbl){
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}
		}

		// convert the xss chars to numerical entities ' " < >
		s = this.XSSEncode(s,false);
		
		if(this.EncodeType=="numerical" || !dbl){
			// Now call function that will convert any HTML entities to numerical codes
			s = this.HTML2Numerical(s);
		}

		// Now encode all chars above 127 e.g unicode
		s = this.numEncode(s);

		// now we know anything that needs to be encoded has been converted to numerical entities we
		// can encode any ampersands & that are not part of encoded entities
		// to handle the fact that I need to do a negative check and handle multiple ampersands &&&
		// I am going to use a placeholder

		// if we don't want double encoded entities we ignore the & in existing entities
		if(!dbl){
			s = s.replace(/&#/g,"##AMPHASH##");
		
			if(this.EncodeType=="numerical"){
				s = s.replace(/&/g, "&#38;");
			}else{
				s = s.replace(/&/g, "&amp;");
			}

			s = s.replace(/##AMPHASH##/g,"&#");
		}
		
		// replace any malformed entities
		s = s.replace(/&#\d*([^\d;]|$)/g, "$1");

		if(!dbl){
			// safety check to correct any double encoded &amp;
			s = this.correctEncoding(s);
		}

		// now do we need to convert our numerical encoded string into entities
		if(this.EncodeType=="entity"){
			s = this.NumericalToHTML(s);
		}

		return s;					
	},

	// Encodes the basic 4 characters used to malform HTML in XSS hacks
	XSSEncode : function(s,en){
		if(!this.isEmpty(s)){
			en = en || true;
			// do we convert to numerical or html entity?
			if(en){
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&quot;");
				s = s.replace(/</g,"&lt;");
				s = s.replace(/>/g,"&gt;");
			}else{
				s = s.replace(/\'/g,"&#39;"); //no HTML equivalent as &apos is not cross browser supported
				s = s.replace(/\"/g,"&#34;");
				s = s.replace(/</g,"&#60;");
				s = s.replace(/>/g,"&#62;");
			}
			return s;
		}else{
			return "";
		}
	},

	// returns true if a string contains html or numerical encoded entities
	hasEncoded : function(s){
		if(/&#[0-9]{1,5};/g.test(s)){
			return true;
		}else if(/&[A-Z]{2,6};/gi.test(s)){
			return true;
		}else{
			return false;
		}
	},

	// will remove any unicode characters
	stripUnicode : function(s){
		return s.replace(/[^\x20-\x7E]/g,"");
		
	},

	// corrects any double encoded &amp; entities e.g &amp;amp;
	correctEncoding : function(s){
		return s.replace(/(&amp;)(amp;)+/,"$1");
	},


	// Function to loop through an array swaping each item with the value from another array e.g swap HTML entities with Numericals
	swapArrayVals : function(s,arr1,arr2){
		if(this.isEmpty(s)) return "";
		var re;
		if(arr1 && arr2){
			//ShowDebug("in swapArrayVals arr1.length = " + arr1.length + " arr2.length = " + arr2.length)
			// array lengths must match
			if(arr1.length == arr2.length){
				for(var x=0,i=arr1.length;x<i;x++){
					re = new RegExp(arr1[x], 'g');
					s = s.replace(re,arr2[x]); //swap arr1 item with matching item from arr2	
				}
			}
		}
		return s;
	},

	inArray : function( item, arr ) {
		for ( var i = 0, x = arr.length; i < x; i++ ){
			if ( arr[i] === item ){
				return i;
			}
		}
		return -1;
	}

};

var htmlencode_1 = createCommonjsModule(function (module) {
/*!
 * node-htmlencode - Wrapped version of http://www.strictly-software.com/htmlencode
 * Copyright(c) 2013 Dan MacTough <danmactough@gmail.com>
 * All rights reserved.
 */

var extend = util._extend;

var Encoder = function (type) {
  if (type) this.EncodeType = type;
  return this;
};
extend(Encoder.prototype, encoder);

var it = new Encoder();

Object.defineProperty(module.exports, 'EncodeType', {
  enumerable: true,
  get: function () { return it.EncodeType; },
  set: function (val) { return it.EncodeType = val; }
});
[ 'HTML2Numerical',
  'NumericalToHTML',
  'numEncode',
  'htmlDecode',
  'htmlEncode',
  'XSSEncode',
  'hasEncoded',
  'stripUnicode',
  'correctEncoding'].forEach(function (method) {
  module.exports[method] = it[method].bind(it);
});
module.exports.Encoder = Encoder;
});

var htmlencode_2 = htmlencode_1.Encoder;

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();









var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

/**
 * Check if a DOM Element is content editable
 *
 * @param {Element} element  The DOM element
 *
 * @return {bool} If it is content editable
 */
var isContentEditable = function isContentEditable(element) {
  return !!(element.contentEditable && element.contentEditable === 'true');
};

/**
 * Get the context from settings passed in
 *
 * @param {object} settings The settings object
 *
 * @return {object} window and document
 */
var getContext = function getContext() {
  var settings = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var customPos = settings.customPos,
      iframe = settings.iframe,
      noShadowCaret = settings.noShadowCaret;

  if (iframe) {
    return {
      iframe: iframe,
      window: iframe.contentWindow,
      document: iframe.contentDocument || iframe.contentWindow.document,
      noShadowCaret: noShadowCaret,
      customPos: customPos
    };
  }

  return {
    window: window,
    document: document,
    noShadowCaret: noShadowCaret,
    customPos: customPos
  };
};

/**
 * Get the offset of an element
 *
 * @param {Element} element The DOM element
 * @param {object} ctx The context
 *
 * @return {object} top and left
 */
var getOffset = function getOffset(element, ctx) {
  var win = ctx && ctx.window || window;
  var doc = ctx && ctx.document || document;
  var rect = element.getBoundingClientRect();
  var docEl = doc.documentElement;
  var scrollLeft = win.pageXOffset || docEl.scrollLeft;
  var scrollTop = win.pageYOffset || docEl.scrollTop;

  return {
    top: rect.top + scrollTop,
    left: rect.left + scrollLeft
  };
};

/**
 * Check if a value is an object
 *
 * @param {any} value The value to check
 *
 * @return {bool} If it is an object
 */
var isObject = function isObject(value) {
  return (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && value !== null;
};

/**
 * Return contentEditable Parent
 *
 * @param {Element} element The DOM element
 *
 * @return {bool} If element is not a child of contentEditable
 * @return {Element} contentEditable
 */
var getContentEditableInParent = function getContentEditableInParent(element) {
  if (isContentEditable(element)) {
    return element;
  }
  if (element.parentElement) {
    return getContentEditableInParent(element.parentElement);
  }
  return false;
};

/**
 * Check if a DOM Element is an input field
 *
 * @param {Element} element  The DOM element
 *
 * @return {bool} If it is input or textarea
 */
var isInputField = function isInputField(element) {
  var nodeName = element.nodeName;
  return nodeName == 'TEXTAREA' || nodeName == 'INPUT';
};

/**
 * Check if a DOM Element is an input field or child of contentEditable
 *
 * @param {Element} element  The DOM element
 *
 * @return {bool} false it is not an input field nor a contentEditable child
 * @return {Element} input field or the contentEditable parent
 */
var checkTarget = function checkTarget(element) {
  if (!isInputField(element)) {
    element = getContentEditableInParent(element);
  }
  return element;
};

/**
 * Get the text content of a DOM Element or a NodeList 
 *
 * @param {Element} element The DOM element
 * @param {NodeList} elements The DOM element
 *
 * @return {string} the content text
 */
var getContent = function getContent(element) {
  if (element instanceof NodeList) [].slice.call(element).reduce(function (memo, e) {
    return memo += getContent(e);
  }, '');
  if (!(element instanceof Element)) return '';
  if (isInputField(element)) return element.value;
  return htmlencode_1.htmlDecode(element.innerText);
  //return Encoder.htmlDecode(element.innerHTML).replace(/(<([^>]+)>)/ig, ''); 
};

/**
 * Check if a value is a functio 
 *
 * @param {any} value The value to check
 *
 * @return {bool} If it is a function
 */
var isFunction = function isFunction(fnc) {
  return fnc && {}.toString.call(fnc) === '[object Function]';
};

/**
 * Create a Input caret object.
 *
 * @param {Element} element The element
 * @param {Object} ctx The context
 */
var createInputCaret = function createInputCaret(element, ctx) {

  /**
   * Get the current position
   *
   * @returns {int} The caret position
   */
  var getPos = function getPos() {
    return element.selectionStart;
  };

  var get = function get() {
    return {
      element: element,
      Start: element.selectionStart,
      End: element.selectionEnd
    };
  };

  /**
   * Set the position
   *
   * @param {int} pos The position
   *
   * @return {Element} The element
   */
  var setPos = function setPos(pos) {
    element.setSelectionRange(pos, pos);

    return element;
  };

  /**
   * The offset
   *
   * @param {int} pos The position
   *
   * @return {object} The offset
   */
  var getOffset$$1 = function getOffset$$1(pos) {
    var rect = getOffset(element);
    var position = getPosition(pos);

    return {
      top: rect.top + position.top + ctx.document.body.scrollTop,
      left: rect.left + position.left + ctx.document.body.scrollLeft,
      height: position.height
    };
  };

  /**
   * Get the current position
   *
   * @param {int} pos The position
   *
   * @return {object} The position
   */
  var getPosition = function getPosition(pos) {
    var format = function format(val) {
      var value = val.replace(/<|>|`|"|&/g, '?').replace(/\r\n|\r|\n/g, '<br/>');
      return value;
    };

    if (ctx.customPos || ctx.customPos === 0) {
      pos = ctx.customPos;
    }

    var position = pos === undefined ? getPos() : pos;
    var startRange = element.value.slice(0, position);
    var endRange = element.value.slice(position);
    var html = '<span style="position: relative; display: inline;">' + format(startRange) + '</span>';
    html += '<span id="caret-position-marker" style="position: relative; display: inline;">|</span>';
    html += '<span style="position: relative; display: inline;">' + format(endRange) + '</span>';

    var mirror = createMirror(element, html);
    var rect = mirror.rect();
    rect.pos = getPos();

    return rect;
  };

  return {
    get: get,
    getPos: getPos,
    setPos: setPos,
    getOffset: getOffset$$1,
    getPosition: getPosition
  };
};

/*
import {
  //getContentEditableInParent,
  //isContentEditable,
  //getContent
} from './utils';
*/
/**
 * Create an Editable Caret
 * @param {Element} element The editable element
 * @param {object|null} ctx The context
 *
 * @return {EditableCaret}
 */
var createEditableCaret = function createEditableCaret(element, ctx) {

  /**
   * Set the caret position
   *
   * @param {int} pos The position to se
   *
   * @return {Element} The element
   */
  var setPos = function setPos(pos) {
    var sel = ctx.window.getSelection();
    if (sel) {
      var offset = 0;
      var found = false;
      var find = function find(position, parent) {
        for (var i = 0; i < parent.childNodes.length; i++) {
          var node = parent.childNodes[i];
          if (found) {
            break;
          }
          if (node.nodeType === 3) {
            if (offset + node.length >= position) {
              found = true;
              var range = ctx.document.createRange();
              range.setStart(node, position - offset);
              sel.removeAllRanges();
              sel.addRange(range);
              break;
            } else {
              offset += node.length;
            }
          } else {
            find(pos, node);
          }
        }
      };
      find(pos, element);
    }

    return element;
  };

  /**
   * Get the offset
   *
   * @return {object} The offset
   */
  var getOffset = function getOffset() {
    var range = getRange();
    var offset = {
      height: 0,
      left: 0,
      right: 0
    };

    if (!range) {
      return offset;
    }

    var hasCustomPos = ctx.customPos || ctx.customPos === 0;

    // endContainer in Firefox would be the element at the start of
    // the line
    if (range.endOffset - 1 > 0 && range.endContainer !== element || hasCustomPos) {
      var clonedRange = range.cloneRange();
      var fixedPosition = hasCustomPos ? ctx.customPos : range.endOffset;
      clonedRange.setStart(range.endContainer, fixedPosition - 1 < 0 ? 0 : fixedPosition - 1);
      clonedRange.setEnd(range.endContainer, fixedPosition);
      var rect = clonedRange.getBoundingClientRect();
      offset = {
        height: rect.height,
        left: rect.left + rect.width,
        top: rect.top
      };
      clonedRange.detach();
    }

    if ((!offset || offset && offset.height === 0) && !ctx.noShadowCaret) {
      var _clonedRange = range.cloneRange();
      var shadowCaret = ctx.document.createTextNode('|');
      _clonedRange.insertNode(shadowCaret);
      _clonedRange.selectNode(shadowCaret);
      var _rect = _clonedRange.getBoundingClientRect();
      offset = {
        height: _rect.height,
        left: _rect.left,
        top: _rect.top
      };
      shadowCaret.parentNode.removeChild(shadowCaret);
      _clonedRange.detach();
    }

    if (offset) {
      var doc = ctx.document.documentElement;
      offset.top += ctx.window.pageYOffset - (doc.clientTop || 0);
      offset.left += ctx.window.pageXOffset - (doc.clientLeft || 0);
    }

    return offset;
  };

  /**
   * Get the position
   *
   * @return {object} The position
   */
  var getPosition = function getPosition() {
    var offset = getOffset();
    var pos = getPos();
    var rect = element.getBoundingClientRect();
    var inputOffset = {
      top: rect.top + ctx.document.body.scrollTop,
      left: rect.left + ctx.document.body.scrollLeft
    };
    offset.left -= inputOffset.left;
    offset.top -= inputOffset.top;
    offset.pos = pos;

    return offset;
  };

  /**
   * Get the caret range
   *
   * @return {Range|null}
   */
  var get = function get() {
    if (!ctx.window.getSelection) {
      return;
    }
    var sel = ctx.window.getSelection();
    if (sel.rangeCount > 0) {
      var range = sel.getRangeAt(0);

      //let e = range.startContainer;
      //let ce = getContentEditableInParent(e);
      //let all = getContent(ce);
      return {
        element: range.startContainer,
        Start: range.startOffset,
        End: range.endOffset
      };
    }
  };
  /**
   * Get the range
   *
   * @return {Range|null}
   */
  var getRange = function getRange() {
    if (!ctx.window.getSelection) {
      return;
    }
    var sel = ctx.window.getSelection();
    return sel.rangeCount > 0 ? sel.getRangeAt(0) : null;
  };

  /**
   * Get the caret position
   *
   * @return {int} The position
   */
  var getPos = function getPos() {
    var range = getRange();
    var clonedRange = range.cloneRange();
    clonedRange.selectNodeContents(element);
    clonedRange.setEnd(range.endContainer, range.endOffset);
    var pos = clonedRange.toString().length;
    clonedRange.detach();

    return pos;
  };

  return {
    get: get,
    getPos: getPos,
    setPos: setPos,
    getPosition: getPosition,
    getOffset: getOffset,
    getRange: getRange
  };
};

/*----------------------------------------*\
  bcksp.es - base.js
  @author Evrard Vincent (vincent@ogre.be)
  @Date:   2018-12-18 16:54:39
  @Last Modified time: 2018-12-18 16:54:50
\*----------------------------------------*/
var createCaret = function createCaret(element, ctx) {
  if (isContentEditable(element)) {
    return createEditableCaret(element, ctx);
  }

  return createInputCaret(element, ctx);
};

var position = function position(element, value) {
  var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var options = settings;
  if (isObject(value)) {
    options = value;
    value = null;
  }
  var ctx = getContext(options);
  var caret = createCaret(element, ctx);

  if (value || value === 0) {
    return caret.setPos(value);
  }

  return caret.getPosition();
};
var caretPosition = function caretPosition(element, value) {
  var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var options = settings;
  if (isObject(value)) {
    options = value;
    value = null;
  }
  var ctx = getContext(options);
  var caret = createCaret(element, ctx);

  return caret;
};

/**
 *
 * @param {Element} element The DOM element
 * @param {number|undefined} value The value to set
 * @param {object} settings Any settings for context
 */
var offset = function offset(element, value) {
  var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  var options = settings;
  if (isObject(value)) {
    options = value;
    value = null;
  }

  var ctx = getContext(options);
  var caret = createCaret(element, ctx);
  return caret.getOffset(value);
};

var CaretPos = Object.freeze({
	position: position,
	caretPosition: caretPosition,
	offset: offset,
	getOffset: getOffset
});

var CaretUtil = function () {
  function CaretUtil() {
    classCallCheck(this, CaretUtil);

    this.CaretPos = CaretPos;
    this.caret;
    this.target;
    this.startAt;
    this.stopAt;
  }

  createClass(CaretUtil, [{
    key: '_triggerCaretChange',
    value: function _triggerCaretChange(event) {
      this.caretChangeHandler.map(function (handler) {
        handler(event);
      });
    }
  }, {
    key: '_triggerCaretOff',
    value: function _triggerCaretOff(event) {
      this.caretOffHandler.map(function (handler) {
        handler(event);
      });
    }
  }, {
    key: '_triggerCaretOn',
    value: function _triggerCaretOn(event) {
      this.caretOnHandler.map(function (handler) {
        handler(event);
      });
    }
  }, {
    key: 'onCaretChange',
    value: function onCaretChange(fnc) {
      if (!isFunction(fnc)) throw new Error('onCaretChange must receive a function as parameter');
      this.caretChangeHandler.push(fnc);
    }
  }, {
    key: 'onCaretOff',
    value: function onCaretOff(fnc) {
      if (!isFunction(fnc)) throw new Error('onCaretOff must receive a function as parameter');
      this.caretOffHandler.push(fnc);
    }
  }, {
    key: 'onCaretOn',
    value: function onCaretOn(fnc) {
      if (!isFunction(fnc)) throw new Error('onCaretOn must receive a function as parameter');
      this.caretOnHandler.push(fnc);
    }
  }, {
    key: 'forceSelection',
    value: function forceSelection(target, first, last) {
      var newSelection = target.childNodes[0];
      var selection = window.getSelection();
      var range = document.createRange();
      range.setStart(newSelection, first);
      range.setEnd(newSelection, last);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, {
    key: 'disable',
    value: function disable() {
      if (this.target != null) {
        this.target.removeEventListener('blur', this._autoDisableHandler, true);
        this._triggerCaretOff({
          type: 'CaretOff',
          target: this.target
        });
      }
      this.target = null;
      this.startAt = null;
      this.stopAt = null;
    }
  }, {
    key: '_autoDisableHandler',
    value: function _autoDisableHandler() {}
  }, {
    key: 'enable',
    value: function enable(target) {
      if (!(target instanceof Element)) throw new Error('Caret must receive an Element as target');
      this.caret = this.CaretPos.caretPosition(target);
      var range = this.caret.get();
      if (isNaN(range.Start) || isNaN(range.End) || range.Start < 0 || range.End < 0) throw new Error('Troubble during Ranging');
      if (this.target != target) {
        this._triggerCaretOn({
          type: 'CaretOn',
          target: target
        });
        var self = this;
        this._autoDisableHandler = function () {
          self.disable();
        };
        target.addEventListener('blur', this._autoDisableHandler, true);
      }

      this.target = target;
      this.startAt = range.Start;
      this.stopAt = range.End;
    }
  }, {
    key: 'getTarget',
    value: function getTarget() {
      return this.target;
    }
  }, {
    key: 'getSelectedText',
    value: function getSelectedText() {
      if (!this.target || this.startAt == this.stopAt) return null;
      var content = getContent(this.target);
      return content.substring(this.startAt, this.stopAt);
    }
  }, {
    key: 'getCharBeforCaret',
    value: function getCharBeforCaret() {
      if (!this.target || this.startAt < 1) return null;
      var content = getContent(this.target);
      return content.charAt(this.startAt - 1);
    }
  }]);
  return CaretUtil;
}();

var Caret = function (_CaretUtil) {
  inherits(Caret, _CaretUtil);

  function Caret() {
    var target = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : document;
    var initListener = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;
    classCallCheck(this, Caret);

    var _this = possibleConstructorReturn(this, (Caret.__proto__ || Object.getPrototypeOf(Caret)).call(this));

    _this.caretChangeHandler = [];
    _this.caretOffHandler = [];
    _this.caretOnHandler = [];

    if (initListener) {
      if (document.readyState !== 'complete') {
        window.onload = function () {
          return _this._init(target);
        };
      } else {
        _this._init(target);
      }
    }
    return _this;
  }

  createClass(Caret, [{
    key: '_init',
    value: function _init(target) {
      var _this2 = this;

      if (typeof target === 'string') {
        target = document.querySelectorAll(target);
      }
      var start = function start(target) {
        target.addEventListener('keyup', _this2._handleEvent.bind(_this2), true);
        target.addEventListener('mouseup', _this2._handleEvent.bind(_this2), true);
        target.addEventListener('selectionchange', _this2._handleEvent.bind(_this2), true);
      };

      if (target instanceof NodeList) {
        target.forEach(start);
      } else if (target instanceof Element) {
        start(target);
      } else if (target instanceof Document) {
        start(target);
      }
    }
  }, {
    key: '_beforeHandleBlurEvent',
    value: function _beforeHandleBlurEvent() {}
  }, {
    key: '_handleEvent',
    value: function _handleEvent(event) {
      event.preventDefault();
      var target = void 0;
      if (false !== (target = checkTarget(event.target))) {
        this.enable(target);

        this._triggerCaretChange({
          type: 'CaretChange',
          target: this.target,
          caret: this.caret,
          startAt: this.startAt,
          stopAt: this.stopAt,
          content: getContent(this.target),
          selectedText: this.getSelectedText(),
          charBeforCaret: this.getCharBeforCaret()
        });
      } else {
        this.disable();
      }
      return true;
    }
  }]);
  return Caret;
}(CaretUtil);

exports.Caret = Caret;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=main.js.map
