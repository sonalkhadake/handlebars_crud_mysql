const express = require("express")
const app = express();
const { Sequelize,  DataTypes } = require('sequelize');
const PORT = process.env.PORT ||5000;
require('dotenv').config()
const {engine}=require("express-handlebars");
console.log(process.env.PORT)



//middlewares
app.use(express.json());
app.use(express.static("public"))
app.use(express.urlencoded({extended:false}));
app.engine('handlebars', engine());
app.set('views', './views');
app.set('view engine', 'handlebars')


// sequilize connection

const sequelize = new Sequelize(process.env.DATABASE, process.env.MYSQLUSERNAME, process.env.MYSQLPASSWORD, {
    host: 'localhost',
    dialect:'mysql' /* one of 'mysql' | 'mariadb' | 'postgres' | 'mssql' */
  });


  async function collection(){          // async function returns a promice
    // testing the database is connected or not
    try {
      await sequelize.authenticate();
      console.log('Connection has been established successfully.');
      return null;
    } catch (error) {
      console.error('Unable to connect to the database:', error);
      return error;
    }
  }

  const Employee = sequelize.define("employees", {
      // Model attributes are defined here
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      empID: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      age: {
        type: DataTypes.INTEGER,
        primaryKey: true,
      },
      place: {
        type: DataTypes.STRING,
        allowNull: false,
      }
     
   
     } );
     
    app.get("/",async(req,res)=>{

        try{
          const user = await Employee.findAll();
          
           
        res.render("home", {data:user});
        console.log(user)
        //   res.json({message:"Success",data:user})

        }
        catch(err){
      
          res.json({message:"Error",data:err})
      
        }
      
      
      })
      




// render the employee page
     app.get("/createAccount", (req,res)=>{
         res.render("employee" )
     })

     // creating account
     app.post("/createAccount",async(req,res)=>{   
        try{
          const body= req.body
          const user = await Employee.create({ 
             name: body.name,
             age:body.age,
             place:body.place
           });
            console.log(req.body)
        //   res.json({message:"Success",data:user})
        res.redirect("/")
        }
        catch(err){
    
          res.json({message:"Error",data:err})
    
        }
    
    
    })
    ///////edit route
    // edit user page

    app.get("/edit/:empID", async(req,res)=>{

      try{
        const user = await Employee.findOne({
          where:{
            empID:req.params.empID
          }
        });
        // res.json({message:"success", data:user})
        res.render("edit", {data:user})
    console.log(user)
      }
      catch(err){
    
        res.json({message:"Error",data:err})
    
      }
    
    
    })

    //////////updating user
    app.post("/editUser/:empID", async(req,res)=>{
      try{
        const body= req.body
    
      const user =await Employee.update({
             name: body.name,
             age:body.age,
             place:body.place
        
      },
        {
        where:{
          empID:req.params.empID
        }
        
        
    
      });
      console.log(user)
      res.redirect("/")
      // res.json({message:"success", data:data})
    
    }catch(err){
    
      res.json({message:"Error",data:err})
    
    }
    })
 



    ////////delete the user

    app.get("/delete/:empID",async(req,res)=>{

  try{
    const user = await Employee.destroy({
      where:{
        empID:req.params.empID
      }
    });
    
      res.redirect("/")
    // res.json({message:"Success"})
  }
  catch(err){

    res.json({message:"Error",data:err})

  }


})




collection().then(err=>{
    if(!err){
        app.listen(PORT, ()=>{
            console.log("your server is running at port"+PORT)
        })
    } else{
        console.log(err)
    }
})

