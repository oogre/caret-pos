import Encoder from 'htmlencode';
/**
 * Check if a DOM Element is content editable
 *
 * @param {Element} element  The DOM element
 *
 * @return {bool} If it is content editable
 */
export const isContentEditable = (element) => !!(
  element.contentEditable &&
  element.contentEditable === 'true'
);

/**
 * Get the context from settings passed in
 *
 * @param {object} settings The settings object
 *
 * @return {object} window and document
 */
export const getContext = (settings = {}) => {
  const { customPos, iframe, noShadowCaret } = settings;
  if (iframe) {
    return {
      iframe,
      window: iframe.contentWindow,
      document: iframe.contentDocument || iframe.contentWindow.document,
      noShadowCaret,
      customPos,
    };
  }

  return {
    window,
    document,
    noShadowCaret,
    customPos,
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
export const getOffset = (element, ctx) => {
  const win = ctx && ctx.window || window;
  const doc = ctx && ctx.document || document;
  const rect = element.getBoundingClientRect();
  const docEl = doc.documentElement;
  const scrollLeft = win.pageXOffset || docEl.scrollLeft;
  const scrollTop = win.pageYOffset || docEl.scrollTop;

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
export const isObject = (value) => typeof value === 'object' && value !== null;


/**
 * Return contentEditable Parent
 *
 * @param {Element} element The DOM element
 *
 * @return {bool} If element is not a child of contentEditable
 * @return {Element} contentEditable
 */
export const getContentEditableInParent = (element) => {
  if(isContentEditable(element)){
    return element;
  }
  if(element.parentElement){
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
export const isInputField = (element) => {
  let nodeName = element.nodeName;
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
export const checkTarget = (element) => {
  if(!isInputField(element)){
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
export const getContent = (element) => {
  if(element instanceof NodeList) [].slice.call(element).reduce((memo, e) => memo += getContent(e), '');
  if(! (element instanceof Element)) return '';
  if(isInputField(element)) return element.value;
  return Encoder.htmlDecode(element.innerHTML).replace(/(<([^>]+)>)/ig, ''); 

};

/**
 * Check if a value is a functio 
 *
 * @param {any} value The value to check
 *
 * @return {bool} If it is a function
 */
export const isFunction = (fnc) => fnc && {}.toString.call(fnc) === '[object Function]';
