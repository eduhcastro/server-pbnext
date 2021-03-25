module.exports = class Tools {
    makeid(length) {
        var result           = '';
        var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var charactersLength = characters.length;
        for ( var i = 0; i < length; i++ ) {
           result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
     }

    GenerateKey(){
    return `#${this.makeid(3)}-${this.makeid(4)}-${this.makeid(3)}`
 }

}