const express = require('express');
const router = express.Router();
const config = require('../config/database');
const Gateway = require('../models/gateway');
const app = require('../app');
router.get('/all', (req, res) => {
  Gateway.getGateways((err, gateways) => {
    if (err) {
      console.error(err);
      res.json({
        success: false,
        msg: 'Failed to find gateways'
      });
    } else res.json({
      success: true,
      gateways: gateways
    });
  });
});

router.post('/add', (req, res, next) => {
  Gateway.getGatewaybyName(req.body.deviceName, (gatway) => {
    if (gatway) res.json({
      success: false,
      msg: "Name already exists"
    });
    else {
      Gateway.addGateway(req.body, (err, gateway) => {
        if (err) res.json({
          success: false,
          msg: "Failed to upload"
        });
        else res.json({
          success: true,
          msg: 'Data uploaded'
        });
      });
    }
  });
});

router.post('/delete', (req, res) => {
  Gateway.deleteGateways(req.body, (err, gateway) => {
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
  Gateway.updateGateway(req.body, {}, (err) => {
    app.ios("newGateway", "device");
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
router.put('/updateState', (req, res) => {
  Gateway.updateGatewayState(req.body, {}, (err) => {
    app.ios("newGateway", "device");
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

router.put('/updateCurrentTrack', (req, res) => {
  Gateway.updateGatewayCurrentTrack(req.body, {}, (err) => {
    app.ios("newGateway", "device");
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

router.put('/updateTracks', (req, res) => {
  Gateway.updateGatewayTracks(req.body, {}, (err) => {
    app.ios("newGateway", "device");
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
