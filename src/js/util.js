function parseHexString(str) { 
    var result = "";
    while (str.length >= 2) { 
        result += String.fromCharCode(parseInt(str.substring(0, 2), 16));
        str = str.substring(2, str.length);
    }

    return result;
}
