function doPrev(refFile, prevImg) // for preview the file in image box
{
  const [file] = refFile.files
  if (file) {
    prevImg.src = URL.createObjectURL(file)
  }
}

//==========================================================
function sloard() {
  var active = localStorage.getItem("activeUser");
  // alert(active);
  document.querySelector("#semail").value = active;
  document.querySelector("#semail").readOnly = true;
}
//==========================

function select(x) {
  document.querySelector("#sadomain").value += x[x.selectedIndex].text + ",";
}

///==============search data in pitcher profile=====================

$(document).ready(function () {

  // $("#ssearch").click(function(){
  //alert();

  var pEmail = $("#semail").val();

  var obj = {           //obj creat kiya hai
    type: "get",
    url: "/search-sprofile",        //server ch API ka link ready kiya hai
    data: {
      ppEmail: pEmail

    }
  }

  $.ajax(obj).done(function (respJsonAry) {
    // alert(JSON.stringify(respJsonAry));

    if (respJsonAry.length == 0)

      if (respJsonAry.length == 1) {
        $("#sfname").val(respJsonAry[0].fname);//use table wale col ka name
        $("#slname").val(respJsonAry[0].lname);//use table wale col ka name
        $("#sphone").val(respJsonAry[0].mobile);
        // alert(respJsonAry[0].dos);
        $("#sdob").val(respJsonAry[0].dob);
        $("#saddress").val(respJsonAry[0].address);
        $("#sstate").val(respJsonAry[0].state);
        $("#sdist").val(respJsonAry[0].dist);
        $("#scompany").val(respJsonAry[0].company);
        $("#sinvestment").val(respJsonAry[0].noinvestment);
        $("#sincompany").val(respJsonAry[0].incompany);
        $("#sadomain").val(respJsonAry[0].domainfields);
        $("#sother").val(respJsonAry[0].otherinfo);

        $("#shidn").val(respJsonAry[0].profilepic); //hidden input type ch pics da name daal dita 
        $("#sprev").prop("src", "pics-uploads/" + respJsonAry[0].profilepic); // for show the pic on image prev (stored in folder)

      }
  }).fail(function (kuchErr) {
    alert(kuchErr.toString());
  });

  // });

});