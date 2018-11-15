import React from 'react';
import ReactDOMServer from "react-dom/server";

export class YoPhone {
  constructor(p) {
    if (!p) {
      console.log("No params.");
      return;
    }

    if (!p.e) {
      console.log("No element.");
      return;
    }

    this.e = document.querySelector(p.e);
    this.id = `yoPhone_${p.e.substr(1, p.e.length)}`;
    this.i = 0;
            
    this.locale = "en_us";
    
    this.masks = [
      ["HOME", "home"],
      ["WORK", "work"],
      ["MOBILE", "mobile"],
      ["FAX", "fax"],
      ["OTHER", "other"],
    ];

    this.defaultMask = "MOBILE";

    this.lang = {
      home: {   en_us: "Home",   pt_br: "Casa",      ja: "自宅" },
      work: {   en_us: "Work",   pt_br: "Trabalho",  ja: "仕事" },
      mobile: { en_us: "Mobile", pt_br: "Celular",   ja: "携帯" },
      fax: {    en_us: "Fax",    pt_br: "Fax",       ja: "ファックス" },
      other: {  en_us: "Other",  pt_br: "Outro",     ja: "Other" },
      add: {    en_us: "Add",    pt_br: "Adicionar", ja: "追加" },
    };

    if (p.locale) {
      this.locale = p.locale;
    }

    if (p.masks) {
      this.masks = p.masks;
    }

    if (p.defaultMask) {
      this.defaultMask = p.defaultMask;
    }

    if (p.onAdded) {
      this.onAdded = p.onAdded;
    }

    this.e.innerHTML = ReactDOMServer.renderToString(
      <div style={{width: "100%"}}>
        <div id={`${this.id}_numbers`} />
        <span style={{cursor: "pointer"}} id={`${this.id}_add`}>{this.lang.add[this.locale]}</span>
      </div>
    );
    
    if (p.numbers) {
      for (let i = 0; i < p.numbers.length; i++) {
        let v = p.numbers[i];
        this._create(v);
      }
    }
    else {
      this._create();
    }

    let that = this;
    document.getElementById(`${this.id}_add`).addEventListener('click', function() {      
      that._create();
    }, false);
    
  }

  getNumbers() {
    let masks = document.querySelectorAll(`.${this.id}_masks`);
    let numbers = document.querySelectorAll(`.${this.id}_numbers`);
    let ans = [];
    
    for (let i = 0; i < masks.length; i++) {
      let mask = masks[i].value;
      let number = numbers[i].value.replace(/[^0-9.]/g, "");
      if (number) {
        ans.push([mask, number]);
      }        
    }

    return ans;
  }
  
  _create(val) {
    let id = `${this.id}_${this.i}_`;
    let borderRight = {
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      WebkitBorderTopRightRadius: 0,
      WebkitBorderBottomRightRadius: 0,
      WebkitAppearance: "none",
      MozkitAppearance: "none",
    };

    let borderNone = {
      borderRadius: 0,
      marginLeft: "-3px",
    };

    let borderLeft = {
      borderTopLeftRadius: "0px",
      borderBottomLeftRadius: "0px",
      marginLeft: "-6px"
    };

    document.getElementById(`${this.id}_numbers`).innerHTML += ReactDOMServer.renderToString(
      <table id={id + "box"} style={{width: "100%"}} data-id={this.id} data-i={this.i}>
        <tbody>
          <tr>
            <td style={{width: "100px"}}><select id={id + 'mask'} className={`form-control ${this.id}_masks`} style={borderRight} /></td>
            <td><input type="text" id={id + "number"} className={`form-control yoPhoneNumbers ${this.id}_numbers`} style={borderNone} defaultValue={val ? val[1] : ''} /></td>
            <td className={`${this.id}_del`}><button type="button" className={`btn btn-danger`} style={borderLeft}><i className="fas fa-times" /></button></td>
          </tr>
        </tbody>
      </table>
    );

    document.getElementById(id + "box").yo = this;

    let masksOptions = '';
    for (let i = 0; i < this.masks.length; i++) {
      let sel = '';
      if (val && this.masks[i][0] === val[0]) {
        sel = 'selected';
      }
      else if (!val && this.masks[i][0] == this.defaultMask) {
        sel = 'selected';
      }
      masksOptions += `<option value="${this.masks[i][0]}" ${sel}>${this.lang[this.masks[i][1]][this.locale]}</option>`;
    }
    
    document.getElementById(id + 'mask').innerHTML = masksOptions;

    let del = document.querySelectorAll(`.${this.id}_del`);
    for (let i = 0; i < del.length; i++) {            
      del[i].addEventListener('click', this._del, false);
    }

    if (this.onAdded) {      
      this.onAdded();
    }
    
    this.i++;
  }

  _del(evt) {
    let el = evt.target || evt.srcElement;

    while(el.nodeName !== "TABLE") {
      el = el.parentNode;
    }    
        
    el.outerHTML = "";
  }
}