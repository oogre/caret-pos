import * as CaretPos from './base.js';

class Util{
  static getContentEditableInParent(element){
    if(element.hasAttribute('contenteditable')){
      return element;
    }
    if(element.parentElement){
      return Util.getContentEditableInParent(element.parentElement);  
    }
    return false;
  }
  static isInputField(element){
    let nodeName = element.nodeName;
    return nodeName == 'TEXTAREA' || nodeName == 'INPUT';
  }
  static checkTarget(target){
    if(!Util.isInputField(target)){
      target = Util.getContentEditableInParent(target);
    }
    return target;
  }
  static getContent(target){
    return target.value || target.innerText;
  }
}

class CaretUtil extends Util{
  constructor(){
    super();
    this.CaretPos = CaretPos;
    this.caret;
    this.target;
    this.startAt;
    this.stopAt;
  }
  disable(){
    this.target = null;
    this.startAt = null;
    this.stopAt = null;
  }
  enable(target){
    if(!(target instanceof Element))throw new Error('Caret must receive an Element as target');
    this.caret = this.CaretPos.caretPosition(target);
    let range = this.caret.get();
    if(    isNaN(range.Start)
      || isNaN(range.End)
      || range.Start < 0
      || range.End < 0
    ){
      throw new Error('Troubble during Ranging');
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
    let content = Util.getContent(this.target);
    return content.substring(this.startAt, this.stopAt);
  }
  getCharBeforCaret(){
    if(!this.target || this.startAt<1)return null;
    let content = Util.getContent(this.target);
    return content.charAt(this.startAt-1);
  }
}

export class Caret extends CaretUtil{
  constructor(target = document){
    super();
    window.onload = ()=>{
      if(typeof target === 'string'){
        target = document.querySelectorAll(target);
      }
      let start = (target)=>{
        target.addEventListener('keyup', this._handleEvent.bind(this));
        target.addEventListener('mouseup', this._handleEvent.bind(this));  
      };
      if(target instanceof NodeList){
        target.forEach(start);
      }else if(target instanceof Element){
        start(target);
      }else if(target instanceof Document){
        start(target);
      }
    };
    this.caretChangeHandler = [];
  }
  _handleEvent(event){
    let target;
    if(false !== (target = CaretUtil.checkTarget(event.target))){
      this.enable(target);
      this._triggerCaretChange({
        target : this.target,
        caret : this.caret,
        selectedText : this.getSelectedText(),
        charBeforCaret : this.getCharBeforCaret()
      });
    }else{
      this.disable();
    }
  }
  _triggerCaretChange(event){
    this.caretChangeHandler.map(handler=>{
      handler(event);
    });
  }
  onCaretChange(fnc){
    if(fnc && {}.toString.call(fnc) === '[object Function]'){
      this.caretChangeHandler.push(fnc);
    }
  }
}