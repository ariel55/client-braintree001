import React, { Component } from 'react';
import './App.css';
import 'braintree-web';
import axios from 'axios';
import DropIn from 'braintree-web-drop-in-react';

class App extends Component {
  instance;

  state = {
    clientToken: null
  };

  async componentDidMount() {
    try {

      // Get a client token for authorization from your server
      const response = await axios.get(
        'http://localhost:8000/initializeBraintree'
      );
      const clientToken = response.data.data;

      this.setState({ clientToken });
    } catch (err) {
      console.error(err);
    }
  }

  async buy() {
    try {
      // Send the nonce to your server
      const { nonce } = await this.instance.requestPaymentMethod();

      // TODO  parametrizar
      const vertikalID = "customer_001";

      // TODO si no existe vertikalID crearlo
      const response = await axios.post(
        'http://localhost:8000/confirmBraintree',
        { 
          amount: '5.00', 
          payment_method_nonce: 'fake-valid-nonce',
          customer_id: vertikalID
        }
      );
      console.log(response);
    } catch (err) {
      console.error(err);
    }
  }

  render() {
    if (!this.state.clientToken) {
      return (
        <div>
          <h1>Loading...</h1>
        </div>
      );
    } else {
      return (
        <div>
          <DropIn
            options={{
              authorization: this.state.clientToken
            }}
            onInstance={(instance) => (this.instance = instance)}
          />
          <button onClick={this.buy.bind(this)}>Buy</button>
        </div>
      );
    }
  }
}

export default App;