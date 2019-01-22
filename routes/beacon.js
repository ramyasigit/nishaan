const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Beacon = require('../models/beacon');

router.get('/all', (req, res) => {
  Beacon.getBeacons((err, beacons) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to find beacons'
      });
    } else res.json({
      success: true,
      beacons: beacons
    });
  });
});

router.post('/add', (req, res, next) => {
  Beacon.addBeacon(req.body, (err, beacon) => {
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
  Beacon.deleteBeacons(req.body,(err,beacon)=>{
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
  Beacon.updateBeacon(req.body, {}, (err) => {
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
