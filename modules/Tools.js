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

   GenerateToken(){
      return this.makeid(32)
   }

   async userSeach(user,pool){
      const client = await pool.connect()
      let res
      try {
        await client.query('BEGIN')
        try {
          var ress = await client.query("SELECT login,player_id FROM accounts WHERE login = '"+user+"';")
          if(ress.rowCount == 1)
              res = ress.rows;
          else
          res = 0;
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