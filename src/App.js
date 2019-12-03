import React from 'react';
import io from 'socket.io-client';
import logo from './logo.svg';
import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { msg: '' };
    this.currentDoc = { timestamp: -1, doc: '' }
  }
  componentDidMount() {

    const socket = io('http://localhost:8000');

    this.codemirror = CodeMirror(this.ref, {
      value: this.currentDoc.doc,
      mode: "javascript",
      lineNumbers: true,
    });

    socket.on('connect', function () {
      console.log('connect')
    });

    socket.on('disconnect', function () {
      console.log('disconnect')
    });

    socket.on('doc', (data) => {
      const { timestamp, doc } = data
      if (timestamp > this.currentDoc.timestamp) {
        this.currentDoc = { timestamp, doc };
        if (doc !== this.codemirror.getValue()) {
          this.codemirror.setValue(doc)
        }
      }
    });

    this.codemirror.on('change', (...args) => {
      socket.emit('update', {
        timestamp: new Date().getTime(),
        doc: this.codemirror.getValue()
      })
    })
  }
  render() {
    return (
      <div>
        <div style={{ color: 'black', margin: 0, padding: 0 }} ref={(ref) => this.ref = ref} />
      </div>
    );
  }
}



export default App;
