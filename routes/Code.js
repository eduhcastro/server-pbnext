module.exports = function(app,Gift,pool){
app.post('/gift', async (req, res) => {
    var TokenComplet = req.body.token
  // console.log({
  //    Token: req.body.token,
  //    Zero: req.body.token.split("3V0L1=")[0],
  //    Um: req.body.token.split("3V0L1=")[1],
  //    Dois: req.body.token.split("3V0L1=")[2]
  // })
    const Giftt = new Gift(TokenComplet,pool);
    console.log(Giftt.Verifiy())
    if(Giftt.Verifiy() == false){ // VERIFICAÇÃO DO TOKEN
       res.status(403)
       res.json({
          objects: {},
          status: {
             server: true,
             error: true,
             errormsg: "Invalid Token",
             errorcod: 103
          }
       })
       res.end();
       return;
    }
    const UsageGift = await Giftt.Use() 
    console.log(UsageGift)
    if(UsageGift.status == 0){
        res.status(200)
        res.json({
           objects: {
              value: UsageGift.pinvalue,
              method: UsageGift.method,
              data: UsageGift.date,
              key: UsageGift.key,
              setup: UsageGift.setup
           },
           status: {
              server: true,
              error: false,
              errorcod: UsageGift.status
           }
        });
        res.end();
    }else{
        res.status(400)
        res.json({
           objects: {
              gift: null
           },
           status: {
              server: true,
              error: true,
              errorcod: UsageGift.status
           }
        });
        res.end();
    }
})
}