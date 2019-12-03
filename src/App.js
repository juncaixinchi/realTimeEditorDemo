import React from 'react';
import CodeMirror from 'codemirror';
import io from 'socket.io-client';

import 'codemirror/lib/codemirror.css';
import './App.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { msg: '' };
    this.currentDoc = { timestamp: -1, doc: '' }
  }

  componentDidMount() {
    const socket = io('http://localhost:3000');
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
      <div ref={(ref) => this.ref = ref} />
    );
  }
}

export default App;
