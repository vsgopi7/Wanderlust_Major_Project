const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {reviewSchema}= require("../schema.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
//reviews
//post route

const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
  
    if(error){
      let errMsg = error.details.map((el)=>el.message).join(",");
      throw new ExpressError(400,errMsg);
    }else{
      next();
    }
  };



router.post("/",validateReview, wrapAsync( async (req, res) => {
    try {
      let listing = await Listing.findById(req.params.id);
      if (!listing) return res.status(404).send("Listing not found");
  
      if (!listing.reviews) listing.reviews = []; // Initialize if undefined
  
      let newReview = new Review(req.body.review);


      listing.reviews.push(newReview);
      await newReview.save();
      await listing.save();
  
      res.redirect(`/listings/${listing._id}`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Something went wrong");
    }
  }));
  
  module.exports = router;