// V 1.3


(function ( $ ) {
  var id = null;

  $.fn.yoPhone = function(params, val) {
    id = this.prop("id");

    console.log("params", params);

    if (params === "create")
      create(this, val);

    else if (params === "getAll")
      return getAll();

    else if (params.constructor === Array)
      loopArrayToAdd(params);


    return this;
  };

  var yoCnt = {};

  var create = function (f, val) {
    yoCnt[id] = 0;

    console.log("create:", id);
    f.html(
      "<div id='yoPhoneBox-"+ id +"'></div>" +
      "<span id='yoPhoneAdd-"+ id +"' style='cursor: pointer'>"+ $.fn.yoPhone.set.lang.add[$.fn.yoPhone.set.locale] +"</span>"
    );


    if (val && val.constructor === Array)
      loopArrayToAdd(val);

    else
      add();


    $("#yoPhoneAdd-"+ id)
      .off("click")
      .on("click", function () {
        add();
      });


  };

  var loopArrayToAdd = function (arr) {
    for (var i=0; i < arr.length; i++) {
      if (arr[i].length < 2)
        continue;

      var mask = arr[i][0];
      var number = arr[i][1];

      add(mask, number);
    }
  };

  var add = function (mask, number) {
    var locale = $.fn.yoPhone.set.locale;
    var lang = $.fn.yoPhone.set.lang;

    $("#yoPhoneBox-"+ id).append(
      "<table style='width: 100%' class='yoPhone-row' id='yoPhoneRow-"+ id + yoCnt[id] +"'>" +
        "<tr>" +
          "<td class='yoPhone-mask-size'>" +
            "<select id='yoPhoneMask-"+ id + yoCnt[id] +"' data-id='"+ id +"' class='form-control yoPhone-mask'>" +
              "<option value='mobile'>"+ lang.mobile[locale] +"</option>" +
              "<option value='work'>"+ lang.work[locale] +"</option>" +
              "<option value='home'>"+ lang.home[locale] +"</option>" +
              "<option value='fax'>"+ lang.fax[locale] +"</option>" +
            "</select>" +
          "</td>" +
          "<td class='yoPhone-number-size'>" +
            "<input type='text' id='yoPhoneNumber-"+ id + yoCnt[id] +"' data-id='"+ id +"' class='form-control yoPhone-number' />" +
          "</td>" +
          "<td class='yoPhone-btn-del-size'>" +
            "<button type='button' id='yoPhoneDel-"+ id + yoCnt[id] +"' data-id='"+ id +"' data-i='"+ yoCnt[id] +"' class='btn btn-danger yoPhone-btn-del'><i class='fas fa-times'></i></button>" +
          "</td>" +
        "</tr>" +
      "</table>"
    );

    if (mask && number){
      $("#yoPhoneMask-"+ id + yoCnt[id]).val(mask);
      $("#yoPhoneNumber-"+ id + yoCnt[id]).val(number);
    }


    $("#yoPhoneDel-"+ id + yoCnt[id])
      .off("click")
      .on("click", function () {
        var data = $(this).data();
        $("#yoPhoneRow-"+ data.id + data.i).remove();
      });

    if ($.fn.yoPhone.set.mask === "sp"){
      var maskBehavior = function (val) {
        return val.replace(/\D/g, '').length === 11 ? '(00) 0.0000-0000' : '(00) 0000-00009';
      };
      var options = {
        onKeyPress: function(val, e, field, options) {
          field.mask(maskBehavior.apply({}, arguments), options);
        }
      };

      $("#yoPhoneNumber-"+ id + yoCnt[id]).mask(maskBehavior, options);
    }
    else{
      $("#yoPhoneNumber-"+ id + yoCnt[id]).mask($.fn.yoPhone.set.mask);
    }

    yoCnt[id] += 1;
  };

  var getAll = function () {
    var ans = [];
    var masks = document.getElementsByClassName("yoPhone-mask");
    var numbers = document.getElementsByClassName("yoPhone-number");

    for (var i=0; i < masks.length; i++) {
      var mask = masks[i].value;
      var number = numbers[i].value.replace(/[^0-9]+/g, '');

      if (number && masks[i].dataset.id === id)
        ans.push([mask, number]);
    }

    return ans;
  };

  $.fn.yoPhone.set = {
    locale: "en_us", // en_us, pt_br, ja
    lang: {
      home: {   en_us: "Home",   pt_br: "Casa",      ja: "自宅" },
      work: {   en_us: "Work",   pt_br: "Trabalho",  ja: "仕事" },
      mobile: { en_us: "Mobile", pt_br: "Celular",   ja: "携帯" },
      fax: {    en_us: "Fax",    pt_br: "Fax",       ja: "ファックス" },
      add: {    en_us: "Add",    pt_br: "Adicionar", ja: "追加" },
    },
    mask: "sp"
  };

}( jQuery ));

var yoPhone = {
  setLocale: function (val) {
    $.fn.yoPhone.set.locale = val;
  },
  setMask: function (val) {
    $.fn.yoPhone.set.mask = val;
  }
};
