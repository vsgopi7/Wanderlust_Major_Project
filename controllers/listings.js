const Listing = require("../models/listing");
module.exports.index =async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

module.exports.renderNewForm =(req, res) => {
    res.render("listings/new.ejs");
  };

module.exports.showListing =async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
    .populate("reviews")
    .populate("owner");
    if(!listing){
      req.flash("error","Listing you requested for does not exist!");
      res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
  };

module.exports.createListing= async (req, res,next) => {
    
      
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    req.flash("success","New Listing created!");
    res.redirect("/listings");
  
  };

module.exports.renderEditForm=async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", { listing });
  };

  module.exports.updateListing =async (req, res) => {
    if(!req.body.listing){
      throw new ExpressError(400,"Send Valid Data for listing");
    }
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  };

  module.exports.destroyListing =async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
  };