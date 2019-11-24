var express = require("express");
var DelcomIndicator = require("./DelcomIndicator");
var bodyParser = require("body-parser");

// Initalize
const app = express();
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
var delcomIndicator = new DelcomIndicator();
const PORT = 5000;

// Global Variables
var currentStatus;
var currentColor;

app.post("/led/v1/status", (req, res) => {
  var status = req.body.status;
  var color = req.body.color;
  if (!delcomIndicator.isConnected()) {
    return res.status(500).send({
      success: "false",
      message: "no light is connected"
    });
  } else if (!status) {
    return res.status(400).send({
      success: "false",
      message: "light status is required"
    });
  }
  // turn off before trying to change
  try {
    delcomIndicator.turnOff();
  } catch {
    delcomIndicator = new DelcomIndicator();
  }
  switch (status) {
    case "off":
      delcomIndicator.turnOff();
      currentStatus = "off";
      break;
    case "on":
      switch (req.body.color) {
        case "red":
          delcomIndicator.solidRed();
          currentStatus = "on";
          currentColor = "red";
          break;
        case "blue":
        case "yellow":
          delcomIndicator.solidBlue();
          currentStatus = "on";
          currentColor = "blue";
          break;
        case "green":
          delcomIndicator.solidGreen();
          currentStatus = "on";
          currentColor = "green";
          break;
        default:
          return res.status(400).send({
            success: "false",
            message: "invalid light color"
          });
      }
      break;
    case "flash":
      switch (req.body.color) {
        case "red":
          delcomIndicator.flashRed();
          currentStatus = "flash";
          currentColor = "red";
          break;
        case "blue":
        case "yellow":
          delcomIndicator.flashBlue();
          currentStatus = "flash";
          currentColor = "blue";
          break;
        case "green":
          delcomIndicator.flashGreen();
          currentStatus = "flash";
          currentColor = "green";
          break;
        default:
          return res.status(400).send({
            success: "false",
            message: "invalid light color"
          });
      }
      break;
    default:
      return res.status(400).send({
        success: "false",
        message: "invalid light status"
      });
  }

  return res.status(200).send({
    success: "true"
  });
});

app.get("/led/v1/status", (req, res) => {
  if (!delcomIndicator.isConnected()) {
    return res.status(404).send({
      message: "no light is connected"
    });
  } else {
    return res.status(200).send({
      status: currentStatus,
      color: currentStatus === "off" ? undefined : currentColor
    });
  }
});

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
