function reducer(state, action) {
  if (action.type === 'ADD_MESSAGE') {
    console.log("from action: ", action.text);

    const newMessage = {
      text: action.text,
      timestamp: Date.now(),
      id: uuid.v4(),
    }
    console.log(newMessage);
    console.log(state.threads[0].messages);
    return {
      messages: state.threads[0].messages.concat(newMessage),
    };
  } else if (action.type === 'DELETE_MESSAGE') {
    const index = state.messages.findIndex((m) => m.id === action.id);
    return {
      messages: [
        ...state.messages.slice(0, index),
        ...state.messages.slice(
          index + 1, state.messages.length
        ),
      ],
    };
  } else {
    return state;
  }
}

const initialState = {
  activeThreadId: '1-fca2',
  threads: [
    {
      id: '1-fca2',
      title: 'Buzz Aldrin',
      messages: [
        {
          text: 'Twelve minutes to ignition',
          timestamp: Date.now(),
          id: uuid.v4(),
        }
      ]
    },
    {
      id: '2-be91',
      title: 'Michael Collins',
      messages: []
    }
  ]
};

const store = Redux.createStore(reducer, initialState);



class App extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    const state = store.getState();
    const activeThreadId = state.activeThreadId;
    const threads = state.threads;
    const activeThread = threads.find((t) => t.id === activeThreadId);


    return (
      <div className='ui segment'>
        <Thread thread={activeThread} />
      </div>
    );
  }
};



class MessageInput extends React.Component {
  handleSubmit() {
    store.dispatch({
      type: 'ADD_MESSAGE',
      text: this.refs.messageInput.value,
    });
    // console.log('from messageInput: ',this.refs.messageInput.value );
    this.refs.messageInput.value = '';

  }

  render() {
    return (
      <div className='ui input'>
        <input
          ref='messageInput'
          type='text'
        >
        </input>
        <button
          onClick={this.handleSubmit.bind(this)}
          className='ui primary button'
          type='submit'
        >
          Submit
        </button>
       </div>
    );
  }
};



class Thread extends React.Component {
  handleClick(id) {
    store.dispatch({
      type: 'DELETE_MESSAGE',
      index: id,
    });
  }
  render() {
    const messages = this.props.thread.messages.map((message, index) => (
      <div
        className='comment'
        key={index}
        onClick={() => this.handleClick(message.id)}
      >
      <div className='text'>
        {message.text}
        <span className='metadata'>@{message.timestamp}</span>
      </div>

      </div>
    ));
    return (
      <div className='ui center aligned basic segment'>
        <div className='ui comments'>
          {messages}
        </div>
        <MessageInput />
      </div>
    );
  }
};

ReactDOM.render(
  <App />,
  document.getElementById('content')
);
