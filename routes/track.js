const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Track = require('../models/tracks');

router.get('/all', (req, res) => {
  Track.getTracks((err, track) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to find track'
      });
    } else res.json({
      success: true,
      track: track
    });
  });
});

router.post('/add', (req, res, next) => {
  Track.addTrack(req.body, (err, track) => {
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
  Track.deleteTracks(req.body,(err,track)=>{
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
  Track.updateTrack(req.body, {}, (err) => {
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
