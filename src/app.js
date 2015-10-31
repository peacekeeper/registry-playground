var TokenSigner = require('jwt-js').TokenSigner;

function createKey() {

	coinjs.compressed = true;
	var hd = coinjs.hd();
	var masterhd = hd.master(null);
	var master = coinjs.hd(masterhd.privkey);
	$("#xpub").val(masterhd.pubkey);
	$("#xprv").val(masterhd.privkey);
	$("#pub").val(master.keys.address);
	$("#prv").val(master.keys.wif);
}
