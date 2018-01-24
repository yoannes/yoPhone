// V 1.1


(function ( $ ) {
  $.fn.yoPhone = function(params) {
    var id = this.prop("id");

    if (params === "create")
      create(this, id);

    else if (params === "add")
      create(this, id);

    else if (params === "getAll")
      getAll(id);

    return this;
  };

  var yoCnt = {};

  var create = function (f, id) {
    yoCnt[id] = 0;

    console.log("create:", id);
    f.html(
      "<div id='yoPhoneBox-"+ id +"'></div>" +
      "<span id='yoPhoneAdd-"+ id +"' style='cursor: pointer'>"+ $.fn.yoPhone.set.lang.add[$.fn.yoPhone.set.locale] +"</span>"
    );

    add(id);

    $("#yoPhoneAdd-"+ id)
      .off("click")
      .on("click", function () {
        add(id);
      });


  };

  var add = function (id) {
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

  var getAll = function (id) {
    var ans = [];
    var masks = document.getElementsByClassName("yoPhone-mask");
    var numbers = document.getElementsByClassName("yoPhone-number");

    for (var i=0; i < masks.length; i++) {
      var mask = masks[i].value;
      var number = numbers[i].value.replace(/[^0-9]+/g, '');

      if (number && masks[i].dataset.id === id)
        ans.push([mask, number]);
    }

    console.log(ans);
  };

  $.fn.yoPhone.set = {
    locale: "en_us", // en_us, pt_br, ja
    lang: {
      home: {   en_us: "Home",   pt_br: "Casa",      ja: "自宅" },
      work: {   en_us: "Work",   pt_br: "Trabalho",  ja: "仕事" },
      mobile: { en_us: "Mobile", pt_br: "Celular",   ja: "携帯" },
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
