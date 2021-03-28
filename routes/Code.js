module.exports = function(app,Gift,pool){
app.post('/gift', async (req, res) => {
    var TokenComplet = req.body.token
    const Giftt = new Gift(TokenComplet,pool);
    const Verifiy = Giftt.Verifiy()
   console.log({
      Action: "Code",
      Token: req.body.token,
      Check: Verifiy == false ? "Not Authorized": "Authorized"
   })
    if(Verifiy == false){
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
              value: UsageGift.valueresult,
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
