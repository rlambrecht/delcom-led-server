var express = require("express");
var DelcomIndicator = require("./DelcomIndicator");
var bodyParser = require("body-parser");

// Initalize
const app = express();
// Parse incoming requests data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
const delcomIndicator = new DelcomIndicator();
const PORT = 5000;

app.post("/api/v1/lightstate", (req, res) => {
  if (!delcomIndicator.isConnected) {
    const delcomIndicator = new DelcomIndicator();
  }
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
  delcomIndicator.turnOff();
  switch (status) {
    case "off":
      delcomIndicator.turnOff();
      break;
    case "on":
      switch (req.body.color) {
        case "red":
          delcomIndicator.solidRed();
          break;
        case "blue":
        case "yellow":
          delcomIndicator.solidBlue();
          break;
        case "green":
          delcomIndicator.solidGreen();
          break;
        default:
          return res.status(400).send({
            success: "false",
            message: "invalid light color"
          });
      }
      break;
    case "blink":
      switch (req.body.color) {
        case "red":
          delcomIndicator.flashRed();
          break;
        case "blue":
        case "yellow":
          delcomIndicator.flashBlue();
          break;
        case "green":
          delcomIndicator.flashGreen();
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

app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`);
});
