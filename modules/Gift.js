const dotenv = require('dotenv');
const Toolss = require("./Tools");
const Tools = new Toolss();
const jwt = require('jsonwebtoken');
var Cryptr = require('cryptr');
dotenv.config();
const jwtSecret = process.env.PRIVATE_JWT;
const cryptr = new Cryptr(process.env.PRIVATE_PTS);

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

    async VerifiyCouponUser(C,U){
        const client = await this.pool.connect()
        let res
        try {
            await client.query('BEGIN')
            try {
              var ress = await client.query("SELECT * FROM website_coupon_usage WHERE coupon = '"+C+"' AND login = '"+U+"';")
              if(ress.rowCount >= 1){
                  res = ress.rows
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
    }

    async VerifyItemEx(U,I){
      const client = await this.pool.connect()
      let Vri
      try {
          await client.query('BEGIN')
          try {
            var ress = await client.query("SELECT * FROM player_items WHERE item_id = '"+I+"' AND owner_id = '"+U+"';")
            if(ress.rowCount >= 1){
              Vri = ress.rows
            }else{
              Vri = false
            }
            await client.query('COMMIT')
          } catch (err) {
            Vri = 'Brutal';
            await client.query('ROLLBACK')
            throw err
          }
        } finally {
          client.release()
        }
        return Vri
    }
    async DC(c){
      const client = await this.pool.connect()
      let res
      try {
        await client.query('BEGIN')
        try {
          var ress = await client.query("DELETE FROM website_coupon WHERE cupon = '"+c+"';")
              res = 0
          await client.query('COMMIT')
        } catch (err) {
          res = 1;
          await client.query('ROLLBACK')
          throw err
        }
      } finally {
        client.release()
      }
      return res
    }
    async VerifiyGift(U,C,M){
        const client = await this.pool.connect()
        let res
        if(M == 'pin'){
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
        }else{
          
            try {
                await client.query('BEGIN')
                try {
                  var ress = await client.query("SELECT * FROM website_coupon WHERE cupon = '"+C+"';")
                  if(ress.rowCount >= 1){
                    if(await this.VerifiyCouponUser(C,U) == 0){
                        res = {dt: ress.rows, drc: ress.rowCount}
                    }else{
                        res = 0
                    }
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
        }
    }


    async UsageItem(u,d,m,k){
      var i = d.citem_id // This is the item id
      var n = d.citem_name // This is the item name
      var c = d.c_count // This is the item count
      var y = d.c_category // This is the item category
      var p = d.permanet // Coupon boolean verification
      var cp = d.cupon // Coupon boolean verification
      var ui = await Tools.userSeach(u,this.pool) // User id owner
      const client = await this.pool.connect()
      let status
      const v = await this.VerifyItemEx(ui[0].player_id,i) // Verification of the item with user and item id
      if(await this.VerifiyCouponUser(cp,u) == 0){
      await this.InsertCouponUsage(u,cp,k) // Insert Usage
      }
      if(v == 'Brutal'){ // Error trying to check
        return 204; // Code error 
      }
      if(v == false){ // Actions for the nonexistent item
        // Script to insert non-existent weapon
        try {
          await client.query('BEGIN')
          try {
             await client.query("INSERT INTO player_items (owner_id,item_id,item_name,count,category,equip) VALUES ('"+ui[0].player_id+"','"+i+"','"+n+"','"+c+"','"+y+"','1');")
              status = 0 // Code OK
            await client.query('COMMIT')
          } catch (err) {
            status = 1; // Code Error
            await client.query('ROLLBACK')
            throw err
          }
        } finally {
          client.release()
        }
        return status
      }else{ // Script for existing item, adding / Updating date
        const using = v[0]
        var oi = using.object_id
        var owi = using.owner_id
        var iti = using.item_id
        var cnt = using.count
        var cty = using.category
        var eqp = using.equip
        if(cty == 1 || cty == 3){ // Separating categories
          if(eqp == 1){ // Unused Item If
          var newcount = parseInt(cnt) + parseInt(c) // Adding quantity in unused items.
          try {
            await client.query('BEGIN')
            try {
               await client.query("UPDATE player_items SET count = '"+newcount+"' WHERE object_id = '"+oi+"';")
                status = 0
              await client.query('COMMIT')
            } catch (err) {
              status = 1;
              await client.query('ROLLBACK')
              throw err
            }
          } finally {
            client.release()
          }
          return status
          }
          if(eqp == 2){ // Item if in use
            var dateold = { // Turning count into data
              y: cnt.substr(0,2), // Year
              m: cnt.substr(2,2), // Mounth
              d: cnt.substr(4,2) // Day
              }
            var ctd =  Math.floor((c % 31536000) / 86400) // Convert seconds to days -> Days to add on Date
            var someDate = new Date('20'+dateold.y+'/'+dateold.m+'/'+dateold.d+''); // Create date Old
            someDate.setDate(someDate.getDate() + ctd); // Adding days now
            var dd = someDate.getDate() <= 9 ? 0+''+someDate.getDate(): someDate.getDate();
            var mm = someDate.getMonth() + 1;
            var mmm = mm <= 9 ? 0+''+mm: mm
            var yy = someDate.getFullYear();
            var dttb = yy.toString().substr(2,2)+''+mmm+''+dd+'2020' // Convert format to database->2020 = H:i
            try {
              await client.query('BEGIN')
              try {
                 await client.query("UPDATE player_items SET count = '"+dttb+"' WHERE object_id = '"+oi+"';")
                  status = 0
                await client.query('COMMIT')
              } catch (err) {
                status = 1;
                await client.query('ROLLBACK')
                throw err
              }
            } finally {
              client.release()
            }
            return status
          }
        }
        if(cty == 2){
          /*
          ==== WARNING ====
          This one would be the part to add Characters / Masks and the like in this category.But the v3.24 system is not so simple, I don't know if there are other versions but the one I'm using, to add a character you need to update / insert the character in 2 tables, and also have the fact that the character's SLOT.
          I tried to do it before but the character was always Eternal, and after disconnecting from the account the account was in trouble.
          ================
          */
        }
        console.log({
          using: v
        })
        return status; 
      }
    }

    async InsertCouponUsage(u,c,k){
      const client = await this.pool.connect()
      let res
          try {
            await client.query('BEGIN')
            try {
              var ress = await client.query("INSERT INTO website_coupon_usage (login,coupon,id) VALUES ('"+u+"','"+c+"','"+k+"');")
              res = 0
              await client.query('COMMIT')
            } catch (err) {
              res = 1;
              await client.query('ROLLBACK')
              throw err
            }
          } finally {
            client.release()
          }
          return res
    }

    async UpdateItems(u,e,c){
      var name = e.citem_name
      const client = await this.pool.connect()
      let res
          try {
            await client.query('BEGIN')
            try {
              var ress = await client.query("SELECT * FROM website_coupon_usage WHERE coupon = '"+c+"' AND login = '"+u+"';")
              if(ress.rowCount >= 1){
                var itemsnames = ress.rows[0].items
                  const splits = itemsnames != null ? itemsnames.split("null"): ''
                  var newitem = `${name},${splits}` 
                  await client.query("UPDATE website_coupon_usage SET items = '"+newitem+"' WHERE login = '"+u+"' AND coupon = '"+c+"';")
                  res = 1
              }else{
                  res = 0
              }
              await client.query('COMMIT')
            } catch (err) {
              res = 1;
              await client.query('ROLLBACK')
              throw err
            }
          } finally {
            client.release()
          }
          return res
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
                if(Method == 'coupon'){
                  for(var i = 0; i < rowsGift.drc; i++){
                    var Inserir =  await this.UsageItem(User,rowsGift.dt[i],Method,Key)
                    await this.UpdateItems(User,rowsGift.dt[i],rowsGift.dt[0].cupon)
                    if(i == rowsGift.drc-1){
                      const mi = await this.VerifiyCouponUser(rowsGift.dt[0].cupon,User)
                      if(rowsGift.dt[i].permanent == false){
                      if(this.DC(rowsGift.dt[i].cupon) == 1){
                        Usage = {status: 104}
                        console.log('Erro ao Deletar!')
                      }else{
                        if(Inserir == 0){
                          Usage = {status: 0, valueresult: mi[0].items, method: Method, setup: Setup, key: Key, date: "27/03/2021"} // OK
                        }else{
                          Usage = 104
                        }
                      console.log('Deletado!')
                      }
                      }else{
                        if(Inserir == 0){
                          Usage = {status: 0, valueresult: mi[0].items, method: Method, setup: Setup, key: Key, date: "27/03/2021"} // OK
                        }else{
                          Usage = 104
                        }
                        console.log('Pronto!')
                      }
                    }
                  }
                }else{
                var Pin = rowsGift.pin
                var Value = rowsGift.value
                const client = await this.pool.connect()
                let updatemoney
                try {
                  await client.query('BEGIN')
                  try {
                    var ress = await client.query("UPDATE accounts SET money = money + '"+Value+"' WHERE login = '"+User+"';")
                    if(ress.rowCount == 1){
                        await client.query("INSERT INTO website_pin_history (key,pin,value,data,owner) VALUES ('"+Key+"','"+Pin+"','"+Value+"','10/10/2030','"+User+"');")
                        await client.query("DELETE FROM website_pin WHERE pin = '"+Pin+"';")
                        updatemoney = 0
                    }else{
                        updatemoney = 101
                    }
                    await client.query('COMMIT')
                  } catch (err) {
                    updatemoney = 97;
                    await client.query('ROLLBACK')
                    throw err
                  }
                } finally {
                  client.release()
              }
                Usage = {status: updatemoney, valueresult: Value, method: Method, setup: Setup, key: Key, date: "27/03/2021"} // SUCESSO 99 
            }
            }else{
                Usage = {status: 103}
            } 
        }catch (e){
            console.log(e)
            Usage = {status: 104}
        }
        return Usage
    }
}
