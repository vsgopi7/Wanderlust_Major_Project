const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const flash = require("connect-flash");
const {saveRedirectUrl} = require("../middleware.js");

router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
});

router.post("/signup",wrapAsync(async (req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser = new User({email,username});
        const registeredUser=await User.register(newUser,password);
        req.login(registeredUser,(err) => {
            if (err) {
                return next(err); // Pass the error to the next middleware
            }
            req.flash("success","welcome to Wanderlust");
            res.redirect("/listings");
        });


    }catch(e){
        req.flash("error",e.message);
        res.redirect("/listings");

    }
    
}));


router.get("/login",(req,res)=>{
    res.render("users/login.ejs");
});

router.post("/login",
    saveRedirectUrl,
    passport.authenticate("local",{failureRedirect:"/login",failureFlash:true}), async(req,res)=>{
    req.flash("success","Welcome back to Wanderlust");
    let redirectUrl= res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);
});


router.get("/logout", (req, res, next) => {
    req.logOut((err) => {
        if (err) {
            return next(err); // Pass the error to the next middleware
        }
        req.flash("success", "You have logged out successfully!");
        res.redirect("/listings"); // Redirect to the desired page
    });
});




module.exports = router;