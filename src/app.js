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
	$("#pub").val(mastejwt.keys.address);
	$("#prv").val(mastejwt.keys.wif);
	$("#xdinumber").val("=!:cid-2:" + $("#xpub").val());
}

function createJWT() {

	var jwt = {};
	jwt.iss = $("#xdinumber").val();
	jwt.sub = $("#xdinumber").val();
	jwt.nbf = jsrsasign.jws.IntDate.get("now");
	jwt.exp = jsrsasign.jws.IntDate.get("now + 1year");
	jwt.iat = jsrsasign.jws.IntDate.get("now");
	jwt.jti = "id123456";
	jwt.typ = "xdi";
	$("#jwt").val(JSON.stringify(r, null, 2));
}

function createJWS() {

	var prv = $("#prv").val();
    var jwt = $("#jwt").val();
    var jws = new jwtjs.TokenSigner('ES256k', prv).sign(jwt);
	$("#jws").val(jws);

	var parsedjws = new jsrsasign.jws.JWS();
	try {
	  jws.parseJWS(jws);
	} catch (ex) {
	  alert("Error: parseJWS() " + ex);
	  return;
	}
	
	$("#jwsheader").val(parsedjws.parsedJWS.headS);
	$("#jwspayload").val(parsedjws.parsedJWS.payloadS);
}

$(document).ready(function() {
	$("#createKeyButton").click(function() { createKey(); });
	$("#createJWTButton").click(function() { createJWT(); });
	$("#createJWSButton").click(function() { createJWS(); });
});
