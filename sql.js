
var c1 = new HATA("sql_sorgu");


const VERI_TABANI = "VetAdmin";

  

module.exports = class SQL {
    
    constructor(callbackOK)
    {
        
        this.connectionDb = null;
        var $this = this;

        mariadb.createConnection({
            socketPath: '/var/run/mysqld/mysqld.sock', 
            user:'wpuser',
            password: 'password',
            connectTimeout:10000
        })
        .then(conn => {
        
            $this.connectionDb = conn;
            c1.log("connected ! connection id is " + conn.threadId);
            c1.log("Sql Kuruldu");
            callbackOK();
        })
        .catch(err => {
            c1.log("not connected due to error: " + err);
        });
    }

    async SQLSorgula(sql,callback,row=false)
    {
        await this.connectionDb.query("USE "+VERI_TABANI);
        var ilk_Query = this.connectionDb.query({rowsAsArray: row, sql: sql} );
        let ilkSorgu = await ilk_Query;
        c1.log("SQLSorgula:" + JSON.stringify(ilkSorgu));
        
        callback(ilkSorgu);

        //res.send("OK");
    }

    /*
    var animals = await SQL.SQLSorgulaASYNC(`
      SELECT _animal.*
      FROM _userConAnimal
      JOIN _animal ON _animal._id_animal=_userConAnimal.animal_id
      WHERE _userConAnimal.user_id=${req.user.id}`);
    */

    async SQLSorgulaASYNC(sql,row=false)
    {
        await this.connectionDb.query("USE "+VERI_TABANI);
        var ilk_Query = this.connectionDb.query({rowsAsArray: row, sql: sql} );
        let ilkSorgu = await ilk_Query;
        var temp = JSON.stringify(ilkSorgu);
        c1.log("SQLSorgulaASYNC:" + JSON.stringify(ilkSorgu));
        return JSON.parse(temp);
        
    }

    async SQLSorgulaASYNC_DELETE(FROM,WHERE)
    {
        await this.connectionDb.query("USE "+VERI_TABANI);
        var sql = `
            DELETE
            FROM ${FROM}
            WHERE ${WHERE}
        `;

        var ilk_Query = this.connectionDb.query({rowsAsArray: true, sql: sql} );
        let ilkSorgu = await ilk_Query;
       

        if(ilkSorgu.warningStatus == 0)
        {
            c1.success("Silme Başarılı");
            return {
                durum:1
            };
        }
        else{
            c1.error("Silme Başarısız");
            c1.error("SQLSorgulaASYNC:" + JSON.stringify(ilkSorgu));
            return {
                durum:0
            };
        }
        
        
    }
    /*
    var Sonuccc = await SQL.SQLSorgulaASYNC_UPDATE(
      "VetAdmin._animal",
      `_animal.hayvanin_adi='${req.body.hayvanin_adi}',_animal.hayvanin_soyadi='${req.body.hayvanin_soyadi}'`,
      "_animal._id_animal="+req.body._id_animal);
    */
    async SQLSorgulaASYNC_UPDATE(FROM,SET,WHERE)
    {
        await this.connectionDb.query("USE "+VERI_TABANI);
        var sql = `
            UPDATE ${FROM}
            SET ${SET}
            WHERE ${WHERE}
        `;

        var ilk_Query = this.connectionDb.query({rowsAsArray: true, sql: sql} );
        let ilkSorgu = await ilk_Query;
       

        if(ilkSorgu.warningStatus == 0)
        {
            c1.success("UPDATE Başarılı");
            return {
                durum:1
            };
        }
        else{
            c1.error("UPDATE Başarısız");
            c1.error("SQLSorgulaASYNC:" + JSON.stringify(ilkSorgu));
            return {
                durum:0
            };
        }
        
        
    }
    
    


    async SQLSorgulaASYNC_INSERT(INTO,data)
    {
        await this.connectionDb.query("USE "+VERI_TABANI);
        var KeysArray = [];
        var ValuesArray = [];
        for ( var property in data ) {
            KeysArray.push("`"+property.toString()+"`"); 
            ValuesArray.push(`'${data[property].toString()}'`); 
        }
        //c1.info(KeysArray);
        //c1.info(ValuesArray);
        var letc = "`";
        var sql = `
        INSERT INTO ${letc}${INTO}${letc} (${KeysArray.join(" ,")}) VALUES (${ValuesArray.join(",")});
        `;
        //c1.warn(sql);
        var ilk_Query = this.connectionDb.query({rowsAsArray: true, sql: sql} );
        let ilkSorgu = await ilk_Query;
        

        if(ilkSorgu.warningStatus == 0)
        {
            c1.success("Ekleme Başarılı : " + INTO);
            c1.success("Eklenen Yer: " + ilkSorgu.insertId);
            return {
                durum:1,
                sonuc:ilkSorgu
            };
        }
        else{
            c1.error("Ekleme Başarısız : " + INTO);
            c1.error("SQLSorgulaASYNC:" + JSON.stringify(ilkSorgu));
            return {
                durum:0
            };
        }
        
        
    }

    async SQL_UPDATE(sql,res)
    {
        await this.connectionDb.query("USE "+VERI_TABANI);
        var ilk_Query = this.connectionDb.query({rowsAsArray: false, sql: sql} );
        let ilkSorgu = await ilk_Query;
        console.log(JSON.stringify(ilkSorgu));

        res.send("OK");
    }
    

}