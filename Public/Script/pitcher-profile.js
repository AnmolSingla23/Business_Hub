function doPrev(refFile, prevImg) // for preview the file in image box
{
  const [file] = refFile.files
  if (file) {
    prevImg.src = URL.createObjectURL(file)
  }
}

function loard() {
  var active = localStorage.getItem("activeUser");
  // alert(active);
  document.querySelector("#pemail").value = active;
  document.querySelector("#pemail").readOnly = true;
}

///==============search data in pitcher profile=====================

// $(document).ready(function(){

// $("#psearch").ready(function(){
$(document).ready(function () {
  //alert();

  var pEmail = $("#pemail").val();

  var obj = {           //obj creat kiya hai
    type: "get",
    url: "/search-pprofile",        //server ch API ka link ready kiya hai
    data: {
      ppEmail: pEmail

    }
  }

  $.ajax(obj).done(function (respJsonAry) {
    // alert(JSON.stringify(respJsonAry));


    if (respJsonAry.length == 1) {
      $("#pname").val(respJsonAry[0].name);//use table wale col ka name
      $("#pcontact").val(respJsonAry[0].contact);//use table wale col ka name
      $("#paddress").val(respJsonAry[0].address);
      $("#pstate").val(respJsonAry[0].state);
      $("#pcity").val(respJsonAry[0].city);
      $("#pzcode").val(respJsonAry[0].zcode);
      $("#pproof").val(respJsonAry[0].proof);
      $("#pcategory").val(respJsonAry[0].category);
      $("#pcompany").val(respJsonAry[0].company);
      $("#pestd").val(respJsonAry[0].estd);
      $("#pproduct").val(respJsonAry[0].pdetails);
      $("#prevenue").val(respJsonAry[0].revenue);
      $("#pgross").val(respJsonAry[0].gross);
      $("#pother").val(respJsonAry[0].otherinfo);

      $("#phidn").val(respJsonAry[0].ppic); //hidden input type ch pics da name daal dita 
      $("#pprev").prop("src", "pics-uploads/" + respJsonAry[0].ppic); // for show the pic on image prev (stored in folder)

    }
  }).fail(function (kuchErr) {
    alert(kuchErr.toString());
  });

});

    // });