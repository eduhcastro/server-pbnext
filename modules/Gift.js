const dotenv = require('dotenv');
var Cryptr = require('cryptr');
const jwt = require('jsonwebtoken');
dotenv.config();
const jwtSecret = process.env.PRIVATE_JWT;
const cryptr = new Cryptr(process.env.PRIVATE_PTS);
const Toolss = require("./Tools");
const Tools = new Toolss("localhost", "postgres", "Hidden", "123456");
module.exports = class Gift {
    constructor(h,p) {
        this.token = h;
        this.pool = p
    }
    Verifiy(){
        let Verificacao
        try{
            var token = this.token.split("3V0L1=")
            var Authorization = token[0]
            Verificacao = jwt.verify(Authorization, jwtSecret);
        }catch (e){
            Verificacao = false
        }
        return Verificacao
    }
    async VerifiyGift(U,C,M){
        if(M == 'pin'){
            const client = await this.pool.connect()
            let res
            try {
              await client.query('BEGIN')
              try {
                var ress = await client.query("SELECT * FROM website_pin WHERE pin = '"+C+"';")
                if(ress.rowCount == 1){
                    res = ress.rows[0]
                }else{
                    res = 0
                }
                await client.query('COMMIT')
              } catch (err) {
                res = 0;
                await client.query('ROLLBACK')
                throw err
              }
            } finally {
              client.release()
            }
            return res
            //return {User: U, Code: C, Metod: M}
        }
    }

    async Use(){
        let Usage
        try{
            var Token = this.token.split("3V0L1=")
            var Authorization = Token[0]
            var Dados = jwt.verify(Authorization, jwtSecret);
            var User = Dados.userID
            var Code = cryptr.decrypt(Token[1])
            var Method = cryptr.decrypt(Token[2])
            var Setup = Method == "pin" ? "PIN CASH": "COUPON ITEMS"
            var Key = Tools.GenerateKey();
            const rowsGift = await this.VerifiyGift(User,Code,Method)
            if(rowsGift != 0){
                var Pin = rowsGift.pin
                var Value = rowsGift.value
                const client = await this.pool.connect()
                let updatemoney
                try {
                  await client.query('BEGIN')
                  try {
                    var ress = await client.query("UPDATE accounts SET money = money + '"+Value+"' WHERE login = '"+User+"';")
                    if(ress.rowCount == 1){
                        var ress1 = await client.query("INSERT INTO website_pin_history (key,pin,value,data,owner) VALUES ('"+Key+"','"+Pin+"','"+Value+"','10/10/2030','"+User+"');")
                        var ress2 = await client.query("DELETE FROM website_pin WHERE pin = '"+Pin+"';")
                        updatemoney = 0 // SUCESSO
                    }else{
                        updatemoney = 101 // FALHOU SOMAR
                    }
                    await client.query('COMMIT')
                  } catch (err) {
                    updatemoney = 97; // FALHOU TRY
                    await client.query('ROLLBACK')
                    throw err
                  }
                } finally {
                  client.release()
              }
                Usage = {status: updatemoney, pinvalue: Value, method: Method, setup: Setup, key: Key, date: "24/03/2021"} // SUCESSO 99 
            }else{
                Usage = {status: 103} // CODIGO INCORRETO
            } 
        }catch (e){
            console.log(e)
            Usage = {status: 104}
        }
        return Usage
    }
}