var $ = require('jquery');
var _ = require('lodash');
var jwtjs = require('jwt-js');
var jsrsasign = require('jsrsasign');

function createWords() {

    var mnemonic = new Mnemonic("english");
    var numWords = 12;
    var strength = numWords / 3 * 32;
    var phrase = mnemonic.generate(strength);
    $("#phrase").val(phrase);
}

function createKey() {

    var mnemonic = new Mnemonic("english");
    var phrase = $("#phrase").val();
    var passphrase = '';
    var seed = mnemonic.toSeed(phrase, passphrase);
    var network = bitcoin.networks.bitcoin;
	var privkey = bitcoin.HDNode.fromSeedHex(seed, network);

	coinjs.compressed = true;
//	alert(privkey.toBase58());
	var master = coinjs.hd(privkey.toBase58());
	$("#xpub").val(master.keys_extended.pubkey);
	$("#xprv").val(master.keys_extended.privkey);
	$("#pub").val(master.keys.address);
	$("#prv").val(master.keys.wif);
	$("#der").val("m");
	$("#xdinumber").val("=!:cid-2:" + $("#xpub").val());

	$("#qrcode").empty();
	var qrcode = new QRCode("qrcode");
	qrcode.makeCode("bitcoin:"+master.keys.address);
}

function createJWTA() {

	var xdi = "/$is$ref/(" + $("#xdinumber").val() + ")";
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

	coinjs.compressed = true;
	var hd = coinjs.hd();
	var masterhd = hd.master(null);

	$("#xdinameyou").val("=~christophera");
	$("#xdinumberyou").val("=!:cid-2:" + masterhd.pubkey);
}

function createJWTC() {

	var xdi = "";
	$("#xdi").val(xdi);

	var jwt = {};
	jwt.iss = $("#xdinumber").val();
	jwt.sub = $("#xdinumber").val();
	jwt.nbf = jsrsasign.jws.IntDate.get("now");
	jwt.exp = jsrsasign.jws.IntDate.get("now + 1year");
	jwt.iat = jsrsasign.jws.IntDate.get("now");
	jwt.jti = "id123456";
	jwt.typ = undefined;
	jwt.xdi = undefined;
	$("#jwt").val(JSON.stringify(jwt, null, 2));
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

	var jwsjson = {};
	jwsjson.header = JSON.parse(parsedjws.parsedJWS.headS);
	jwsjson.payload = JSON.parse(JSON.parse(parsedjws.parsedJWS.payloadS));
	jwsjson.signature = parsedjws.parsedJWS.sigvalH;
	$("#jwsjson").val(JSON.stringify(jwsjson, null, 2));
}

$(document).ready(function() {
	$("#createWordsButton").click(function() { createWords(); });
	$("#createKeyButton").click(function() { createKey(); });
	$("#createJWTAButton").click(function() { createJWTA(); });
	$("#createJWTBButton").click(function() { createJWTB(); });
	$("#createJWTBExampleButton").click(function() { createJWTBExample(); });
	$("#createJWTCButton").click(function() { createJWTC(); });
	$("#createJWSButton").click(function() { createJWS(); });
});
