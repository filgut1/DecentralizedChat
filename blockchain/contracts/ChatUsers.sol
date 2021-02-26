// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract ChatUsers {
  string public name = 'ChatUsers';

  mapping(string => ChatUser) public userList;

  struct ChatUser {
    address payable userAddr;
  }

  function addUser(string calldata _phoneHash) public {
    userList[_phoneHash] = ChatUser(msg.sender);
  }
}