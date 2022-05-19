import React, { Component } from "react";
import UploadToIPFS from "./components/uploadToIPFS/UploadToIPFS";
import Body from "./components/connectwallet/connectwallet";
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <>
        <div>
          <UploadToIPFS />
        </div>
      </>
    );
  }
}
