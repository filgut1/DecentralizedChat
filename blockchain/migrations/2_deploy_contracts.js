const ChatUsers = artifacts.require("ChatUsers");

module.exports = function(deployer) {
  deployer.deploy(ChatUsers);
};