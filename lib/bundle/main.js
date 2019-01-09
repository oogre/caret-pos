(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global['caret-pos'] = {})));
}(this, (function (exports) { 'use strict';

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
  return element.innerHTML.replace(/(<([^>]+)>)/ig, '');
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
