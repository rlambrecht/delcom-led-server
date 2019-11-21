var DelcomIndicator = require("./DelcomIndicator");

var delcomIndicator = new DelcomIndicator();
if (delcomIndicator.isOpen()) {
  delcomIndicator.solidBlue();
  setTimeout(function() {
    delcomIndicator.solidGreen();
  }, 3000);
  setTimeout(function() {
    delcomIndicator.turnOff();
  }, 3000);
}
