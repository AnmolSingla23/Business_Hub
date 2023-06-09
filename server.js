var express = require("express");
var fileuploader = require("express-fileupload");
var path = require("path");
var mysql = require("mysql");
var nodemailer = require("nodemailer");
var md5 = require("md5");
const crypto = require('crypto');

var app = express();

app.use(express.static("public"));//express.static("public") :- is a middleware

app.use(express.urlencoded(true));
app.use(fileuploader());
//var jsonStr= JSON.stringify(req.body);

app.listen(2023, function () {
    console.log("server started....");
});

app.get("/", function (req, resp) {
    var path = process.cwd() + "/public/index.html";
    resp.sendFile(path);
});

//======================-MTSQL CONNECTIVITY===================================================================================

var dbconfigration = {
    host: "127.0.0.1",  //localhost ka address
    user: "root",  //always root hi rahega
    password: "anmol1427",
    database: "Project2",
    dateStrings: true
};
var dbRef = mysql.createConnection(dbconfigration);
dbRef.connect(function (err) {
    if (err == null)
        console.log("connected Successfully");
    else
        console.log(err);
});

//================Signup Data process=============================================================================================

app.get("/sdb-signup", function (req, resp) {
    var semail = req.query.aemail;
    var spwd = md5(req.query.apwd);
    var sutype = req.query.atype;

    var mailer = req.query.aemail;

    if (semail && spwd && sutype) {

        dbRef.query("insert into users(email,password,utype,dos,status) values(?,?,?,current_date(),?)", [semail, spwd, sutype, 1], function (err) {
            if (err) {
                resp.send("Already a User");

            }
            else {
                console.log("Signed Up successfully......");
                resp.send(sutype);

                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                        user: 'anmolsingla121@gmail.com',
                        pass: 'mtppqkygtydlxfaf'
                    }
                });

                var mailOption = {
                    from: 'anmolsingla121@gmail.com',
                    to: mailer,
                    subject: 'Welcome in Commercial Buzz',
                    text: 'Signup Successfully.........'
                };

                transporter.sendMail(mailOption, function (err, info) {
                    if (err)
                        console.log(err);
                    else
                        console.log('Email Sent:' + info.response);
                });
            }
        });
    }
    else
        resp.send("Plz Enter the all datiles..... ");
});

//======================Login Data process=======================================================================================

app.get("/db-login", function (req, resp) {
    var emaill = req.query.Email;
    var pawd = md5(req.query.Pass);

    if (emaill && pawd) {
        dbRef.query("select * from users where email=? and password=?", [emaill, pawd], function (err, result) {
            if (err != null)
                resp.send(err.toString());

            else if (result.length == 1) {
                if (result[0].status == 1) {
                    //resp.send(result[0].utype);
                    if (result[0].utype == "Shark")
                        resp.send("Shark logined");
                    else if (result[0].utype == "Pitcher")
                        resp.send("Pitcher logined");
                    // resp.send("login ID");
                }
                else if (result[0].status == 0) {
                    resp.send("yor are bocked");
                }
            }
            else
                resp.send("Invalid (plz check email or password)");

        })
    }
    else
        resp.send("Enter your Email and Password.....");
});
//=================forgot-password=======================================================
app.get("/forgot-password", function (req, resp) {

    var fe = req.query.Femail;

    dbRef.query("select * from users where email=?", [fe], function (err, result) {

        if (err != null) {
            resp.send(err.toString());
        }
        else if (result.length == 1) {

            var content = '<p> Hi, ' + result[0].utype + ' please <a href="http://localhost:2023/reset-pass.html"> Click Here </a> to Reset your Password <br><br> Thank you... </p>'

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'anmolsingla121@gmail.com',
                    pass: 'fgtyodjjmkqrrpwm'
                }
            });

            var mailOption = {
                from: 'anmolsingla121@gmail.com',
                to: fe,
                subject: 'Forgot Password',
                html: content
            };

            transporter.sendMail(mailOption, function (err, info) {
                if (err)
                    console.log(err);
                else
                    console.log('Email Sent d:' + info.response);
            });
        }
    })

});

//================reset password==================================================
app.get("/reset-password", function (req, resp) {

    var mail = req.query.forgote;
    console.log(mail);
    var pss = md5(req.query.reset - pwd);
    console.log(pss);
    dbRef.query("select * from users where email=?", [mail], function (err, result) {
        if (err != null)
            resp.send(err.toString());

        else if (result.length == 1) {
            if (pss) {
                dbRef.query("update users set password=? where email=?", [pss, mail], function (err, result) {
                    if (err != null)
                        resp.send(err.toString());
                    else
                        resp.send("Change Pasword success.....");
                });
            }
            else {
                resp.send("Fill new password")
            }
        }
        else
            resp.send("Invalid (plz check email or old_password)");

    })

});


//==================================================================================================================
//-------------------------(Pitcher-Block) -----------------
//=====================================================================================================================

//======================== pitcher-profile save Data===========================================================================

app.post("/psave", function (req, resp) {
    var pemail = req.body.ppemail;
    var name = req.body.ppname;
    var mobile = req.body.ppcontact;
    var address = req.body.ppaddress;
    var state = req.body.ppstate;
    var city = req.body.ppcity;
    var zipcode = req.body.ppzcode;
    var idproof = req.body.ppproof;
    //var pic= req.files.profilePic.name;
    var pic;
    if (req.files !== null) {
        pic = pemail + "," + req.files.profilePic.name;
        //---------upload pics-------------------------------------
        var pics = pemail + "," + req.files.profilePic.name;
        var despath = path.join(__dirname, "public/pics-uploads", pics);

        req.files.profilePic.mv(despath, function () {
            console.log(pics);
        })
    }
    else
        pic = "no pic";
    var category = req.body.ppcategory;
    var company = req.body.ppcompany;
    var estd = req.body.ppestd;
    var pdetail = req.body.ppproduct;
    var rev = req.body.pprevenue;
    var gross = req.body.ppgross;
    var other = req.body.ppother;


    dbRef.query("insert into pprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [pemail, name, mobile, address, state, city, zipcode, idproof, pic, category, company, estd, pdetail, rev, gross, other], function (err) {
        if (err == null) {
            console.log("Record Saved");

            //resp.redirect("");  for show status in other file
        }
        else {

            //console.log(err.toString());
            resp.send(err.toString());
        }
    });
});

//================search data in pitcher profile====================================================================

app.get("/search-pprofile", function (req, resp) {
    var apemail = req.query.ppEmail;
    //console.log(emailKuch);

    dbRef.query("select * from pprofile where email=?", [apemail], function (err, jsonAryResult) {
        // console.log(jsonAryResult)
        if (err != null)
            resp.send(err.toString());

        else
            resp.json(jsonAryResult);
    })
});

//======================update data in pitcher profile============================================================

app.post("/pupdate", function (req, resp) {

    var pemail = req.body.ppemail;
    var name = req.body.ppname;
    var mobile = req.body.ppcontact;
    var address = req.body.ppaddress;
    var state = req.body.ppstate;
    var city = req.body.ppcity;
    var zipcode = req.body.ppzcode;
    var idproof = req.body.ppproof;
    var pic;
    if (req.files != null) {
        pic = pemail + "," + req.files.profilePic.name;

        var despath = path.join(__dirname, "public/pics-uploads", pic);
        req.files.profilePic.mv(despath, function () {
            console.log("pic update success....");
        })
    }
    else
        pic = req.body.pphidn;


    var category = req.body.ppcategory;
    var company = req.body.ppcompany;
    var estd = req.body.ppestd;
    var pdetail = req.body.ppproduct;
    var rev = req.body.pprevenue;
    var gross = req.body.ppgross;
    var other = req.body.ppother;

    dbRef.query("update pprofile set name=?,contact=?,address=?,state=?,city=?,zcode=?,proof=?,ppic=?,category=?,company=?,estd=?,pdetails=?,revenue=?,gross=?,otherinfo=? where email=?",
        [name, mobile, address, state, city, zipcode, idproof, pic, category, company, estd, pdetail, rev, gross, other, pemail], function (err, result) {

            if (err != null) {
                resp.send(err.toString());
            }
            else if (result.affectedRows == 1) {
                console.log("Updated Successfully")
                resp.send("update Done");
            }
            else if (result.affectedRows == 0) {
                console.log("Invalid ID");
            }
            else {
                console.log(err.toString());
            }

        });
});
//=====================Change password of Pitcher===================================================================================
app.get("/change-password", function (req, resp) {
    var e = req.query.pEmail;
    var o = md5(req.query.oldpass);
    var n = md5(req.query.newpass);

    dbRef.query("select * from users where email=? and password=?", [e, o], function (err, result) {
        if (err != null)
            resp.send(err.toString());

        else if (result.length == 1) {
            if (n) {
                if (result[0].utype == "Pitcher") {
                    dbRef.query("update users set password=? where email=?", [n, e], function (err, result) {
                        if (err != null)
                            resp.send(err.toString());
                        else
                            resp.send("Change Pasword success.....");
                    });
                }
                else {
                    resp.send("U R Not Pitcher");
                }
            }
            else {
                resp.send("Fill new password")
            }
        }
        else
            resp.send("Invalid (plz check email or old_password)");

    })
});

//=============Pitcher Find shark in pitcher page================================================================================
//===fetch-dist ====================================
app.get("/Fetch-dist", function (req, resp) {
    dbRef.query("select distinct dist from sprofile", function (err, jsonAryResult) {

        if (err != null)
            resp.send(err.toString());

        else
            resp.json(jsonAryResult);
    })
});

//=================Find-Sharks-in pitcher=============================================================================
app.get("/Find-Shark", function (req, resp) {

    var data = [req.query.Distic, "%" + req.query.domain + "%", req.query.noi];
    dbRef.query("select * from sprofile where dist=? and domainfields like? and noinvestment>=?", data, function (err, jsonAryResult) {

        if (err != null)
            resp.send(err.toString());

        else
            resp.json(jsonAryResult);
    })
});

//=============================
// app.get("/moreDetails", function (req, resp) {
//     var data = [req.query.Email];
//     dbRef.query("select * from sprofile where email=?", data, function (err, table) {
//         if (err)
//             resp.send(err.sqlMessage);
//         else
//             resp.send(table);

//     });

// });


//==================================================================================================================
//    ------------------------       SHARK Block  -----------------
//=====================================================================================================================

//=======================save data of shark-profile============================================================

app.post("/dsubmit", function (req, resp) {

    var Email = req.body.ssemail;
    var Fname = req.body.ssfname;
    var Lname = req.body.sslname;
    var Mobile = req.body.ssphone;
    var Dos = req.body.ssdob;
    var Address = req.body.ssaddress;
    var State = req.body.ssstate;
    var Dist = req.body.ssdist;
    var Company = req.body.sscompany;
    var Investment = req.body.ssinvestment;
    var Incompany = req.body.ssincompany;
    var Adomain = req.body.ssadomain;
    var Other = req.body.ssother;
    var Profilepic = Email + "," + req.files.ssprofilepic.name;

    var despath = path.join(__dirname, "public/pics-uploads", Profilepic);
    req.files.ssprofilepic.mv(despath, function () {
        console.log(Profilepic);
    })

    dbRef.query("insert into sprofile values(?,?,?,?,?,?,?,?,?,?,?,?,?,?)", [Email, Fname, Lname, Mobile, Dos, Address, State, Dist, Company, Investment, Incompany, Adomain, Other, Profilepic], function (err) {
        if (err)
            resp.send(err.toString());
        else
            resp.send("shark profile saved");
        console.log("shark profile saved");
    });
});

//=================Update shark profile======================================================================================

app.post("/eprofile", function (req, resp) {

    var Email = req.body.ssemail;
    var Fname = req.body.ssfname;
    var Lname = req.body.sslname;
    var Mobile = req.body.ssphone;
    var Dos = req.body.ssdob;
    var Address = req.body.ssaddress;
    var State = req.body.ssstate;
    var Dist = req.body.ssdist;
    var Company = req.body.sscompany;
    var Investment = req.body.ssinvestment;
    var Incompany = req.body.ssincompany;
    var Adomain = req.body.ssadomain;
    var Other = req.body.ssother;
    var pic;
    if (req.files != null) {
        pic = Email + "," + req.files.ssprofilepic.name;

        var despath = path.join(__dirname, "public/pics-uploads", pic);
        req.files.ssprofilepic.mv(despath, function () {
            console.log("pic update success....");
        })
    }
    else
        pic = req.body.sshidn;


    dbRef.query("update sprofile set fname=?,lname=?,mobile=?,dob=?,address=?,state=?,dist=?,company=?,noinvestment=?,incompany=?,domainfields=?,otherinfo=?,profilepic=? where email=?",
        [Fname, Lname, Mobile, Dos, Address, State, Dist, Company, Investment, Incompany, Adomain, Other, pic, Email], function (err, result) {

            if (err != null) {
                resp.send(err.toString());
            }
            else if (result.affectedRows == 1) {
                // console.log("Updated Successfully");
                resp.send("Update Done");
            }
            else if (result.affectedRows == 0) {
                console.log("Invalid ID");
            }
            else {
                console.log(err.toString());
            }
        });
});

//====================Search Shark profile================================================================================

app.get("/search-sprofile", function (req, resp) {
    var apemail = req.query.ppEmail;
    //console.log(emailKuch);

    dbRef.query("select * from sprofile where email=?", [apemail], function (err, jsonAryResult) {
        // console.log(jsonAryResult)
        if (err != null)
            resp.send(err.toString());

        else
            resp.json(jsonAryResult);
    })
});
//=====================Change password of Shark===================================================================================

app.get("/change-s-password", function (req, resp) {
    var e = req.query.pEmail;
    var o = md5(req.query.oldpass);
    var n = md5(req.query.newpass);

    dbRef.query("select * from users where email=? and password=?", [e, o], function (err, result) {
        if (err != null)
            resp.send(err.toString());

        else if (result.length == 1) {
            if (n) {
                if (result[0].utype == "Shark") {
                    dbRef.query("update users set password=? where email=?", [n, e], function (err, result) {
                        if (err != null)
                            resp.send(err.toString());
                        else
                            resp.send("Change Pasword success.....");
                    });
                }
                else {
                    resp.send("U R Not Shark");
                }
            }
            else {
                resp.send("Fill new password")
            }
        }
        else
            resp.send("Invalid (plz check email or old_password)");
    })
});
//==================Find Pitcher in Shark page==============================================================================
//=========fetch Category=============================

app.get("/Fetch-Cate", function (req, resp) {
    dbRef.query("select distinct category from pprofile", function (err, result) {
        if (err != null) {
            resp.send(err.toString());
        }
        else {
            resp.json(result);
        }

    })
});
//=================Find-Pitcher============================================================================
app.get("/Find-Cate", function (req, resp) {
    var data = [req.query.Cate, req.query.Reve, req.query.Gro];
    dbRef.query("select * from pprofile where category=? and revenue>=? and gross>?", data, function (err, jsonAryResult) {

        if (err != null)
            resp.send(err.toString());

        else
            resp.json(jsonAryResult);
    })
});

//==================================================================================================================
//----use Angular------------------(Admin-Block) -----------------
//=====================================================================================================================

//================================ Admin-user-manager ==========================================================================

//=============show all user data in admin block================================================================================

app.get("/show-all-users", function (req, resp) {

    dbRef.query("select * from users", function (err, jsonAryResult) {

        if (err != null)
            resp.send(err.toString());

        else
            resp.json(jsonAryResult);
    })
});
//===============Block user =====================================================================================================

app.get("/block-user", function (req, resp) {
    var blockemail = req.query.xyz;

    dbRef.query("update users set status=0 where email=?", [blockemail], function (err, result) {
        if (err != null)
            resp.send(err.toString());
        else if (result.affectedRows == 1)
            resp.send("Status update success.....");
        else
            resp.send("Invalid ID");

    })
});
//===============Active user =====================================================================================================

app.get("/activate-user", function (req, resp) {
    var actemail = req.query.xy;

    dbRef.query("update users set status=1 where email=?", [actemail], function (err, result) {
        if (err != null)
            resp.send(err.toString());
        else if (result.affectedRows == 1)
            resp.send("Status update success.....");
        else
            resp.send("Invalid ID");
    })
});
//========================Admin-Show-All-Pitcher==================================================================================

//=============show all Pitcher data in admin block================================================================================

app.get("/show-all-pitcher", function (req, resp) {

    dbRef.query("select * from pprofile", function (err, jsonAryResult) {

        if (err != null)
            resp.send(err.toString());

        else
            resp.json(jsonAryResult);
    })
});
//========================Admin-Show-All-Shark==================================================================================

//=============show all Shark data in admin block================================================================================

app.get("/show-all-shark", function (req, resp) {

    dbRef.query("select * from sprofile", function (err, jsonAryResult) {

        if (err != null)
            resp.send(err.toString());

        else
            resp.json(jsonAryResult);
    })
});



