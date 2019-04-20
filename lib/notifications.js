/**
 * Routes for notification
 * @module server/routes/notification
 */

//Package imports
const express = require('express');
const util = require('util');
const joi = require('joi');
const https = require('https');
const moment = require('moment-timezone');
const bcrypt = require('bcrypt');
const auth = require('basic-auth');
const _ = require('underscore');
const env = process.env.NODE_ENV || 'local';

//Config imports
const appConfig = require('../../env-config/notificationsConfig/notificationsConfig-' + env + '/notificationsConfig-' + env);

//Utils, Models and Misc imports
const responseUtils = require('../../utils/common/response');
const requestUtils = require('../../utils/common/request');
const accountUtils = require('../../utils/account');
const sendMailUtils = require('../../utils/notification/send-mail');
const sendSMSUtils = require('../../utils/notification/send-sms');
const sendNettracAlarmUtils = require('../../utils/notification/send-nettrac-alarm');

//File globals
const router = express.Router();
const removeXpoweredHeader = responseUtils.removeXpoweredHeader;
const throwUserErrorRespOnJoiError = requestUtils.throwUserErrorRespOnJoiError;
const getSensorListByGroupId = accountUtils.sensors.getSensorListByGroupId;
const getGatewayListByGroupId = accountUtils.gateways.getGatewayListByGroupId;
const getGatewayConnectionStatus = accountUtils.simStatus.checkConnectionGatewayStatus;

const requiredValidationOptionForJoi = "'{{key}}' is required";
const joiValidationOptions = {
  language: {
    any: {
      required: requiredValidationOptionForJoi,
    },
    number: {
      base: "'{{key}}' must be a number"
    },
    string: {
      base: "'{{key}}' must be a string"
    }
  }
};

/**
 * @api {post} /notification/nettrac-alarm sendNettracAlarm
 * @apiVersion 1.0.0
 * @apiName sendNettracAlarm
 * @apiDescription sends nettrac alarm notification
 * @apiGroup Secure Routes
 *
 * @apiParam {String} client-secret Client Secret
 * @body {Object} object with type of alram and other information.
 *
 * @apiSuccess (200) {Object[]} response Response
 *
 * @apiError (401, 400, 404) {Object} response Error response
 * @apiError (401, 400, 404) {Boolean} response.success Error status flag
 * @apiError (401, 400, 404) {String} response.message Error message
 * @apiError (401, 400, 404) {Number} response.errorCode Status code
 */
router.post('/nettrac-alarm', (req, res) => {
  removeXpoweredHeader(res);

  //Body Schema for validation
  let bodySchema = joi.object().keys({
    active: joi.boolean().required(),
    type: joi.string().required(),
    source: joi.string().required(),
    message: joi.string().required()
  });

  let accountInfo = req.body;
  // Validates the input in the params. If valid, then continue, otherwise throw 400.
  joi.validate(req.body, bodySchema, joiValidationOptions,  (error) => {
    if (error) {
      console.error('\tError validating request in /nettrac-alarm API. ' + error + '. req.body: ' + JSON.stringify(req.body) + '\n');
      return throwUserErrorRespOnJoiError(error, res);
    } else {
      sendNettracAlarmUtils.sendNettracAlarm(req.body).then(nettracAlarmStatus => {
        console.log('sendNettracAlarm complete, ', JSON.stringify(nettracAlarmStatus));
        res.send({success: true, message: 'Alarm sent.'});
      }, error => {
        console.error('\tError in sending Alarm.' + JSON.stringify(error) + '\n');
        res.send({success: false, errorCode: 500, message: 'Error in sending Alarm.'});
      });
    }
  });
});

/**
 * @api {post} /notification/no-data sendNoDataNotification
 * @apiVersion 1.0.0
 * @apiName sendNoDataNotification
 * @apiDescription sends notification for no data received with all sensror and gateway list including sim status for gateway
 * @apiGroup Secure Routes
 *
 * @apiParam {String} client-secret Client Secret
 * @body {Object} object with accountID, sensor ID with no data and other information.
 *
 * @apiSuccess (200) {Object[]} response Response
 *
 * @apiError (401, 400, 404) {Object} response Error response
 * @apiError (401, 400, 404) {Boolean} response.success Error status flag
 * @apiError (401, 400, 404) {String} response.message Error message
 * @apiError (401, 400, 404) {Number} response.errorCode Status code
 */
router.post('/no-data', (req, res) => {
  removeXpoweredHeader(res);

  //Body Schema for validation
  let bodySchema = joi.object().keys({
    vendor: joi.string().required(),
    deviceType: joi.string().required(),
    eventType: joi.string().required(),
    eventStatus: joi.string().required(),
    ownerId: joi.string().required(),
    accountId: joi.string().required(),
    clientEmail: joi.array().required(),
    TACEmail: joi.array().required(),
    clientMobile: joi.array().required(),
    sensors: joi.array().required()
  });

  let accountInfo = req.body;
  // Validates the input in the params. If valid, then continue, otherwise throw 400.
  joi.validate(req.body, bodySchema, joiValidationOptions,  (error) => {
    if (error) {
      console.error('\tError validating request in /no-data API. ' + error + '. req.body: ' + JSON.stringify(req.body) + '\n');
      return throwUserErrorRespOnJoiError(error, res);
    } else {
      let resolvedDevicePromises = [
        getSensorListByGroupId(req.body.vendor, req.body.accountId),
        getGatewayListByGroupId(req.body.vendor, req.body.accountId)
      ];
      Promise.all(resolvedDevicePromises).then(success => {
        // if req has list of no data sensor, add status key
        if (req.body.sensors && req.body.sensors.length > 0) {
          let sensorWithNoData = req.body.sensors;
          success[0].forEach(function (sensor) {
            var sensorWithNoDataFound = _.find(sensorWithNoData, function(sensorWithNoDataObj) {
              return sensorWithNoDataObj.sensorId === sensor.id;
            });

            if (req.body.eventStatus === 'No-data') {
              if (sensorWithNoDataFound) {
                sensor.status = "No Data";
              } else {
                sensor.status = "Normal";
              };
            } else {
              sensor.status = "Normal";
            }
          });
        };
        accountInfo.sensorList = success[0];
        let resolvedStatusPromises = [];
        success[1].forEach(function (gateway) {
          // check sim status for all gateways
          resolvedStatusPromises.push(getGatewayConnectionStatus(gateway));
        });
        Promise.all(resolvedStatusPromises).then(gatewaysStatus => {
          accountInfo.gatewayList = gatewaysStatus;

          var nettracData = {};
          if (req.body.eventStatus === 'No-data') {
            nettracData = {
              'active': true,
              'type': 'no-data',
              'source': 'client-instance-' + req.body.ownerId,
              'message': 'Some of the temperature sensors have connection issue. Engage IoT Support Team.'
            };
          } else {
            nettracData = {
              'active': false,
              'type': 'no-data',
              'source': 'client-instance-' + req.body.ownerId,
              'message': 'Temperature sensors connection issue is now resolved.'
            };
          }

          Promise.all([
            sendMailUtils.sendEmail(accountInfo),
            sendSMSUtils.sendSMS(accountInfo),
            sendNettracAlarmUtils.sendNettracAlarm(nettracData)
          ]).then(emailAndSMSStatus => {
            console.log('send email/sms/alarm complete, ', JSON.stringify(emailAndSMSStatus));

            let emailAndSMSStatusMessage = '';
            _.each(emailAndSMSStatus, function (emailAndSMSStatusVal) {
              emailAndSMSStatusMessage = emailAndSMSStatusMessage + ' ' + emailAndSMSStatusVal.message;
            });

            res.send({success: true, message: 'No-Data Notification: ' + emailAndSMSStatusMessage});
          }, error => {
            console.error('\tError in sending email/sms.' + JSON.stringify(error) + '\n');
            res.send({success: false, errorCode: 500, message: 'Error in sending email/sms.'});
          });
        }, error => {
          console.error('\tError in getGatewayConnectionStatus API.' + JSON.stringify(error) + '\n');
          res.send({success: false, errorCode: 500, message: 'Error in getGatewayConnectionStatus API.'});
        });
      }, error => {
        console.error('\tError in gateway list and sensor list API.' + JSON.stringify(error) + '\n');
        res.send({success: false, errorCode: 500, message: 'Error in gateway list and sensor list API.'});
      });
    }
  });
});

/**
 * @api {post} /notification/threshold Send threshold Notification
 * @apiVersion 1.0.0
 * @apiName sendThresholdNotification
 * @apiDescription sends notification for threshold breach
 * @apiGroup Secure Routes
 *
 * @apiParam {String} client-secret Client Secret
 * @body {Object} object with accountID, sensor ID with threshold breach and other information.
 *
 * @apiSuccess (200) {Object[]} response Response
 *
 * @apiError (401, 400, 404) {Object} response Error response
 * @apiError (401, 400, 404) {Boolean} response.success Error status flag
 * @apiError (401, 400, 404) {String} response.message Error message
 * @apiError (401, 400, 404) {Number} response.errorCode Status code
 */
router.post('/threshold', (req, res) => {
  removeXpoweredHeader(res);

  //Body Schema for validation
  let bodySchema = {};

  if (req.body.deviceType === 'gateway') {
    bodySchema = joi.object().keys({
      deviceType: joi.string().required(),
      eventType: joi.string().required(),
      eventStatus: joi.string().required(),
      ownerId: joi.string().required(),
      accountId: joi.string().required(),
      clientEmail: joi.array().required(),
      TACEmail: joi.array().required(),
      clientMobile: joi.array().required(),
      gatewayId: joi.number().required(),
      gatewayName: joi.string().required(),
      timestamp: joi.number().required(),
      battery: joi.number().required(),
      rssi: joi.number().required()
    });
  } else {
    bodySchema = joi.object().keys({
      deviceType: joi.string().required(),
      eventType: joi.string().required(),
      eventStatus: joi.string().required(),
      ownerId: joi.string().required(),
      accountId: joi.string().required(),
      clientEmail: joi.array().required(),
      TACEmail: joi.array().required(),
      clientMobile: joi.array().required(),
      sensorId: joi.number().required(),
      sensorName: joi.string().required(),
      temperature: joi.number().required(),
      timestamp: joi.number().required(),
      battery: joi.number().required(),
      rssi: joi.number().required()
    });
  }

  let accountInfo = {};
  // Validates the input in the params. If valid, then continue, otherwise throw 400.
  joi.validate(req.body, bodySchema, joiValidationOptions,  (error) => {
    if (error) {
      console.error('\tError validating request in /threshold API. ' + error + '. req.body: ' + JSON.stringify(req.body) + '\n');
      return throwUserErrorRespOnJoiError(error, res);
    } else {
      Promise.all([
        sendMailUtils.sendEmail(req.body),
        sendSMSUtils.sendSMS(req.body)
      ]).then(emailAndSMSStatus => {
        console.log('send email/sms/alarm complete, ', JSON.stringify(emailAndSMSStatus));

        let emailAndSMSStatusMessage = '';
        _.each(emailAndSMSStatus, function (emailAndSMSStatusVal) {
          emailAndSMSStatusMessage = emailAndSMSStatusMessage + ' ' + emailAndSMSStatusVal.message;
        });

        res.send({success: true, message: 'Threshold Notification: ' + emailAndSMSStatusMessage});
      }, error => {
        console.error('\tError in sending email/sms.' + JSON.stringify(error) + '\n');
        res.send({success: false, errorCode: 500, message: 'Error in sending email/sms.'});
      });
    }
  });
});

module.exports = router;
