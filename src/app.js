var $ = require('jquery');
var _ = require('lodash');
var jwtjs = require('jwt-js');
var jsrsasign = require('jsrsasign');

function createKey() {

	coinjs.compressed = true;
	var hd = coinjs.hd();
	var masterhd = hd.master(null);
	var master = coinjs.hd(masterhd.privkey);
	$("#xpub").val(masterhd.pubkey);
	$("#xprv").val(masterhd.privkey);
	$("#pub").val(master.keys.address);
	$("#prv").val(master.keys.wif);
	$("#xdinumber").val("=!:cid-2:" + $("#xpub").val());
}

function createJWTA() {

	var xdi = "(" + $("#xdinumber").val() + ")/$ref/";
	$("#xdi").val(xdi);

	var jwt = {};
	jwt.iss = $("#xdinumber").val();
	jwt.sub = $("#xdinumber").val();
	jwt.nbf = jsrsasign.jws.IntDate.get("now");
	jwt.exp = jsrsasign.jws.IntDate.get("now + 1year");
	jwt.iat = jsrsasign.jws.IntDate.get("now");
	jwt.jti = "id123456";
	jwt.typ = "xdi";
	jwt.xdi = xdi;
	$("#jwt").val(JSON.stringify(jwt, null, 2));
}

function createJWTB() {

	var xdi = $("#xdinameyou").val() + "/$ref/" + $("#xdinumberyou").val();
	$("#xdi").val(xdi);

	var jwt = {};
	jwt.iss = $("#xdinumber").val();
	jwt.sub = $("#xdinumberyou").val();
	jwt.nbf = jsrsasign.jws.IntDate.get("now");
	jwt.exp = jsrsasign.jws.IntDate.get("now + 1year");
	jwt.iat = jsrsasign.jws.IntDate.get("now");
	jwt.jti = "id123456";
	jwt.typ = "xdi";
	jwt.xdi = xdi;
	$("#jwt").val(JSON.stringify(jwt, null, 2));
}

function createJWTBExample() {

	$("#xdinameyou").val("=~christophera");
	$("#xdinumberyou").val("=!:cid-2:xpub661MyMwAqRbcFGjxzSNzWNiTaQuToqXFyuhkJcpp1aigdfToMF4tcayQLHByvFsG3Bew1U4p9fePNJe9NQSCXkZCpTpBY61wULeZ1XeiWdo");
}

function createJWS() {

	var prv = $("#prv").val();
    var jwt = $("#jwt").val().replace("\\\n", "\n");
    var jws = new jwtjs.TokenSigner('ES256k', prv).sign(jwt);
	$("#jws").val(jws);

	var parsedjws = new jsrsasign.jws.JWS();
	try {
	  parsedjws.parseJWS(jws);
	} catch (ex) {
	  alert("Error: parseJWS() " + ex);
	  return;
	}
	
	$("#jwsheader").val(parsedjws.parsedJWS.headS, null, 2);
	$("#jwspayload").val(parsedjws.parsedJWS.payloadS, null, 2);
}

$(document).ready(function() {
	$("#createKeyButton").click(function() { createKey(); });
	$("#createJWTAButton").click(function() { createJWTA(); });
	$("#createJWTBButton").click(function() { createJWTB(); });
	$("#createJWTBExampleButton").click(function() { createJWTBExample(); });
	$("#createJWSButton").click(function() { createJWS(); });
});
