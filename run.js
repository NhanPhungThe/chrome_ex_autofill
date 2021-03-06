

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function isFunction(functionToCheck) {
 var getType = {};
 return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

function randomInt(min,max)
{
    var result = Math.floor((Math.random() * max) + min);
    return result;
}

var htmlInputTypes = {
  "color" : function(){
    return '#'+pad(Math.floor(Math.random()*16777215).toString(16), 6);
  },
  "date" : function(){
    var rndDate = randomDate(new Date(1977, 8, 1), new Date(2999, 8, 1));
    var result = [
      rndDate.getFullYear(),
      "-",
      pad(rndDate.getMonth() + 1, 2),
      "-",
      pad(rndDate.getDay() + 1, 2), 
    ].join('');
    return result;
  },
  "datetime-local" : "",
  "email" : "internet.email",
  "month" : function(){
    var rndDate = randomDate(new Date(1977, 8, 1), new Date(2999, 8, 1));
    var result = [
      rndDate.getFullYear(),
      "-",
      pad(rndDate.getMonth() + 1, 2)
    ].join('');
    return result;
  },
  "number" : "random.number",
  "range" : function(el){
    var minValue= parseInt($(el).prop('min'), 10);
    var maxValue = parseInt($(el).prop('max'), 10);
    return randomInt(minValue, maxValue);
  },
  "search" : "lorem.words",
  "tel" : "phone.phoneNumber",
  "url" : "internet.url",
  "week" : function(){
    var rndDate = randomDate(new Date(1977, 8, 1), new Date(2999, 8, 1));
    var onejan = new Date(rndDate.getFullYear(),0,1);
    var weeknumber = Math.ceil((((rndDate - onejan) / 86400000) + onejan.getDay()+1)/7);
    var result = rndDate.getFullYear() + "-W" + pad(weeknumber, 2);
    return result;
  },
  "radio" : selectRandomRadio,
  "checkbox" : function(el){
    var randomBoolean = Math.random() >= 0.5;
    $(el).attr("checked", randomBoolean);
  }
};

var fakerCultures = ["az", "cz", "de", "de_AT", "de_CH", "en", "en_AU", "en_BORK", "en_CA", "en_GB", "en_IE", "en_IND", "en_US", "en_au_ocker", "es", "es_MX", "fa", "fr", "fr_CA", "ge", "id_ID", "it", "ja", "ko", "nb_NO", "nep", "nl", "pl", "pt_BR", "ru", "sk", "sv", "tr", "uk", "vi", "zh_CN", "zh_TW"];


function selectRandomRadio(el){
  var groupName = $(el).attr("name");
  var radios = $("input:radio:enabled[name='" + groupName + "']");
  var idx = randomInt(0, radios.length - 1);
  $(radios[idx]).prop("checked", true);
}

var randomizeInputValue = function(el){
  if ($(el).length != 0){
    switch( $(el)[0].nodeName.toLowerCase() ) {
      case "input":
        var type = $(el).attr('type');
        var value = faker.lorem.word();
        var fakerMethod = htmlInputTypes[type];
        if (fakerMethod){
          if (isFunction(fakerMethod)){
            value = fakerMethod(el);
          } else {
            value = faker.fake("{{" + fakerMethod + "}}")
          }
        }
        $(el).focus().val(value);
        break;
      case "select":
        var opts = $(el)[0].options;
        var idx = randomInt(0, opts.length - 1);
        var val = opts[idx].value;
        $(el).focus().val(val);
        break; 
      case "textarea":
        $(el).focus().val(faker.lorem.sentences());
        break;
    }  
  }
};

chrome.extension.sendRequest({
  "action": "getOptions",
  "args": []
}, function (response) {

  let data = fileFillChromeExtensionSettings;
  let setting = deepAutofillChromeExtensionSettings;
  let resetMenu = reset;

  if (resetMenu) {
    localStorage.autoFill = 'true';
    localStorage.countProgessed = 0;
    localStorage.action = 1;
  }


  if (!setting.isAutoFill || localStorage.autoFill == 'false') {
    localStorage.autoFill == 'false'
    console.log('setting not file or old file is complete')
    return;
  }
  
  var _comma = data.indexOf(","), _b64 = data.substr(0, _comma).indexOf("base64") > -1;
  workbook = XLSX.read(data.substr(_comma + 1), { type: _b64 ? 'base64' : 'binary' });
  

  let sheetName = workbook.SheetNames[0]

  // Here is your object
  var XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
  let excelIndex = localStorage.countProgessed || 0
  let action = localStorage.action || 1;
  if (!XL_row_object) {
    return;
  }
  
  if (excelIndex >= XL_row_object.length) {
    localStorage.autoFill = 'false'
    return;
  }
  excelIndex = parseInt(`${excelIndex}`)
  
  setTimeout(function () {
    console.log(excelIndex+'/'+XL_row_object.length);
    if (action == 1) {
      $("#txtMaPhieuGui")[0].value = XL_row_object[excelIndex]["Number"]
      localStorage.action = 2;
      setTimeout(() => {
        $("#btnMaVach")[0].click();
      }, 200)
    }
    if (action == 2) {
      excelIndex++;
      localStorage.countProgessed = excelIndex;
      localStorage.action = 1;
      setTimeout(() => {
        console.log('submid')
        $("#btnMaVach")[0].click();
        // $(":submit")[0].click()
      }, 200)
    }
  }, 1000)

});  
