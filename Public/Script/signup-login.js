$(document).ready(function () {

  $("#adminlogin").click(function () {

    window.location.href = "admin-page.html";

  })

  $("#Formemail").blur(function () {

    var exp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var email = $("#Formemail").val();

    if (exp.test(email) == true) {
      $(this).removeClass("not-ok").addClass("ok");
      $("#errEmail").html("Valid");
      $("#errEmail").css("color", "green");
      //$("#errEmail").removeClass("not-ok-pic").addClass("ok-pic");
    }
    else {
      $(this).removeClass("ok").addClass("not-ok");
      $("#errEmail").html("Plz enter Valid Id Email");
      $("#errEmail").css("color", "red");
      //$("#errEmail").removeClass("ok-pic").addClass("not-ok-pic");
    }
  });
  //========================================================================
  $("#Formpass").blur(function () {
    var pass = $("#Formpass").val();
    var r = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
    if (r.test(pass) == true) {
      //alert("Ok");
      $(this).css("border", "1px solid green");
      $("#errPass").html("ok");
      $("#errPass").css("color", "green");
    }
    else {
      //alert("Invalid")   ;
      $(this).css("border", "1px solid red");
      $("#errPass").html("Plz enter Stong Passwords");
      $("#errPass").css("color", "red");
    }
  });
  //=======================login validation=======================================
  $("#Form-email").blur(function () {

    var exp = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    var email = $("#Form-email").val();

    if (exp.test(email) == true) {
      $(this).removeClass("not-ok").addClass("ok");
      $("#err-Email").html("Valid");
      $("#err-Email").css("color", "green");
      //$("#errEmail").removeClass("not-ok-pic").addClass("ok-pic");
    }
    else {
      $(this).removeClass("ok").addClass("not-ok");
      $("#err-Email").html("Invalid Email");
      $("#err-Email").css("color", "red");
      //$("#errEmail").removeClass("ok-pic").addClass("not-ok-pic");
    }
  });

  //===================signup button process================================================

  $("#signup-process-data").click(function () {
    // alert();
    var Email = $("#Formemail").val();
    var Pwd = $("#Formpass").val();
    var Type = $("#sertype").val();

    var obj = {
      type: "get",
      url: "/sdb-signup",
      data: {
        aemail: Email,
        apwd: Pwd,
        atype: Type,
      }
    }

    $.ajax(obj).done(function (myResponse) {
      if (myResponse == "Shark")
        window.location.href = "sharkpage.html";
      else if (myResponse == "Pitcher")
        window.location.href = "pitcherpage.html";

    }).fail(function (myResponse) {
      $("#result").html(myResponse);
      $("#result").css("color", "red")
    })

  });
  //===================signup-pass eye======================
  $(".fa").mousedown(function () {
    $("#Formpass").prop("type", "text");
    $(".fa").removeClass("bi-eye").addClass("bi-eye-slash");
  });

  $(".fa").mouseup(function () {
    $("#Formpass").attr("type", "password");
    $(".fa").removeClass("bi-eye-slash").addClass("bi-eye");
  });

  //====================Login button process=================================================

  $("#login-process-data").click(function () {

    var LEmail = $("#Form-email").val();
    var Lpwd = $("#Form-pass").val();
    var obj = {
      type: "get",
      url: "/db-login",
      data: {
        Email: LEmail,
        Pass: Lpwd
      }
    }

    $.ajax(obj).done(function (resResponse) {
      localStorage.setItem("activeUser", LEmail);


      // if(resResponse.trim()=='Shark')
      //     window.location.href='sharkpage.html';
      //     else if(resResponse.trim()=='Pitcher')
      //     window.location.href='pitcherpage.html';
      if (resResponse == 'Shark logined')
        //   location.href='sharkpage.html';
        location.replace("sharkpage.html");
      else if (resResponse == 'Pitcher logined')
        // location.href='pitcherpage.html';
        location.replace("pitcherpage.html");
      //   $("#lresult").html(resResponse);

    }).fail(function (errresp) {
      alert(errresp.toString());
      // $("#lresult").html(errresp);
    });
  });
  //=================login-pass   eye==================================
  $(".fa").mousedown(function () {
    $("#Form-pass").prop("type", "text");
    $(".fa").removeClass("bi-eye").addClass("bi-eye-slash");
  });

  $(".fa").mouseup(function () {
    $("#Form-pass").attr("type", "password");
    $(".fa").removeClass("bi-eye-slash").addClass("bi-eye");
  });
  //=============================================================
  //===================forgot================================================

  $("#forgot-pass").click(function () {
    // alert();
    var F_email = $("#forgotemail").val();

    var obj = {
      type: "get",
      url: "/forgot-password",
      data: {
        Femail: F_email,
      }
    }

    $.ajax(obj).done(function (msgres) {
      alert(msgres);
    }).fail(function (msgerr) {
      console.log(msgerr.toString());

    })
  });

}); //end
