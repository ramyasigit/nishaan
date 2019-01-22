const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Lot = require('../models/lot');

router.get('/all', (req, res) => {
  Lot.getLots((err, lots) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to find lots'
      });
    } else res.json({
      success: true,
      lots: lots
    });
  });
});

router.post('/add', (req, res, next) => {
  Lot.addLot(req.body, (err, lot) => {
    if (err) {
      res.json({
        success: false,
        msg: "Failed to upload"
      });
    } else {
      res.json({
        success: true,
        msg: 'Data uploaded'
      });

    }
  });
});

router.post('/delete',(req,res)=>{
  Lot.deleteLots(req.body,(err,lot)=>{
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to Delete'
      });
    } else res.json({
      success: true,
      msg: 'Deleted'
    });
  });
});

router.put('/update', (req, res) => {

  Lot.updateLot(req.body, {}, (err) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to Update'
      });
    } else res.json({
      success: true,
      msg: 'Updated'
    });
  });
});
module.exports = router;
