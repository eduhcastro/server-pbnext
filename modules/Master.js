module.exports = class Remote {
    constructor(h,u,d,p) {
        this.host = h;
        this.user = u;
        this.database = d;
        this.password = p;
    }
     Connection(){ 
        const { Pool } = require('pg');
        try{
         const pgg = new Pool({
        host: this.host,
        user: this.user,
        database : this.database,
        password : this.password});
        return pgg
         } catch (e){
             return 0
         }
    }
    async WhatUser (user,pool) {
        const client = await pool.connect()
        let res
        try {
          await client.query('BEGIN')
          try {
            var ress = await client.query("SELECT login FROM accounts WHERE login = '"+user+"';")
            if(ress.rowCount == 1)
                res = 0;
            else
            res = 99;
            await client.query('COMMIT')
          } catch (err) {
            await client.query('ROLLBACK')
            throw err
          }
        } finally {
          client.release()
        }
        return res
      }

    async TryConnect(pool){
        const client = await pool.connect()
        let res
        try {
          await client.query('BEGIN')
          try {
            var ress = await client.query("SELECT * FROM accounts LIMIT 1;")
            res = 1;
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

    State(Key){
        const dotenv = require('dotenv');
        var Cryptr = require('cryptr');
        const jwt = require('jsonwebtoken');
        dotenv.config();
        const jwtSecret = process.env.PRIVATE_JWT;
        const cryptr = new Cryptr(process.env.PRIVATE_PTS);
        const stringSecret = process.env.PRIVATE_STRING;
        let Decodado
        try{
          var Splitado = Key.split("//5Y1RI")
          if(cryptr.decrypt(Splitado[1]) == stringSecret){
          Decodado = jwt.verify(Splitado[0], jwtSecret);
          }else{
            Decodado = 1
          }
        }catch (e){
         Decodado = 1
        }
        return Decodado
      }

      Decode(User){
        const dotenv = require('dotenv');
        dotenv.config();
        var Cryptr = require('cryptr');
        const cryptr = new Cryptr(process.env.PRIVATE_PTS);
          try{
            var Login = cryptr.decrypt(User)
            return Login
          } catch(e){
              return false
          }
      }

      async Login(U,pool){
        const client = await pool.connect()
        let res
        try {
          await client.query('BEGIN')
          try {
            var ress = await client.query("SELECT login,player_id,rank,exp,player_name,login,fights,fights_win,fights_lost,kills_count,deaths_count,headshots_count,money,gp FROM accounts WHERE login = '"+U+"';")
            if(ress.rowCount == 1)
                res = ress.rows;
            else
            res = 99;
            await client.query('COMMIT')
          } catch (err) {
            await client.query('ROLLBACK')
            throw err
          }
        } finally {
          client.release()
        }
        return res
      }

      async Register(U,P,E,pool){
        const Toolss = require("./Tools");
        const Tools = new Toolss();
        const Token = Tools.GenerateToken();
        const client = await pool.connect()
        let res
        try {
          await client.query('BEGIN')
          try {
            var ress = await client.query("INSERT INTO accounts (login,password,email,token) VALUES ('"+U+"','"+P+"','"+E+"','"+Token+"');")
            res = 99;
            await client.query('COMMIT')
          } catch (err) {
            await client.query('ROLLBACK')
            throw err
          }
        } finally {
          client.release()
        }
        return res
      }
}
