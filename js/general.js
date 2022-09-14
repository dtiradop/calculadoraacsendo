var comercial_info = [];
var id_com = 0;
 $(document).ready(function () {
  var comercials = firebase.database().ref('comercials/totals');
  comercials.once('value', function(snapshot) {
      var comercial = snapshot.val();
      get_comercials(comercial)
  });

  $("#boxkey").change(function () {
    $(".button-newnr").css("display", "block");
  });
  $("#boxagi").change(function () {
    $(".button-newnr").css("display", "block");
  });
  $("#boxins").change(function () {
    $(".button-newnr").css("display", "block");
  });
  $("#boxeng").change(function () {
    $(".button-newnr").css("display", "block");
  });

  $(".button-newnr").click(function () {
    $(".add-nr").css("display", "block");
  });

  $("#boxconfeedback").change(function () {
    $("#consultoria").css("display", "block");
  });
  $("#boxseleccion").change(function () {
    $("#reclutamiento").css("display", "block");
  });
  $("#calcular").click(function () {
    json = [];
    var nr = $(".nr").val();
    get_prices(nr);
  });
});

function get_comercials(comercials) {
    comercial_info = comercials;
    for (var p = 0; p < comercials.length; p++) {
        $("#comercial").append('<option value="' + p + '">' + comercials[p].name + '</option>');
        console.log(comercial_info)
    }
}
function get_prices(nr) {
  var rangos = firebase.database().ref("rangos");
  rangos.once("value", function (snapshot) {
    var rangos2 = snapshot.val();
    var rango_nr;
    for (var i = 0; i < rangos2.length; i++) {
      if (nr >= rangos2[i].min && nr <= rangos2[i].max) {
        rango_nr = i;
      }
    }

    var prices = firebase.database().ref("price");
    prices.once("value", function (snapshot) {
      var prices2 = snapshot.val();
      var prices_array = prices2;
      var types_array = Object.keys(prices2);
      console.log(prices2);
      for (var t = 0; t < types_array.length; t++) {
        for (var i = 0; i < rangos2.length; i++) {
          if (i < 1) {
            prices_array[types_array[t]][i] = {
              valor: prices_array[types_array[t]][i]["valor"],
            };
            var value = prices_array[types_array[t]][i].valor * 1;
            prices_array[types_array[t]][i].valorConverted = value;
          } else if (i > 0 && i < 15) {
            prices_array[types_array[t]][i] = {
              valor:
                prices_array[types_array[t]][i - 1]["valor"] -
                prices_array[types_array[t]][i - 1]["valor"] * 0.04,
            };

            var value = prices_array[types_array[t]][i].valor * 1;
            prices_array[types_array[t]][i].valorConverted = value;
          } else if (i > 14) {
            prices_array[types_array[t]][i] = {
              valor:
                prices_array[types_array[t]][i - 1]["valor"] -
                prices_array[types_array[t]][i - 1]["valor"] * 0.07,
            };
            var value = prices_array[types_array[t]][i].valor * 1;
            prices_array[types_array[t]][i].valorConverted = value;
          }
        }
      }

      var previous_price = 0;
      var previous_price_key = 0;
      var price_final = 0;
      var price_and_okr = 0;
      var price_and_pid = 0;
      var price_and_plan = 0;
      var price_and_clima = 0;
      var pricekey = 0;
      var pricepkey = 0;
      var price_and_consultoria = 0;
      var reclutamiento = 0;
      var price_and_metas = 0;
      var price_and_compe = 0;
      var price_and_reco = 0;
      var price_and_nom = 0;
      var price_and_encu = 0;
      var price_and_feedback = 0;
      var priceagile = 0;
      var priceng= 0;
      var priceins= 0;

      if (rango_nr > 0) {
        var price = prices_array["key"][0].valor * 300;
        var new_nr = nr - 300;
        for (let j = 1; j <= rango_nr; j++) {
          if (new_nr >= 50) {
            previous_price_key =
              previous_price_key + 50 * prices_array["key"][j].valor;
            pricekey = price + previous_price_key;
            new_nr = new_nr - 50;
          } else {
            previous_price_key =
              previous_price_key + new_nr * prices_array["key"][j].valor;
            pricekey = price + previous_price_key;
          }
        }
      } else {
        var pricekey1 = prices_array["key"][0].valor * nr;
        if (nr <= 100) {
          pricekey = pricekey1 * 0.35 + pricekey1;
        } else if (nr > 100 && nr <= 200) {
          pricekey = pricekey1 * 0.2 + pricekey1;
        } else {
          pricekey = pricekey1;
        }
      }
      if ($("#chile").is(":checked")) {
        pricekey = pricekey * 702.13;
      } else if ($("#mexico").is(":checked")) {
        pricekey = pricekey * 18.86;
      } else if ($("#brasil").is(":checked")) {
        pricekey = pricekey * 3.37;
      } else if ($("#colombia").is(":checked")) {
        pricekey = pricekey * 3300;
      }

      if ($("#boxkey").is(":checked")) {
        json = [];
        pricepkey = pricekey;
        console.log("Precio de Key: ", pricekey, "NR: ", nr);
        json.push({
          produto: "Acsendo Key",
          precio_u: (pricepkey / nr).toFixed(0),
          nr: nr,
          precio_t: pricepkey.toFixed(0),
        });
      }

      if ($("#boxins").is(":checked")) {
        json = [];
        if (rango_nr > 0) {
          var price = prices_array["inspired"][0].valor * 300;
          var new_nr = nr - 300;
          for (let j = 1; j <= rango_nr; j++) {
            if (new_nr >= 50) {
              previous_price =
                previous_price + 50 * prices_array["inspired"][j].valor;
              priceins = price + previous_price;
              new_nr = new_nr - 50;
            } else {
              previous_price =
                previous_price + new_nr * prices_array["inspired"][j].valor;
               priceins = price + previous_price;
            }
          }
        } else {
          var price_f1 = prices_array["inspired"][0].valor * nr;
          if (nr <= 100) {
            priceins = price_f1 * 0.35 + price_f1;
          } else if (nr > 100 && nr <= 200) {
            priceins = price_f1 * 0.2 + price_f1;
          } else {
            priceins = price_f1;
          }
        }
        if ($("#chile").is(":checked")) {
          priceins = priceins * 723.4;
        } else if ($("#mexico").is(":checked")) {
          priceins = priceins * 19.43;
        } else if ($("#brasil").is(":checked")) {
          priceins = priceins * 3.37;
        } else if ($("#colombia").is(":checked")) {
          priceins = priceins * 3300;
        }
        json.push({
          produto: "Acsendo Inspired",
          precio_u: (priceins / nr).toFixed(0),
          nr: nr,
          precio_t: priceins.toFixed(0),
        });
      }
      if ($("#boxeng").is(":checked")) {
        if($("#boxins").is(":checked")){
          priceng = (pricekey * 0.5) - ((pricekey * 0.5) * 0.70);
          console.log("enge:", pricekey * 0.5)
          console.log("descuento:", ((pricekey * 0.5) * 0.70))
          console.log("total:", priceng);
        } else {
        priceng = pricekey * 0.5;
        }
        json.push({
          produto: "Acsendo Engegament",
          precio_u: (priceng / nr).toFixed(0),
          nr: nr,
          precio_t: priceng.toFixed(0),
        });
      }

      if ($("#boxagi").is(":checked")) {
         priceagile = pricekey * 0.75;
        json.push({
          produto: "Acsendo Agile",
          precio_u: (priceagile / nr).toFixed(0),
          nr: nr,
          precio_t: priceagile.toFixed(0),
        });
      }

      var addnr = $(".add-nr").val();
      if (addnr == "") {
        nr = nr;
      } else {
        nr = addnr;
        for (var i = 0; i < rangos2.length; i++) {
          if (nr >= rangos2[i].min && nr <= rangos2[i].max) {
            rango_nr = i;
          }
        }
        if (rango_nr > 0) { 
          previous_price_key = 0;
          pricekey = 0;
          var price = prices_array["key"][0].valor * 300;
          var new_nr = nr - 300;
          for (let j = 1; j <= rango_nr; j++) {
            if (new_nr >= 50) {
              previous_price_key =
                previous_price_key + 50 * prices_array["key"][j].valor;
              pricekey = price + previous_price_key;
              new_nr = new_nr - 50;
            } else {
              previous_price_key =
                previous_price_key + new_nr * prices_array["key"][j].valor;
              pricekey = price + previous_price_key;
            }
          }
          if ($("#chile").is(":checked")) {
            pricekey = pricekey * 723.4;
          } else if ($("#mexico").is(":checked")) {
            pricekey = pricekey * 19.43;
          } else if ($("#brasil").is(":checked")) {
            pricekey = pricekey * 3.37;
          } else if ($("#colombia").is(":checked")) {
            pricekey = pricekey * 3300;
          }
        }
        console.log("Precio de Key: ", pricekey, "NR: ", nr);
      }

      if ($("#boxokrs").is(":checked")) {
        price_and_okr = pricekey * 0.45;
        console.log("Precio de OKR", price_and_okr, "NR: ", nr);
        json.push({
          produto: "OKR",
          precio_u: (price_and_okr / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_okr.toFixed(0),
        });
      }
      if ($("#boxencu").is(":checked")) {
        price_and_encu = pricekey * 0.15;
        json.push({
          produto: "Encuestador",
          precio_u: (price_and_encu / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_encu.toFixed(0),
        });
      }

      if ($("#boxnom").is(":checked")) {
        price_and_nom = pricekey * 0.15;
        json.push({
          produto: "Nom035",
          precio_u: (price_and_nom / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_nom.toFixed(0),
        });
      }
      if ($("#boxreco").is(":checked")) {
        price_and_reco = pricekey * 0.22;
        json.push({
          produto: "Reconocimento",
          precio_u: (price_and_reco / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_reco.toFixed(0),
        });
      }
      if ($("#boxcompe").is(":checked")) {
        price_and_compe = pricekey * 0.42;
        json.push({
          produto: "Competencias",
          precio_u: (price_and_compe / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_compe.toFixed(0),
        });
      }
      if ($("#boxpid").is(":checked")) {
        price_and_pid = pricekey * 0.27;
        json.push({
          produto: "PID",
          precio_u: (price_and_pid / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_pid.toFixed(0),
        });
      }
      if ($("#boxplan").is(":checked")) {
        price_and_plan = pricekey * 0.22;
        json.push({
          produto: "Plan de sucesion",
          precio_u: (price_and_plan / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_plan.toFixed(0),
        });
      }
      if ($("#boxclima").is(":checked")) {
        price_and_clima = pricekey * 0.21;
        console.log("Clima:", price_and_clima , nr)
        json.push({
          produto: "Clima",
          precio_u: (price_and_clima / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_clima.toFixed(0),
        });
      }
      if ($("#boxmetas").is(":checked")) {
        price_and_metas = pricekey * 0.42;
        json.push({
          produto: "Metas",
          precio_u: (price_and_metas / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_metas.toFixed(0),
        });
      }
      if ($("#boxfeedback").is(":checked")) {
        price_and_feedback = pricekey * 0.22;
        json.push({
          produto: "Feedback",
          precio_u: (price_and_feedback / nr).toFixed(0),
          nr: nr,
          precio_t: price_and_feedback.toFixed(0),
        });
      }
      if ($("#boxconfeedback").is(":checked")) {
        var horas = $("#horas").val();
        if ($("#chile").is(":checked")) {
          price_and_consultoria = horas * 45 * 702.13;
        } else if ($("#mexico").is(":checked")) {
          price_and_consultoria = horas * 45 * 18.86;
        } else if ($("#brasil").is(":checked")) {
          price_and_consultoria = horas * 45 * 3.37;
        } else if ($("#colombia").is(":checked")) {
          price_and_consultoria = horas * 45 * 3300;
        } else {
          price_and_consultoria = horas * 45;
        }
        json.push({
          produto: "Consultoria",
          precio_u: (price_and_consultoria / horas).toFixed(0),
          nr: (horas, " horas"),
          precio_t: price_and_consultoria.toFixed(0),
        });
      }
      if ($("#boxseleccion").is(":checked")) {
        if ($("#uno").is(":checked")) {
          if ($("#chile").is(":checked")) {
            reclutamiento = 1025 * 702.13;
          } else if ($("#mexico").is(":checked")) {
            reclutamiento = 1025 * 18.86;
          } else if ($("#brasil").is(":checked")) {
            reclutamiento = 1025 * 3.37;
          } else if ($("#colombia").is(":checked")) {
            reclutamiento = 1025 * 3300;
          } else {
            reclutamiento = 1025;
          }
        }
        if ($("#dos").is(":checked")) {
          if ($("#chile").is(":checked")) {
            reclutamiento = 1520 * 702.13;
          } else if ($("#mexico").is(":checked")) {
            reclutamiento = 1520 * 18.86;
          } else if ($("#brasil").is(":checked")) {
            reclutamiento = 1520 * 3.37;
          } else if ($("#colombia").is(":checked")) {
            reclutamiento = 1520 * 3300;
          } else {
            reclutamiento = 1520;
          }
        }
        if ($("#tres").is(":checked")) {
          if ($("#chile").is(":checked")) {
            reclutamiento = 2150 * 702.13;
          } else if ($("#mexico").is(":checked")) {
            reclutamiento = 2150 * 18.86;
          } else if ($("#brasil").is(":checked")) {
            reclutamiento = 2150 * 3.37;
          } else if ($("#colombia").is(":checked")) {
            reclutamiento = 2150 * 3300;
          } else {
            reclutamiento = 2150;
          }
        }
        if ($("#ilimitado").is(":checked")) {
          if ($("#chile").is(":checked")) {
            reclutamiento = 3000 * 702.13;
          } else if ($("#mexico").is(":checked")) {
            reclutamiento = 3000 * 18.86;
          } else if ($("#brasil").is(":checked")) {
            reclutamiento = 3000 * 3.37;
          } else if ($("#colombia").is(":checked")) {
            reclutamiento = 3000 * 3300;
          } else {
            reclutamiento = 3000;
          }
        }
        json.push({
          produto: "Reclutamiento",
          precio_u: reclutamiento.toFixed(0),
          nr: " ",
          precio_t: reclutamiento.toFixed(0),
        });
      }

      var price_sub =
        price_and_okr +
        price_and_pid +
        price_and_plan +
        price_and_clima +
        price_and_metas +
        price_and_reco +
        price_and_compe +
        price_and_encu +
        price_and_nom +
        price_and_feedback;

      if (
        $("#boxkey").is(":checked") ||
        $("#boxins").is(":checked") ||
        $("#boxeng").is(":checked") ||
        $("#boxagi").is(":checked") ||
        rango_nr > 0
      ) {
        price_sub = price_sub;
      } else {
        console.log("hola");
        price_sub = price_sub + price_sub * 0.35;
      }

      price_final = price_and_consultoria + reclutamiento + price_sub + pricepkey + priceins + priceng + priceagile;

      console.log("Precio final: ", price_final);

      var anos = $(".numanos").val();
      if (anos == "") {
        price_final = price_final;
      } else {
        price_final = price_final * anos;
      }

      $("#run").click(function () {
        $(".boxdescuento").css("display", "block");
      });
      var descuento = $(".descuento").val();
      if (descuento == "") {
        price_final = price_final; 
      } else {
        var price_descuento = (price_final * descuento)/ 100;
        price_final = price_final - price_descuento;
        json.push({
          produto: "Descuento",
          precio_u: "",
          nr: ("Porcentaje: " + descuento + "%") ,
          precio_t: price_descuento.toFixed(0),
        });
         console.log(json);
      }
      var price_uni = (price_final / nr).toFixed(0);
      price_final= price_final.toFixed(0);
      price_final = new Intl.NumberFormat("de-DE").format(price_final);

     

      var moneda;

      if ($("#chile").is(":checked")) {
        $("#resultado").text("Total: CLP $" + price_final);
        $("#unitario").text("Precio por colaborador: CLP $" + price_uni);
        moneda = "CL";
      } else if ($("#mexico").is(":checked")) {
        $("#resultado").text("Total: MXN $" + price_final);
        $("#unitario").text("Precio por colaborador: MXN $" + price_uni);
        moneda = "MXN";
      } else if ($("#brasil").is(":checked")) {
        $("#resultado").text("Total: R $" + price_final);
        $("#unitario").text("Preço por colaborador: R $" + price_uni);
        moneda = "R";
      } else if ($("#colombia").is(":checked")) {
        $("#resultado").text("Total: COP $" + price_final);
        $("#unitario").text("Precio por colaborador: COP $" + price_uni);
        moneda = "COL";
      } else {
        $("#resultado").text("Total: USD $" + price_final);
        $("#unitario").text("Precio por colaborador: USD $" + price_uni);
        moneda = "USD";
      }

      json.push({
        produto: "TOTAL",
        produto2: "TOTAL",
        precio_u: "",
        nr: "",
        precio_t: moneda + " $ " + price_final,
      });
    });
  });

  $("#pdf-propuesta").click(function () {
    $("#calculadora").css("display", "none");
    $("#propuesta").css("display", "block");
    $('#comercial').change(function() {
      id_com = $(this).val();
    });
  });

  $("#descargar").click(function () {
    generarpdf();
  });

  $("#atras").click(function () {
    $("#calculadora").css("display", "block");
    $("#propuesta").css("display", "none");
  });
}

function currencyConverter(currency_from, currency_to) {
  var yql_base_url =
    "https://api.exchangerate-api.com/v4/latest/" + currency_from;
  var http_response = httpGet(yql_base_url);
  var http_response_json = JSON.parse(http_response);
  return http_response_json.rates[currency_to];
}

function generarpdf() {
  
  if ($("#esp").is(":checked")){
  var doc = new jsPDF();

  doc.addImage(portada, "PNG", 0, 0, 210, 298);

  var objToday = new Date(),
    weekday = new Array(
      "Domingo",
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado"
    ),
    dayOfWeek = weekday[objToday.getDay()],
    dayOfMonth =
      today + (objToday.getDate() < 10)
        ? "0" + objToday.getDate()
        : objToday.getDate(),
    months = new Array(
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Setiembre",
      "Octubre",
      "Noviembre",
      "Diciembre"
    ),
    curMonth = months[objToday.getMonth()],
    curYear = objToday.getFullYear();
  var today = dayOfMonth + " de " + curMonth + " de " + curYear;
  doc.addFont("verdana", "verdana", "normal");
  doc.setFont("verdana");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  var textWidth =
    (doc.getStringUnitWidth(today) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
  doc.text(20, 160, today);

  var nombre_emp = $("#nomempresa").val();
  var nombre_cliente = $("#contactopropu").val();
  console.log("hola",  comercial_info[id_com])
  var numero_com, email_com, cargo_com, nombre_com;

  numero_com = comercial_info[id_com].cellphone;
  email_com = comercial_info[id_com].email;
  cargo_com = comercial_info[id_com].jobrole;
  nombre_com = comercial_info[id_com].name;

  console.log(email_com);
  console.log(doc.getFontList());

  doc.addPage();

  doc.addImage(logo, "PNG", 15, 10, 5, 5);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(25, 14, "Propuesta Económica");

  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
  var footer1 = "acsendo.com";
  var footer2 =
    "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
  var textWidth1 =
    (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
  doc.text(textOffset1, 275, footer);
  var textWidth2 =
    (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
  doc.text(textOffset2, 280, footer1);
  var textWidth3 =
    (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
  doc.text(textOffset3, 285, footer2);

  doc.setFont("verdana");

  doc.setTextColor(0, 0, 0);
  doc.setFontType("bold");
  doc.setFontSize(11);
  doc.text(30, 70, "Señores:");
  doc.setFontType("normal");
  doc.text(49, 70, nombre_emp);
  doc.setFontType("bold");
  doc.text(30, 82, "Atn:");
  doc.setFontType("normal");
  doc.text(40, 82, nombre_cliente);

  doc.setFontType("bold");
  doc.text(30, 120, "Asunto:");
  doc.setFontType("normal");
  doc.text(48, 120, "Cotizacion");
  doc.setFontType("bold");
  doc.text(30, 132, "Apreciados señores:");
  doc.setFontType("normal");
  var text1 =
    "Nos permitimos dar a conocer los detalles correspondientes a la propuesta relacionada con la prestación de servicios de software para optimizar y automatizar los procesos de Gestión del Talento Humano bajo la modalidad de SAAS (Software as a service). \n\n\nEl propósito de Acsendo es ayudar a las empresas a optimizar y automatizar sus procesos para convertir a las áreas de Recursos Humanos en aliados estratégicos para el crecimiento. Para lograr esto, trabajamos con nuestros clientes en la construcción de una cultura organizacional memorable, el diseño planes de desarrollo individual, la integración de metodologías para el seguimiento de indicadores y otras labores de gestión y administración de recursos humanos.\n\n\nQuedamos muy atentos a responder cualquier duda o aclaración que tenga sobre el presente documento, \n\n\nCordialmente, ";

  var text1_split = doc.splitTextToSize(
    text1,
    doc.internal.pageSize.width - 60
  );
  doc.text(30, 142, text1_split);

  doc.setFontType("normal");
  doc.text(30, 230, "Acsendo SAS");

  /* PAQUETES */

  if ($("#boxkey").is(":checked")) {
    /* KEY */
    doc.addPage();
    /* Footer y Banner */
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(255, 255, 255);
    doc.text(70, 30, "Acsendo Key");

    doc.setFontSize(10);
    doc.setFontStyle("normal");
    doc.setTextColor(240, 240, 240);
    var text1 =
      "Automatiza la medición del desempeño para tomar decisiones informadas que aumentan";
    var text2 =
      "la productividad y desarrollan la cultura organizacional en las empresas.";

    var textWidth_title1 =
      (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title1 =
      (doc.internal.pageSize.width - textWidth_title1) / 2;

    doc.text(textOffset_title1, 40, text1);

    var textWidth_title2 =
      (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title2 =
      (doc.internal.pageSize.width - textWidth_title2) / 2;

    doc.text(textOffset_title2, 45, text2);

    /* Foto del producto */
    doc.addImage(acsendo_key, "PNG", 35, 53, 132, 82);

    /* Competencias */

    doc.addImage(logo_comp, "PNG", 0, 145, 210, 30);

    /* Opcionales */
    doc.setFontSize(12);
    doc.setFontStyle("normal");
    doc.setTextColor(50, 50, 50);
    var text5 = "Cuenta con dos modelos de seguimiento para escoger:";
    var text5_split = doc.splitTextToSize(
      text5,
      doc.internal.pageSize.width - 60
    );
    doc.text(30, 185, text5_split);
    doc.addImage(logo_metas, "PNG", 0, 190, 210, 35);
    doc.addImage(logo_okr, "PNG", 0, 226, 210, 33);

    doc.addPage();

    /* Footer y Banner */
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Acsendo Key");

    /* Opcionales */

    doc.setFontSize(12);
    doc.setFontStyle("normal");
    doc.setTextColor(50, 50, 50);
    var text5 =
      "Desarrolla la cultura organizacional en tu empresa con una de estas opciones:";

    var text5_split = doc.splitTextToSize(
      text5,
      doc.internal.pageSize.width - 60
    );
    doc.text(30, 50, text5_split);
    doc.addImage(img_recon, "PNG", -1, 60, 210, 30);
    doc.addImage(icon_feedback, "PNG", 0, 91, 210, 28);

    /* Consultoria */
    doc.addImage(consultoria, "PNG", -1, 120, 210, 40);
  }

  if ($("#boxins").is(":checked")) {
    /*
        Inspired
        */
    doc.addPage();
    /* Footer y Banner */
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(255, 255, 255);
    doc.text(54, 30, "Acsendo Inspired");

    doc.setFontSize(10);
    doc.setFontStyle("normal");
    doc.setTextColor(240, 240, 240);
    var text1 =
      "Complementa el entendimiento de los factores del talento humano y mejora las herramientas";
    var text2 =
      "para medir el desempeño, implementar planes de desarrollo e impulsar la cultura organizacional.";

    var textWidth_title1 =
      (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title1 =
      (doc.internal.pageSize.width - textWidth_title1) / 2;

    doc.text(textOffset_title1, 40, text1);

    var textWidth_title2 =
      (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title2 =
      (doc.internal.pageSize.width - textWidth_title2) / 2;

    doc.text(textOffset_title2, 45, text2);

    /* Foto del producto */
    doc.addImage(acsendo_insparied, "PNG", 35, 51, 132, 82);

    /* Competencias */

    doc.addImage(logo_comp, "PNG", 0, 145, 210, 30);

    /* Opcionales */
    doc.setFontSize(12);
    doc.setFontStyle("normal");
    doc.setTextColor(50, 50, 50);
    var text5 = "Cuenta con dos modelos de seguimiento para escoger:";
    var text5_split = doc.splitTextToSize(
      text5,
      doc.internal.pageSize.width - 60
    );
    doc.text(30, 185, text5_split);
    doc.addImage(logo_metas, "PNG", 0, 190, 210, 35);
    doc.addImage(logo_okr, "PNG", 0, 226, 210, 33);

    doc.addPage();

       /* Footer y Banner */
       doc.setFontSize(7);
       doc.setTextColor(100, 100, 100);
       var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
       var footer1 = "acsendo.com";
       var footer2 =
         "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
       var textWidth1 =
         (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
         doc.internal.scaleFactor;
       var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
       doc.text(textOffset1, 275, footer);
       var textWidth2 =
         (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
         doc.internal.scaleFactor;
       var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
       doc.text(textOffset2, 280, footer1);
       var textWidth3 =
         (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
         doc.internal.scaleFactor;
       var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
       doc.text(textOffset3, 285, footer2);
   
       doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);
   
       doc.setFontSize(33);
       doc.setFontStyle("bold");
       doc.setTextColor(255, 255, 255);
       doc.text(54, 30, "Acsendo Inspired");
   
       doc.setFontSize(10);
       doc.setFontStyle("normal");
       doc.setTextColor(240, 240, 240);
       var text1 =
         "Complementa el entendimiento de los factores del talento humano y mejora las herramientas";
       var text2 =
         "para medir el desempeño, implementar planes de desarrollo e impulsar la cultura organizacional.";
   
       var textWidth_title1 =
         (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
         doc.internal.scaleFactor;
       var textOffset_title1 =
         (doc.internal.pageSize.width - textWidth_title1) / 2;
   
       doc.text(textOffset_title1, 40, text1);
   
       var textWidth_title2 =
         (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
         doc.internal.scaleFactor;
       var textOffset_title2 =
         (doc.internal.pageSize.width - textWidth_title2) / 2;
   
       doc.text(textOffset_title2, 45, text2);

    /* Opcionales */

    doc.addImage(img_recon, "PNG", -1, 79, 210, 30);
    doc.addImage(icon_feedback, "PNG", 0, 110, 210, 28);
    doc.addImage(logo_pid, "PNG", 0, 139, 210, 35);
    doc.addImage(logo_encuestador, "PNG", 0, 175, 210, 35);

    doc.addPage();

    /* Footer y Banner */
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(54, 30, "Acsendo Inspired");


    doc.addImage(logo_plantillas, "PNG", -1, 90, 210, 50);

    /* Consultoria */
    doc.addImage(consultoria, "PNG", -1, 142, 210, 40);
   
    if ($("#boxeng").is(":checked")){
    doc.addPage();
    /* Footer y Banner */
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(255, 255, 255);
    doc.text(48, 30, "Acsendo Engagement");

    doc.setFontSize(10);
    doc.setFontStyle("normal");
    doc.setTextColor(240, 240, 240);
    var text1 =
      "Apoya aspectos fundamentales de la cultura organizacional como el feedback, el reconocimiento";
    var text2 =
      "y el clima laboral para crear planes de mejoramiento enfocados en la realidad de la compañía.";

    var textWidth_title1 =
      (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title1 =
      (doc.internal.pageSize.width - textWidth_title1) / 2;

    doc.text(textOffset_title1, 40, text1);

    var textWidth_title2 =
      (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title2 =
      (doc.internal.pageSize.width - textWidth_title2) / 2;

    doc.text(textOffset_title2, 45, text2);

    /* Foto del producto */
    doc.addImage(acsendo_engagement, "PNG", 35, 53, 132, 82);
    doc.addImage(logo_clima, "PNG", 0, 140, 210, 27);   
  }
}
  if ($("#boxagi").is(":checked")) {
    /*
          Agile
          */
         doc.addPage();
        /* Footer y Banner */
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
        var footer1 = "acsendo.com";
        var footer2 =
          "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
        var textWidth1 =
          (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
        doc.text(textOffset1, 275, footer);
        var textWidth2 =
          (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
        doc.text(textOffset2, 280, footer1);
        var textWidth3 =
          (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
        doc.text(textOffset3, 285, footer2);
    
        doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);
    
        doc.setFontSize(33);
        doc.setFontStyle("bold");
        doc.setTextColor(255, 255, 255);
        doc.text(60, 30, "Acsendo Agile");
    
        doc.setFontSize(10);
        doc.setFontStyle("normal");
        doc.setTextColor(240, 240, 240);
        var text1 =
          "Acelera el crecimiento en empresas que emplean metodologías ágiles y quieren gestionar el talento humano";
        var text2 =
          "con este enfoque para adaptarse a entornos cambiantes de toma de decisiones rápidas.";
    
        var textWidth_title1 =
          (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset_title1 =
          (doc.internal.pageSize.width - textWidth_title1) / 2;
    
        doc.text(textOffset_title1, 40, text1);
    
        var textWidth_title2 =
          (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset_title2 =
          (doc.internal.pageSize.width - textWidth_title2) / 2;
    
        doc.text(textOffset_title2, 45, text2);
    
        /* Foto del producto */
        doc.addImage(acsendo_agile, "PNG", 35, 51, 132, 82);
    
        doc.addImage(logo_okr, "PNG", -1, 140, 210, 33);
        doc.addImage(img_recon, "PNG", -1, 174, 210, 30);
        doc.addImage(icon_feedback, "PNG", 0, 205, 210, 27);

        doc.addPage();
        /* Footer y Banner */
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
        var footer1 = "acsendo.com";
        var footer2 =
          "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
        var textWidth1 =
          (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
        doc.text(textOffset1, 275, footer);
        var textWidth2 =
          (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
        doc.text(textOffset2, 280, footer1);
        var textWidth3 =
          (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
        doc.text(textOffset3, 285, footer2);
    
        
    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(54, 30, "Acsendo Agile");

        /* Consultoria */
        doc.addImage(consultoria, "PNG", -1, 90, 210, 40);
  }
  if ($("#boxeng").is(":checked") && !$("#boxins").is(":checked")) {
    /*
        Engagement
        */
        doc.addPage();
        /* Footer y Banner */
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
        var footer1 = "acsendo.com";
        var footer2 =
          "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
        var textWidth1 =
          (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
        doc.text(textOffset1, 275, footer);
        var textWidth2 =
          (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
        doc.text(textOffset2, 280, footer1);
        var textWidth3 =
          (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
        doc.text(textOffset3, 285, footer2);
    
        doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);
    
        doc.setFontSize(33);
        doc.setFontStyle("bold");
        doc.setTextColor(255, 255, 255);
        doc.text(48, 30, "Acsendo Engagement");
    
        doc.setFontSize(10);
        doc.setFontStyle("normal");
        doc.setTextColor(240, 240, 240);
        var text1 =
          "Apoya aspectos fundamentales de la cultura organizacional como el feedback, el reconocimiento";
        var text2 =
          "y el clima laboral para crear planes de mejoramiento enfocados en la realidad de la compañía.";
    
        var textWidth_title1 =
          (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset_title1 =
          (doc.internal.pageSize.width - textWidth_title1) / 2;
    
        doc.text(textOffset_title1, 40, text1);
    
        var textWidth_title2 =
          (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset_title2 =
          (doc.internal.pageSize.width - textWidth_title2) / 2;
    
        doc.text(textOffset_title2, 45, text2);
    
        /* Foto del producto */
        doc.addImage(acsendo_engagement, "PNG", 35, 53, 132, 82);
        doc.addImage(logo_clima, "PNG", 0, 140, 210, 27);
        doc.addImage(img_recon, "PNG", -1, 168, 210, 30);
        doc.addImage(icon_feedback, "PNG", 0, 200, 210, 27);

        doc.addPage();

        /* Footer y Banner */
        doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
        var footer1 = "acsendo.com";
        var footer2 =
          "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
        var textWidth1 =
          (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
        doc.text(textOffset1, 275, footer);
        var textWidth2 =
          (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
        doc.text(textOffset2, 280, footer1);
        var textWidth3 =
          (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
        doc.text(textOffset3, 285, footer2);

        doc.setFontSize(33);
        doc.setFontStyle("bold");
        doc.setTextColor(30, 141, 159);
        doc.text(48, 30, "Acsendo Engagement");
    
        doc.addImage(logo_encuestador, "PNG", -1, 60, 210, 35);
        doc.addImage(logo_plantillas, "PNG", -1, 96, 210, 50);
    
        /* Consultoria */
        doc.addImage(consultoria_8h, "PNG", 0, 147, 210, 40);
    
      
  }

  /* ADDONS */

  if ($("#boxokrs").is(":checked")) {
    /*OKR*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(logo_okr, "PNG", 0, 60, 210, 35);
  }
  if ($("#boxpid").is(":checked")) {
    /*PID*/
    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(logo_pid, "PNG", 0, 60, 210, 35);
  }
  if ($("#boxplan").is(":checked")) {
    /*Plan de susecion*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(plan_suse , "PNG", 0, 60, 210, 27);

  }
  if ($("#boxclima").is(":checked")) {
    /*Clima laboral*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(logo_clima , "PNG", 0, 60, 210, 27);
  }
  if ($("#boxmetas").is(":checked")) {
    /*Gestión de Metas*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(logo_metas, "PNG", 0, 60, 210, 35);
  }
  if ($("#boxfeedback").is(":checked")) {
    /*Feedback*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(icon_feedback, "PNG", 0, 60, 210, 28);
  }
  if ($("#boxconfeedback").is(":checked")) {
    /*Feedback*/
    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(consultoria, "PNG", 0, 60, 210, 40);
  }
  if ($("#boxcompe").is(":checked")) {
    /*Competencias*/
    doc.addPage();
   /* Footer y Banner */
   doc.setFontType("normal");
   doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
   doc.setFontSize(7);
   doc.setTextColor(255, 255, 255);
   var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
   var footer1 = "acsendo.com";
   var footer2 =
     "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
   var textWidth1 =
     (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
   doc.text(textOffset1, 275, footer);
   var textWidth2 =
     (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
   doc.text(textOffset2, 280, footer1);
   var textWidth3 =
     (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
   doc.text(textOffset3, 285, footer2);

   doc.setFontSize(33);
   doc.setFontStyle("bold");
   doc.setTextColor(30, 141, 159);
   doc.text(70, 30, "Add-ons");

   doc.addImage(logo_comp, "PNG", 0, 60, 210, 30);

  }
  if ($("#boxreco").is(":checked")) {
    /*Reconocimiento*/   
     doc.addPage();

   /* Footer y Banner */
   doc.setFontType("normal");
   doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
   doc.setFontSize(7);
   doc.setTextColor(255, 255, 255);
   var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
   var footer1 = "acsendo.com";
   var footer2 =
     "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
   var textWidth1 =
     (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
   doc.text(textOffset1, 275, footer);
   var textWidth2 =
     (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
   doc.text(textOffset2, 280, footer1);
   var textWidth3 =
     (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
   doc.text(textOffset3, 285, footer2);

   doc.setFontSize(33);
   doc.setFontStyle("bold");
   doc.setTextColor(30, 141, 159);
   doc.text(70, 30, "Add-ons");

   doc.addImage(img_recon, "PNG", 0, 60, 210, 30);
  }
  if ($("#boxecu").is(":checked")) {
    /*Encuestador*/
    doc.addPage();
   /* Footer y Banner */
   doc.setFontType("normal");
   doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
   doc.setFontSize(7);
   doc.setTextColor(255, 255, 255);
   var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
   var footer1 = "acsendo.com";
   var footer2 =
     "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
   var textWidth1 =
     (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
   doc.text(textOffset1, 275, footer);
   var textWidth2 =
     (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
   doc.text(textOffset2, 280, footer1);
   var textWidth3 =
     (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
   doc.text(textOffset3, 285, footer2);

   doc.setFontSize(33);
   doc.setFontStyle("bold");
   doc.setTextColor(30, 141, 159);
   doc.text(70, 30, "Add-ons");

   doc.addImage(logo_encuestador, "PNG", 0, 60, 210, 35);
  }
  if ($("#boxnom").is(":checked")) {
    /*NOM-035*/
    doc.addPage();
   /* Footer y Banner */
   doc.setFontType("normal");
   doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
   doc.setFontSize(7);
   doc.setTextColor(255, 255, 255);
   var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
   var footer1 = "acsendo.com";
   var footer2 =
     "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
   var textWidth1 =
     (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
   doc.text(textOffset1, 275, footer);
   var textWidth2 =
     (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
   doc.text(textOffset2, 280, footer1);
   var textWidth3 =
     (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
   doc.text(textOffset3, 285, footer2);

   doc.setFontSize(33);
   doc.setFontStyle("bold");
   doc.setTextColor(30, 141, 159);
   doc.text(70, 30, "Add-ons");

   doc.addImage(nom_035, "PNG", 0, 60, 210, 30);
  }
  if ($("#boxseleccion").is(":checked")) {
    /*Reclutamiento y seleccion*/

    doc.addPage();
    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);
 
    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");
 
    doc.addImage(reclutamiento, "PNG", 0, 60, 210, 40);
  }


  doc.addPage();
  doc.addImage(fondo_1, "PNG", 0, 0, 210, 298);
  doc.setFontType("normal");
  /* Footer */
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
  var footer1 = "acsendo.com";
  var footer2 =
    "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
  var textWidth1 =
    (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
  doc.text(textOffset1, 275, footer);
  var textWidth2 =
    (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
  doc.text(textOffset2, 280, footer1);
  var textWidth3 =
    (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
  doc.text(textOffset3, 285, footer2);

  doc.addImage(logo, "PNG", 15, 10, 5, 5);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(25, 14, "Propuesta Económica");

  var title1 = "Observaciones";
  doc.setFontSize(20);
  doc.setFontStyle("bold");
  doc.setTextColor(30, 141, 159);

  var textWidth_title1 =
    (doc.getStringUnitWidth(title1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset_title1 = (doc.internal.pageSize.width - textWidth_title1) / 2;

  doc.text(textOffset_title1, 35, title1);

  doc.setTextColor(0, 0, 0);
  doc.setFontType("normal");
  doc.setFontSize(12);
  var mensaje = $("#observaciones").val();
  var text1_split = doc.splitTextToSize(
    mensaje,
    doc.internal.pageSize.width - 50
  );
  doc.text(30, 60, text1_split);
  var vigencia = $("#fecha").val();
  var text10 = "Cotización válida hasta:";
  var text10_split = doc.splitTextToSize(
    text10,
    doc.internal.pageSize.width - 60
  );
  doc.text(30, 45, text10_split);
  doc.setFontStyle("normal");
  doc.text(80, 45, vigencia);

  /*Tabla de valores*/

  doc.addPage();

  var length = Object.keys(json).length;
  console.log(length);

  /* Footer */
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
  var footer1 = "acsendo.com";
  var footer2 =
    "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
  var textWidth1 =
    (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
  doc.text(textOffset1, 275, footer);
  var textWidth2 =
    (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
  doc.text(textOffset2, 280, footer1);
  var textWidth3 =
    (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
  doc.text(textOffset3, 285, footer2);

  doc.addImage(banner_rosa, "PNG", 0, 0, 210, 80);
  var title1 = "Precio";
  doc.setFontSize(30);
  doc.setFontStyle("bold");
  doc.setTextColor(255, 255, 255);

  var textWidth_title1 =
    (doc.getStringUnitWidth(title1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset_title1 = (doc.internal.pageSize.width - textWidth_title1) / 2;

  doc.text(textOffset_title1, 35, title1);

  //doc.setFontStyle("normal");
  //doc.text(65,55, json[0].nr);
  doc.setFontSize(12);
  var moneda;
  if ($("#chile").is(":checked")) {
    moneda = " CL";
  } else if ($("#mexico").is(":checked")) {
    moneda = " MXN";
  } else if ($("#brasil").is(":checked")) {
    moneda = " R";
  } else if ($("#colombia").is(":checked")) {
    moneda = " COL";
  } else {
    moneda = " USD";
  }
  var offsetMargin = 50;
  var columns = [
    "Ítem",
    "No. Empleados",
    "Precio por empleado",
    "Precio en" + moneda,
  ];

  if (length == 1) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u, json[0].precio_t],
    ];
  } else if (length == 2) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u, json[1].precio_t],
    ];
  } else if (length == 3) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u, json[2].precio_t],
    ];
  } else if (length == 4) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_],
      [json[3].produto, json[3].nr, json[3].precio_u, json[3].precio_t],
    ];
  } else if (length == 5) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u, json[4].precio_t + "$"],
    ];
  } else if (length == 6) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u, json[5].precio_t],
    ];
  } else if (length == 7) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u, json[6].precio_t],
    ];
  } else if (length == 8) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u, json[7].precio_t],
    ];
  } else if (length == 9) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u + "$", json[7].precio_t],
      [json[8].produto, json[8].nr, json[8].precio_u, json[8].precio_t],
    ];
  } else if (length == 10) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u + "$", json[7].precio_t],
      [json[8].produto, json[8].nr, json[8].precio_u + "$", json[8].precio_t],
      [json[9].produto, json[9].nr, json[9].precio_u, json[9].precio_t],
    ];
  } else if (length == 11) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u + "$", json[7].precio_t],
      [json[8].produto, json[8].nr, json[8].precio_u + "$", json[8].precio_t],
      [json[9].produto, json[9].nr, json[9].precio_u + "$", json[9].precio_t],
      [json[10].produto, json[10].nr, json[10].precio_u, json[10].precio_t],
    ];
  } else if (length == 12) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u + "$", json[7].precio_t],
      [json[8].produto, json[8].nr, json[8].precio_u + "$", json[8].precio_t],
      [json[9].produto, json[9].nr, json[9].precio_u + "$", json[9].precio_t],
      [
        json[10].produto,
        json[10].nr,
        json[10].precio_u + "$",
        json[10].precio_t,
      ],
      [json[11].produto, json[11].nr, json[11].precio_u, json[11].precio_t],
    ];
  }

  console.log(data);

  doc.autoTable(columns, data, {
    tableWidth: "auto",
    startY: offsetMargin,
    margin: 30,
    headStyles: {
      fillColor: [234, 78, 89],
      textColor: [255, 255, 255],
      minCellHeight: 10,
      fontSize: 10,
    },
    styles: {
      cellPadding: 2,
      valign: "middle",
      halign: "center",
      cellWidth: "auto",
      overflow: "linebreak",
    },
    bodyStyles: {
      minCellHeight: 8,
      fillColor: [233, 233, 233],
      textColor: [0, 0, 0],
      fontSize: 10,
      valign: "middle",
    },
    didParseCell: function (cell, data) {
      if (cell.raw === "Total") {
        (cell.styles.fontStyle = "bold"),
          (cell.styles.fillColor = [234, 78, 89]);
      }
    },
  });

  doc.setFontSize(10);
  doc.setFontStyle("bold");
  doc.setTextColor(1, 26, 51);

  /*Informacion adicional*/

  doc.addPage();
  doc.addImage(fondo_1, "PNG", 0, 0, 210, 298);

  /* Footer */
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
  var footer1 = "acsendo.com";
  var footer2 =
    "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
  var textWidth1 =
    (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
  doc.text(textOffset1, 275, footer);
  var textWidth2 =
    (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
  doc.text(textOffset2, 280, footer1);
  var textWidth3 =
    (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
  doc.text(textOffset3, 285, footer2);

  doc.addImage(logo, "PNG", 15, 10, 5, 5);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(25, 14, "Propuesta Económica");

  var title1 = "Información Adicional";
  doc.setFontSize(20);
  doc.setFontStyle("bold");
  doc.setTextColor(30, 141, 159);
  var textWidth_title1 =
    (doc.getStringUnitWidth(title1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset_title1 = (doc.internal.pageSize.width - textWidth_title1) / 2;

  doc.text(textOffset_title1, 35, title1);

  doc.setTextColor(0, 0, 0);
  doc.setFontType("normal");
  doc.setFontSize(12);
  var mensaje2 =
    "Para conocer todo el proceso de implementación y apoyo metodológico que tienes con Acsendo, da clic en cada uno de los siguientes links: ";
  var text1_split = doc.splitTextToSize(
    mensaje2,
    doc.internal.pageSize.width - 50
  );
  doc.text(30, 45, text1_split);
  doc.addImage(implementacion, "PNG", 60, 60, 95, 10);
  doc.link(60, 60, 95, 10, {url: 'https://soporte.acsendo.com/es/proceso-de-implementaci%C3%B3n-de-la-plataforma'});
  doc.addImage(capacitacion, "PNG", 60, 75, 95, 10);
  doc.link(60, 75, 95, 10, {url: ' https://soporte.acsendo.com/es/capacitacion-implementacion'});
  doc.addImage(perfil, "PNG", 60, 90, 95, 10);
  doc.link(60, 90, 95, 10, {url: 'https://soporte.acsendo.com/es/perfiles-de-la-plataforma'});
  doc.addImage(soporte, "PNG", 60, 105, 95, 10);
  doc.link(60, 105, 95, 10, {url: 'https://soporte.acsendo.com/es'});
  doc.addImage(requerimientos, "PNG", 60, 120, 95, 10);
  doc.link(60, 120, 95, 10, {url: 'https://soporte.acsendo.com/es/requerimientos-t%C3%A9cnicos-para-la-implementaci%C3%B3n'});
  doc.addImage(consultoria_link, "PNG", 60, 135, 95, 10);
  doc.link(60, 135, 95, 10, {url: 'https://soporte.acsendo.com/es/consultoria-implementacion'});

  var title1 = "Ellos ya iniciaron el cambio con Acsendo";
  doc.setFontSize(16);
  doc.setFontStyle("bold");
  doc.setTextColor(30, 141, 159);
  var textWidth_title1 =
    (doc.getStringUnitWidth(title1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset_title1 = (doc.internal.pageSize.width - textWidth_title1) / 2;

  doc.text(textOffset_title1, 160, title1);
  doc.addImage(empresas, "PNG", 33, 170, 150, 80);
  doc.link(33, 170, 150, 80, {url: 'https://www.acsendo.com/casos-de-exito'});

  doc.addPage();
  doc.addImage(contraportada, "JPEG", 0, 0, 210, 300);
  doc.setFontSize(14);
  doc.setFontStyle("bold");
  doc.setTextColor(255, 255, 255);
  doc.text(25, 128, nombre_com);
  doc.setFontStyle("normal");
  doc.text(25, 142, numero_com);
  doc.text(25, 150, email_com);

  doc.save("Cotizacion" + "- " + nombre_emp + ".pdf");
  }
 else { 
  var doc = new jsPDF();

  doc.addImage(portada_pt, "PNG", 0, 0, 210, 298);

  var objToday = new Date(),
    weekday = new Array(
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado"
    ),
    dayOfWeek = weekday[objToday.getDay()],
    dayOfMonth =
      today + (objToday.getDate() < 10)
        ? "0" + objToday.getDate()
        : objToday.getDate(),
    months = new Array(
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro"
    ),
    curMonth = months[objToday.getMonth()],
    curYear = objToday.getFullYear();
  var today = dayOfMonth + " de " + curMonth + " de " + curYear;
  doc.addFont("verdana", "verdana", "normal");
  doc.setFont("verdana");
  doc.setFontSize(13);
  doc.setTextColor(255, 255, 255);
  var textWidth =
    (doc.getStringUnitWidth(today) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset = (doc.internal.pageSize.width - textWidth) / 2;
  doc.text(20, 160, today);

  var nombre_emp = $("#nomempresa").val();
  var nombre_cliente = $("#contactopropu").val();
  console.log("hola",  comercial_info[id_com])
  var numero_com, email_com, cargo_com, nombre_com;

  numero_com = comercial_info[id_com].cellphone;
  email_com = comercial_info[id_com].email;
  cargo_com = comercial_info[id_com].jobrole;
  nombre_com = comercial_info[id_com].name;

  console.log(email_com);
  console.log(doc.getFontList());

  doc.addPage();

  doc.addImage(logo, "PNG", 15, 10, 5, 5);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(25, 14, "Proposta Econômica");

  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
  var footer1 = "acsendo.com";
  var footer2 =
    "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
  var textWidth1 =
    (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
  doc.text(textOffset1, 275, footer);
  var textWidth2 =
    (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
  doc.text(textOffset2, 280, footer1);
  var textWidth3 =
    (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
  doc.text(textOffset3, 285, footer2);

  doc.setFont("verdana");

  doc.setTextColor(0, 0, 0);
  doc.setFontType("bold");
  doc.setFontSize(11);
  doc.text(30, 70, "Senhores:");
  doc.setFontType("normal");
  doc.text(49, 70, nombre_emp);
  doc.setFontType("bold");
  doc.text(30, 82, "Atn:");
  doc.setFontType("normal");
  doc.text(40, 82, nombre_cliente);

  doc.setFontType("bold");
  doc.text(30, 120, "Assunto:");
  doc.setFontType("normal");
  doc.text(48, 120, "Citação");
  doc.setFontType("bold");
  doc.text(30, 132, "Estimados senhores:");
  doc.setFontType("normal");
  var text1 =
    "Nos permitimos divulgar os detalhes correspondentes à proposta relacionada à prestação de serviços de software para otimizar e automatizar os processos de Gestão de Talentos Humanos na modalidade SAAS (Software as a service). \n\n\nO objetivo da Acsendo é ajudar as empresas a otimizar e automatizar seus processos para transformar as áreas de Recursos Humanos em aliados estratégicos para o crescimento. Para tal, trabalhamos com os nossos clientes na construção de uma cultura organizacional memorável, no desenho de planos de desenvolvimento individual, na integração de metodologias de monitoramento de indicadores e outras tarefas de gestão e administração de RH.\n\nEstamos muito atentos para responder a quaisquer dúvidas ou esclarecimentos que você possa ter sobre este documento.\n\n\nCordialmente, ";

  var text1_split = doc.splitTextToSize(
    text1,
    doc.internal.pageSize.width - 60
  );
  doc.text(30, 142, text1_split);

  doc.setFontType("normal");
  doc.text(30, 230, "Acsendo SAS");

  /* PAQUETES */

  if ($("#boxkey").is(":checked")) {
    /* KEY */
    doc.addPage();
    /* Footer y Banner */
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(255, 255, 255);
    doc.text(70, 30, "Acsendo Key");

    doc.setFontSize(10);
    doc.setFontStyle("normal");
    doc.setTextColor(240, 240, 240);
    var text1 =
      "Automatize a medição de desempenho para tomar decisões informadas que aumentam";
    var text2 =
      "a produtividade e desenvolvem a cultura organizacional nas empresas.";

    var textWidth_title1 =
      (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title1 =
      (doc.internal.pageSize.width - textWidth_title1) / 2;

    doc.text(textOffset_title1, 40, text1);

    var textWidth_title2 =
      (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title2 =
      (doc.internal.pageSize.width - textWidth_title2) / 2;

    doc.text(textOffset_title2, 45, text2);

    /* Foto del producto */
    doc.addImage(key_pt, "PNG", 35, 53, 132, 82);

    /* Competencias */

    doc.addImage(competencias_pt, "PNG", 0, 145, 210, 30);

    /* Opcionales */
    doc.setFontSize(12);
    doc.setFontStyle("normal");
    doc.setTextColor(50, 50, 50);
    var text5 = "Tem dois modelos de rastreamento para escolher:";
    var text5_split = doc.splitTextToSize(
      text5,
      doc.internal.pageSize.width - 60
    );
    doc.text(30, 185, text5_split);
    doc.addImage(metas_pt, "PNG", 0, 190, 210, 35);
    doc.addImage(okr_pt, "PNG", 0, 226, 210, 33);

    doc.addPage();

    /* Footer y Banner */
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Acsendo Key");

    /* Opcionales */

    doc.setFontSize(12);
    doc.setFontStyle("normal");
    doc.setTextColor(50, 50, 50);
    var text5 =
      "Desenvolva a cultura organizacional em sua empresa com uma destas opções:";

    var text5_split = doc.splitTextToSize(
      text5,
      doc.internal.pageSize.width - 60
    );
    doc.text(30, 50, text5_split);
    doc.addImage(recono_pt, "PNG", -1, 60, 210, 30);
    doc.addImage(feedback_pt, "PNG", 0, 91, 210, 28);

    /* Consultoria */
    doc.addImage(consultoria_pt, "PNG", -1, 120, 210, 40);
  }

  if ($("#boxins").is(":checked")) {
    /*
        Inspired
        */
    doc.addPage();
    /* Footer y Banner */
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(255, 255, 255);
    doc.text(54, 30, "Acsendo Inspired");

    doc.setFontSize(10);
    doc.setFontStyle("normal");
    doc.setTextColor(240, 240, 240);
    var text1 =
      "Complementa a compreensão dos fatores do talento humano e aprimora as ferramentas";
    var text2 =
      "medir o desempenho, implementar planos de desenvolvimento e promover a cultura organizacional.";

    var textWidth_title1 =
      (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title1 =
      (doc.internal.pageSize.width - textWidth_title1) / 2;

    doc.text(textOffset_title1, 40, text1);

    var textWidth_title2 =
      (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title2 =
      (doc.internal.pageSize.width - textWidth_title2) / 2;

    doc.text(textOffset_title2, 45, text2);

    /* Foto del producto */
    doc.addImage(ins_pt, "PNG", 35, 51, 132, 82);

    /* Competencias */

    doc.addImage(competencias_pt, "PNG", 0, 145, 210, 30);

    /* Opcionales */
    doc.setFontSize(12);
    doc.setFontStyle("normal");
    doc.setTextColor(50, 50, 50);
    var text5 = "Tem dois modelos de rastreamento para escolher:";
    var text5_split = doc.splitTextToSize(
      text5,
      doc.internal.pageSize.width - 60
    );
    doc.text(30, 185, text5_split);
    doc.addImage(metas_pt, "PNG", 0, 190, 210, 35);
    doc.addImage(okr_pt, "PNG", 0, 226, 210, 33);

    doc.addPage();

       /* Footer y Banner */
       doc.setFontSize(7);
       doc.setTextColor(100, 100, 100);
       var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
       var footer1 = "acsendo.com";
       var footer2 =
         "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
       var textWidth1 =
         (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
         doc.internal.scaleFactor;
       var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
       doc.text(textOffset1, 275, footer);
       var textWidth2 =
         (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
         doc.internal.scaleFactor;
       var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
       doc.text(textOffset2, 280, footer1);
       var textWidth3 =
         (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
         doc.internal.scaleFactor;
       var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
       doc.text(textOffset3, 285, footer2);
   
       doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);
   
       doc.setFontSize(33);
       doc.setFontStyle("bold");
       doc.setTextColor(255, 255, 255);
       doc.text(54, 30, "Acsendo Inspired");

    /* Opcionales */

    doc.addImage(recono_pt, "PNG", -1, 79, 210, 30);
    doc.addImage(feedback_pt, "PNG", 0, 110, 210, 28);
    doc.addImage(pid_pt, "PNG", 0, 139, 210, 35);
    doc.addImage(encuestador_pt, "PNG", 0, 175, 210, 35);

    doc.addPage();

    /* Footer y Banner */
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(54, 30, "Acsendo Inspired");


    doc.addImage(plantillas_pt, "PNG", -1, 90, 210, 50);

    /* Consultoria */
    doc.addImage(consultoria_pt, "PNG", -1, 142, 210, 40);
   
    if ($("#boxeng").is(":checked")){
    doc.addPage();
    /* Footer y Banner */
    doc.setFontSize(7);
    doc.setTextColor(100, 100, 100);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(255, 255, 255);
    doc.text(48, 30, "Acsendo Engagement");

    doc.setFontSize(10);
    doc.setFontStyle("normal");
    doc.setTextColor(240, 240, 240);
    var text1 =
      "Apoia aspectos fundamentais da cultura organizacional como feedback, reconhecimento";
    var text2 =
      "e ambiente de trabalho para criar planos de melhoria focados na realidade da empresa.";

    var textWidth_title1 =
      (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title1 =
      (doc.internal.pageSize.width - textWidth_title1) / 2;

    doc.text(textOffset_title1, 40, text1);

    var textWidth_title2 =
      (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset_title2 =
      (doc.internal.pageSize.width - textWidth_title2) / 2;

    doc.text(textOffset_title2, 45, text2);

    /* Foto del producto */
    doc.addImage(enga_pt, "PNG", 35, 53, 132, 82);
    doc.addImage(clima_pt, "PNG", 0, 140, 210, 27);   
  }
}
  if ($("#boxagi").is(":checked")) {0
    /*
          Agile
          */
         doc.addPage();
        /* Footer y Banner */
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
        var footer1 = "acsendo.com";
        var footer2 =
          "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
        var textWidth1 =
          (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
        doc.text(textOffset1, 275, footer);
        var textWidth2 =
          (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
        doc.text(textOffset2, 280, footer1);
        var textWidth3 =
          (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
        doc.text(textOffset3, 285, footer2);
    
        doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);
    
        doc.setFontSize(33);
        doc.setFontStyle("bold");
        doc.setTextColor(255, 255, 255);
        doc.text(60, 30, "Acsendo Agile");
    
        doc.setFontSize(10);
        doc.setFontStyle("normal");
        doc.setTextColor(240, 240, 240);
        var text1 =
          "Acelera o crescimento em empresas que usam metodologias ágeis e desejam gerenciar o talento humano";
        var text2 =
          "com essa abordagem para se adaptar a ambientes em mudança de rápida tomada de decisão.";
    
        var textWidth_title1 =
          (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset_title1 =
          (doc.internal.pageSize.width - textWidth_title1) / 2;
    
        doc.text(textOffset_title1, 40, text1);
    
        var textWidth_title2 =
          (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset_title2 =
          (doc.internal.pageSize.width - textWidth_title2) / 2;
    
        doc.text(textOffset_title2, 45, text2);
    
        /* Foto del producto */
        doc.addImage(agile_pt, "PNG", 35, 51, 132, 82);
    
        doc.addImage(okr_pt, "PNG", -1, 140, 210, 33);
        doc.addImage(recono_pt, "PNG", -1, 174, 210, 30);
        doc.addImage(feedback_pt, "PNG", 0, 205, 210, 27);

        doc.addPage();
        /* Footer y Banner */
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
        var footer1 = "acsendo.com";
        var footer2 =
          "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
        var textWidth1 =
          (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
        doc.text(textOffset1, 275, footer);
        var textWidth2 =
          (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
        doc.text(textOffset2, 280, footer1);
        var textWidth3 =
          (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
        doc.text(textOffset3, 285, footer2);
    
        
    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(54, 30, "Acsendo Agile");

        /* Consultoria */
        doc.addImage(consultoria_pt, "PNG", -1, 90, 210, 40);
  }
  if ($("#boxeng").is(":checked") && !$("#boxins").is(":checked")) {
    /*
        Engagement
        */
        doc.addPage();
        /* Footer y Banner */
        doc.setFontSize(7);
        doc.setTextColor(100, 100, 100);
        var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
        var footer1 = "acsendo.com";
        var footer2 =
          "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
        var textWidth1 =
          (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
        doc.text(textOffset1, 275, footer);
        var textWidth2 =
          (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
        doc.text(textOffset2, 280, footer1);
        var textWidth3 =
          (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
        doc.text(textOffset3, 285, footer2);
    
        doc.addImage(banner_azul, "PNG", 0, 0, 210, 70);
    
        doc.setFontSize(33);
        doc.setFontStyle("bold");
        doc.setTextColor(255, 255, 255);
        doc.text(48, 30, "Acsendo Engagement");
    
        doc.setFontSize(10);
        doc.setFontStyle("normal");
        doc.setTextColor(240, 240, 240);
        var text1 =
          "Apoia aspectos fundamentais da cultura organizacional como feedback, reconhecimento";
        var text2 =
          "e ambiente de trabalho para criar planos de melhoria focados na realidade da empresa.";
    
        var textWidth_title1 =
          (doc.getStringUnitWidth(text1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset_title1 =
          (doc.internal.pageSize.width - textWidth_title1) / 2;
    
        doc.text(textOffset_title1, 40, text1);
    
        var textWidth_title2 =
          (doc.getStringUnitWidth(text2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset_title2 =
          (doc.internal.pageSize.width - textWidth_title2) / 2;
    
        doc.text(textOffset_title2, 45, text2);
    
        /* Foto del producto */
        doc.addImage(enga_pt, "PNG", 35, 53, 132, 82);
        doc.addImage(clima_pt, "PNG", 0, 140, 210, 27);
        doc.addImage(recono_pt, "PNG", -1, 168, 210, 30);
        doc.addImage(feedback_pt, "PNG", 0, 200, 210, 27);

        doc.addPage();

        /* Footer y Banner */
        doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
        doc.setFontSize(7);
        doc.setTextColor(255, 255, 255);
        var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
        var footer1 = "acsendo.com";
        var footer2 =
          "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
        var textWidth1 =
          (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
        doc.text(textOffset1, 275, footer);
        var textWidth2 =
          (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
        doc.text(textOffset2, 280, footer1);
        var textWidth3 =
          (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
        doc.text(textOffset3, 285, footer2);

        doc.setFontSize(33);
        doc.setFontStyle("bold");
        doc.setTextColor(30, 141, 159);
        doc.text(48, 30, "Acsendo Engagement");
    
        doc.addImage(encuestador_pt, "PNG", -1, 60, 210, 35);
        doc.addImage(plantillas_pt, "PNG", -1, 96, 210, 50);
    
        /* Consultoria */
        doc.addImage(consultoria_pt, "PNG", 0, 147, 210, 40);
    
      
  }

  /* ADDONS */

  if ($("#boxokrs").is(":checked")) {
    /*OKR*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(okr_pt, "PNG", 0, 60, 210, 35);
  }
  if ($("#boxpid").is(":checked")) {
    /*PID*/
    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(pid_pt, "PNG", 0, 60, 210, 35);
  }
  if ($("#boxplan").is(":checked")) {
    /*Plan de susecion*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(plan_suce_pt , "PNG", 0, 60, 210, 27);

  }
  if ($("#boxclima").is(":checked")) {
    /*Clima laboral*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(clima_pt , "PNG", 0, 60, 210, 27);
  }
  if ($("#boxmetas").is(":checked")) {
    /*Gestión de Metas*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(metas_pt, "PNG", 0, 60, 210, 35);
  }
  if ($("#boxfeedback").is(":checked")) {
    /*Feedback*/

    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(feedback_pt, "PNG", 0, 60, 210, 28);
  }
  if ($("#boxconfeedback").is(":checked")) {
    /*consultoria*/
    doc.addPage();

    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);

    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");

    doc.addImage(consultoria_pt, "PNG", 0, 60, 210, 40);
  }
  if ($("#boxcompe").is(":checked")) {
    /*Competencias*/
    doc.addPage();
   /* Footer y Banner */
   doc.setFontType("normal");
   doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
   doc.setFontSize(7);
   doc.setTextColor(255, 255, 255);
   var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
   var footer1 = "acsendo.com";
   var footer2 =
     "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
   var textWidth1 =
     (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
   doc.text(textOffset1, 275, footer);
   var textWidth2 =
     (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
   doc.text(textOffset2, 280, footer1);
   var textWidth3 =
     (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
   doc.text(textOffset3, 285, footer2);

   doc.setFontSize(33);
   doc.setFontStyle("bold");
   doc.setTextColor(30, 141, 159);
   doc.text(70, 30, "Add-ons");

   doc.addImage(competencias_pt, "PNG", 0, 60, 210, 30);

  }
  if ($("#boxreco").is(":checked")) {
    /*Reconocimiento*/   
     doc.addPage();

   /* Footer y Banner */
   doc.setFontType("normal");
   doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
   doc.setFontSize(7);
   doc.setTextColor(255, 255, 255);
   var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
   var footer1 = "acsendo.com";
   var footer2 =
     "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
   var textWidth1 =
     (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
   doc.text(textOffset1, 275, footer);
   var textWidth2 =
     (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
   doc.text(textOffset2, 280, footer1);
   var textWidth3 =
     (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
   doc.text(textOffset3, 285, footer2);

   doc.setFontSize(33);
   doc.setFontStyle("bold");
   doc.setTextColor(30, 141, 159);
   doc.text(70, 30, "Add-ons");

   doc.addImage(recono_pt, "PNG", 0, 60, 210, 30);
  }
  if ($("#boxecu").is(":checked")) {
    /*Encuestador*/
    doc.addPage();
   /* Footer y Banner */
   doc.setFontType("normal");
   doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
   doc.setFontSize(7);
   doc.setTextColor(255, 255, 255);
   var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
   var footer1 = "acsendo.com";
   var footer2 =
     "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
   var textWidth1 =
     (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
   doc.text(textOffset1, 275, footer);
   var textWidth2 =
     (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
   doc.text(textOffset2, 280, footer1);
   var textWidth3 =
     (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
   doc.text(textOffset3, 285, footer2);

   doc.setFontSize(33);
   doc.setFontStyle("bold");
   doc.setTextColor(30, 141, 159);
   doc.text(70, 30, "Add-ons");

   doc.addImage(encuestador_pt, "PNG", 0, 60, 210, 35);
  }
  if ($("#boxnom").is(":checked")) {
    /*NOM-035*/
    doc.addPage();
   /* Footer y Banner */
   doc.setFontType("normal");
   doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
   doc.setFontSize(7);
   doc.setTextColor(255, 255, 255);
   var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
   var footer1 = "acsendo.com";
   var footer2 =
     "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
   var textWidth1 =
     (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
   doc.text(textOffset1, 275, footer);
   var textWidth2 =
     (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
   doc.text(textOffset2, 280, footer1);
   var textWidth3 =
     (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
     doc.internal.scaleFactor;
   var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
   doc.text(textOffset3, 285, footer2);

   doc.setFontSize(33);
   doc.setFontStyle("bold");
   doc.setTextColor(30, 141, 159);
   doc.text(70, 30, "Add-ons");

   doc.addImage(nom_pt, "PNG", 0, 60, 210, 30);
  }
  if ($("#boxseleccion").is(":checked")) {
    /*Reclutamiento y seleccion*/

    doc.addPage();
    /* Footer y Banner */
    doc.setFontType("normal");
    doc.addImage(banner_abajo, "PNG", 0, 250, 210, 60);
    doc.setFontSize(7);
    doc.setTextColor(255, 255, 255);
    var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
    var footer1 = "acsendo.com";
    var footer2 =
      "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
    var textWidth1 =
      (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
    doc.text(textOffset1, 275, footer);
    var textWidth2 =
      (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
    doc.text(textOffset2, 280, footer1);
    var textWidth3 =
      (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
      doc.internal.scaleFactor;
    var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
    doc.text(textOffset3, 285, footer2);
 
    doc.setFontSize(33);
    doc.setFontStyle("bold");
    doc.setTextColor(30, 141, 159);
    doc.text(70, 30, "Add-ons");
 
    doc.addImage(reclutamiento_pt, "PNG", 0, 60, 210, 45);
  }


  doc.addPage();
  doc.addImage(fondo_1, "PNG", 0, 0, 210, 298);
  doc.setFontType("normal");
  /* Footer */
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
  var footer1 = "acsendo.com";
  var footer2 =
    "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
  var textWidth1 =
    (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
  doc.text(textOffset1, 275, footer);
  var textWidth2 =
    (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
  doc.text(textOffset2, 280, footer1);
  var textWidth3 =
    (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
  doc.text(textOffset3, 285, footer2);

  doc.addImage(logo, "PNG", 15, 10, 5, 5);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(25, 14, "Proposta Econômica");

  var title1 = "Observações";
  doc.setFontSize(20);
  doc.setFontStyle("bold");
  doc.setTextColor(30, 141, 159);

  var textWidth_title1 =
    (doc.getStringUnitWidth(title1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset_title1 = (doc.internal.pageSize.width - textWidth_title1) / 2;

  doc.text(textOffset_title1, 35, title1);

  doc.setTextColor(0, 0, 0);
  doc.setFontType("normal");
  doc.setFontSize(12);
  var mensaje = $("#observaciones").val();
  var text1_split = doc.splitTextToSize(
    mensaje,
    doc.internal.pageSize.width - 50
  );
  doc.text(30, 60, text1_split);
  var vigencia = $("#fecha").val();
  var text10 = "Cotação válida até:";
  var text10_split = doc.splitTextToSize(
    text10,
    doc.internal.pageSize.width - 60
  );
  doc.text(30, 45, text10_split);
  doc.setFontStyle("normal");
  doc.text(80, 45, vigencia);

  /*Tabla de valores*/

  doc.addPage();

  var length = Object.keys(json).length;
  console.log(length);

  /* Footer */
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
  var footer1 = "acsendo.com";
  var footer2 =
    "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
  var textWidth1 =
    (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
  doc.text(textOffset1, 275, footer);
  var textWidth2 =
    (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
  doc.text(textOffset2, 280, footer1);
  var textWidth3 =
    (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
  doc.text(textOffset3, 285, footer2);

  doc.addImage(banner_rosa, "PNG", 0, 0, 210, 80);
  var title1 = "Preço";
  doc.setFontSize(30);
  doc.setFontStyle("bold");
  doc.setTextColor(255, 255, 255);

  var textWidth_title1 =
    (doc.getStringUnitWidth(title1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset_title1 = (doc.internal.pageSize.width - textWidth_title1) / 2;

  doc.text(textOffset_title1, 35, title1);

  //doc.setFontStyle("normal");
  //doc.text(65,55, json[0].nr);
  doc.setFontSize(12);
  var moneda;
  if ($("#chile").is(":checked")) {
    moneda = " CL";
  } else if ($("#mexico").is(":checked")) {
    moneda = " MXN";
  } else if ($("#brasil").is(":checked")) {
    moneda = " R";
  } else if ($("#colombia").is(":checked")) {
    moneda = " COL";
  } else {
    moneda = " USD";
  }
  var offsetMargin = 50;
  var columns = [
    "Ítem",
    "No. Empregados",
    "Preço por funcionário",
    "Preço em" + moneda,
  ];

  if (length == 1) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u, json[0].precio_t],
    ];
  } else if (length == 2) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u, json[1].precio_t],
    ];
  } else if (length == 3) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u, json[2].precio_t],
    ];
  } else if (length == 4) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_],
      [json[3].produto, json[3].nr, json[3].precio_u, json[3].precio_t],
    ];
  } else if (length == 5) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u, json[4].precio_t + "$"],
    ];
  } else if (length == 6) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u, json[5].precio_t],
    ];
  } else if (length == 7) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u, json[6].precio_t],
    ];
  } else if (length == 8) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u, json[7].precio_t],
    ];
  } else if (length == 9) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u + "$", json[7].precio_t],
      [json[8].produto, json[8].nr, json[8].precio_u, json[8].precio_t],
    ];
  } else if (length == 10) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u + "$", json[7].precio_t],
      [json[8].produto, json[8].nr, json[8].precio_u + "$", json[8].precio_t],
      [json[9].produto, json[9].nr, json[9].precio_u, json[9].precio_t],
    ];
  } else if (length == 11) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u + "$", json[7].precio_t],
      [json[8].produto, json[8].nr, json[8].precio_u + "$", json[8].precio_t],
      [json[9].produto, json[9].nr, json[9].precio_u + "$", json[9].precio_t],
      [json[10].produto, json[10].nr, json[10].precio_u, json[10].precio_t],
    ];
  } else if (length == 12) {
    var data = [
      [json[0].produto, json[0].nr, json[0].precio_u + "$", json[0].precio_t],
      [json[1].produto, json[1].nr, json[1].precio_u + "$", json[1].precio_t],
      [json[2].produto, json[2].nr, json[2].precio_u + "$", json[2].precio_t],
      [json[3].produto, json[3].nr, json[3].precio_u + "$", json[3].precio_t],
      [json[4].produto, json[4].nr, json[4].precio_u + "$", json[4].precio_t],
      [json[5].produto, json[5].nr, json[5].precio_u + "$", json[5].precio_t],
      [json[6].produto, json[6].nr, json[6].precio_u + "$", json[6].precio_t],
      [json[7].produto, json[7].nr, json[7].precio_u + "$", json[7].precio_t],
      [json[8].produto, json[8].nr, json[8].precio_u + "$", json[8].precio_t],
      [json[9].produto, json[9].nr, json[9].precio_u + "$", json[9].precio_t],
      [
        json[10].produto,
        json[10].nr,
        json[10].precio_u + "$",
        json[10].precio_t,
      ],
      [json[11].produto, json[11].nr, json[11].precio_u, json[11].precio_t],
    ];
  }

  console.log(data);

  doc.autoTable(columns, data, {
    tableWidth: "auto",
    startY: offsetMargin,
    margin: 30,
    headStyles: {
      fillColor: [234, 78, 89],
      textColor: [255, 255, 255],
      minCellHeight: 10,
      fontSize: 10,
    },
    styles: {
      cellPadding: 2,
      valign: "middle",
      halign: "center",
      cellWidth: "auto",
      overflow: "linebreak",
    },
    bodyStyles: {
      minCellHeight: 8,
      fillColor: [233, 233, 233],
      textColor: [0, 0, 0],
      fontSize: 10,
      valign: "middle",
    },
    didParseCell: function (cell, data) {
      if (cell.raw === "Total") {
        (cell.styles.fontStyle = "bold"),
          (cell.styles.fillColor = [234, 78, 89]);
      }
    },
  });

  doc.setFontSize(10);
  doc.setFontStyle("bold");
  doc.setTextColor(1, 26, 51);

  /*Informacion adicional*/

  doc.addPage();
  doc.addImage(fondo_1, "PNG", 0, 0, 210, 298);

  /* Footer */
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  var footer = "Acsendo SAS - Calle 96 No. 12 - 31. Bogotá D.C (Colombia)";
  var footer1 = "acsendo.com";
  var footer2 =
    "Colombia (57) (60) 1 5086122 | México (52) 55 41647778 | Chile (56) 2 3210 9767 | Brasil (55) 11 4949 5006";
  var textWidth1 =
    (doc.getStringUnitWidth(footer) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset1 = (doc.internal.pageSize.width - textWidth1) / 2;
  doc.text(textOffset1, 275, footer);
  var textWidth2 =
    (doc.getStringUnitWidth(footer1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset2 = (doc.internal.pageSize.width - textWidth2) / 2;
  doc.text(textOffset2, 280, footer1);
  var textWidth3 =
    (doc.getStringUnitWidth(footer2) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset3 = (doc.internal.pageSize.width - textWidth3) / 2;
  doc.text(textOffset3, 285, footer2);

  doc.addImage(logo, "PNG", 15, 10, 5, 5);
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.text(25, 14, "Proposta Econômica");

  var title1 = "Informação adicional";
  doc.setFontSize(20);
  doc.setFontStyle("bold");
  doc.setTextColor(30, 141, 159);
  var textWidth_title1 =
    (doc.getStringUnitWidth(title1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset_title1 = (doc.internal.pageSize.width - textWidth_title1) / 2;

  doc.text(textOffset_title1, 35, title1);

  doc.setTextColor(0, 0, 0);
  doc.setFontType("normal");
  doc.setFontSize(12);
  var mensaje2 =
    "Para conhecer todo o processo de implementação e suporte metodológico que você tem com Acsendo, clique em cada um dos links a seguir: ";
  var text1_split = doc.splitTextToSize(
    mensaje2,
    doc.internal.pageSize.width - 50
  );
  doc.text(30, 45, text1_split);
  doc.addImage(implementacion_pt, "PNG", 60, 60, 95, 10);
  doc.link(60, 60, 95, 10, {url: 'https://soporte.acsendo.com/pt-br/processo-de-implementa%C3%A7%C3%A3o'});
  doc.addImage(capacitacion_pt, "PNG", 60, 75, 95, 10);
  doc.link(60, 75, 95, 10, {url: 'https://soporte.acsendo.com/pt-br/treinamento'});
  doc.addImage(perfil_pt, "PNG", 60, 90, 95, 10);
  doc.link(60, 90, 95, 10, {url: 'https://soporte.acsendo.com/pt-br/perfis-de-plataforma'});
  doc.addImage(soporte_pt, "PNG", 60, 105, 95, 10);
  doc.link(60, 105, 95, 10, {url: 'https://soporte.acsendo.com/pt-br'});
  doc.addImage(requerimientos_pt, "PNG", 60, 120, 95, 10);
  doc.link(60, 120, 95, 10, {url: 'https://soporte.acsendo.com/pt-br/requisitos-t%C3%A9cnicos-para-implementa%C3%A7%C3%A3o'});
  doc.addImage(consultoria_link_pt, "PNG", 60, 135, 95, 10);
  doc.link(60, 135, 95, 10, {url: 'https://soporte.acsendo.com/pt-br/consultoria'});

  var title1 = "Eles já começaram a mudança com Acsendo";
  doc.setFontSize(16);
  doc.setFontStyle("bold");
  doc.setTextColor(30, 141, 159);
  var textWidth_title1 =
    (doc.getStringUnitWidth(title1) * doc.internal.getFontSize()) /
    doc.internal.scaleFactor;
  var textOffset_title1 = (doc.internal.pageSize.width - textWidth_title1) / 2;

  doc.text(textOffset_title1, 160, title1);
  doc.addImage(empresas_pt, "PNG", 33, 170, 150, 80);
  doc.link(33, 170, 150, 80, {url: 'https://www.acsendo.com/pt/historias-de-sucesso'});

  doc.addPage();
  doc.addImage(contraportada, "JPEG", 0, 0, 210, 300);
  doc.setFontSize(14);
  doc.setFontStyle("bold");
  doc.setTextColor(255, 255, 255);
  doc.text(25, 128, nombre_com);
  doc.setFontStyle("normal");
  doc.text(25, 142, numero_com);
  doc.text(25, 150, email_com);

  doc.save("Proposta Econômica" + "- " + nombre_emp + ".pdf");
}
}
