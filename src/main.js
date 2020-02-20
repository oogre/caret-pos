import * as CaretPos from './base.js';
import {
  getContent,
  checkTarget,
  isFunction
} from './utils';

class CaretUtil{
  constructor(){
    this.CaretPos = CaretPos;
    this.caret;
    this.target;
    this.startAt;
    this.stopAt;
  }
  _triggerCaretChange(event){
    this.caretChangeHandler.map(handler=>{
      handler(event);
    });
  }
  _triggerCaretOff(event){
    this.caretOffHandler.map(handler=>{
      handler(event);
    });
  }
  _triggerCaretOn(event){
    this.caretOnHandler.map(handler=>{
      handler(event);
    });
  }
  onCaretChange(fnc){
    if(!isFunction(fnc))throw new Error('onCaretChange must receive a function as parameter');
    this.caretChangeHandler.push(fnc);
  }
  onCaretOff(fnc){
    if(!isFunction(fnc))throw new Error('onCaretOff must receive a function as parameter');
    this.caretOffHandler.push(fnc);
  }
  onCaretOn(fnc){
    if(!isFunction(fnc))throw new Error('onCaretOn must receive a function as parameter');
    this.caretOnHandler.push(fnc);
  }
  forceSelection(first, last){
    if(this.target != null){
        var newSelection = this.target.childNodes[0];
        var selection = window.getSelection();
        var range = document.createRange();
        range.setStart(newSelection, first);
        range.setEnd(newSelection, last);
        selection.removeAllRanges();
        selection.addRange(range);
    }
  }
  disable(){
    if(this.target != null){
      this.target.removeEventListener('blur', this._autoDisableHandler, true);
      this._triggerCaretOff({
        type : 'CaretOff',
        target : this.target,
      });
    }
    this.target = null;
    this.startAt = null;
    this.stopAt = null;
  }
  _autoDisableHandler(){}
  enable(target){
    if(!(target instanceof Element))throw new Error('Caret must receive an Element as target');
    this.caret = this.CaretPos.caretPosition(target);
    let range = this.caret.get();
    if(isNaN(range.Start) || isNaN(range.End) || range.Start < 0 || range.End < 0)throw new Error('Troubble during Ranging');
    if(this.target != target){
      this._triggerCaretOn({
        type : 'CaretOn',
        target : target
      });
      let self = this;
      this._autoDisableHandler = function(){
        self.disable();
      };
      target.addEventListener('blur', this._autoDisableHandler, true);
    }

    this.target = target;
    this.startAt = range.Start;
    this.stopAt = range.End;
  }
  getTarget(){
    return this.target;
  }
  getSelectedText(){
    if(!this.target || this.startAt == this.stopAt)return null;
    let content = getContent(this.target);
    return content.substring(this.startAt, this.stopAt);
  }
  getCharBeforCaret(){
    if(!this.target || this.startAt<1)return null;
    let content = getContent(this.target);
    return content.charAt(this.startAt-1);
  }
}

export class Caret extends CaretUtil{
  constructor(target = document, initListener = true){
    super();
    this.caretChangeHandler = [];
    this.caretOffHandler = [];
    this.caretOnHandler = [];

    if(initListener){
      if ( document.readyState !== 'complete' ){
        window.onload = ()=>this._init(target);  
      }else{
        this._init(target);
      }
    }
  }
  _init(target){
    if(typeof target === 'string'){
      target = document.querySelectorAll(target);
    }
    let start = (target)=>{
      target.addEventListener('keyup', this._handleEvent.bind(this), true);
      target.addEventListener('mouseup', this._handleEvent.bind(this), true);
      target.addEventListener('selectionchange', this._handleEvent.bind(this), true);
    };
   
    if(target instanceof NodeList){
      target.forEach(start);
    }else if(target instanceof Element){
      start(target);
    }else if(target instanceof Document){
      start(target);
    }
  }

  _beforeHandleBlurEvent(){}
  _handleEvent(event){
    event.preventDefault();
    let target;
    if(false !== (target = checkTarget(event.target))){
      this.enable(target);
      
      
      this._triggerCaretChange({
        type : 'CaretChange',
        target : this.target,
        caret : this.caret,
        startAt : this.startAt, 
        stopAt : this.stopAt,
        content : getContent(this.target),
        selectedText : this.getSelectedText(),
        charBeforCaret : this.getCharBeforCaret()
      });
    }else{
      this.disable();
    }
    return true;
  }
}