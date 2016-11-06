const reducer = Redux.combineReducers({
    activeThreadId: activeThreadIdReducer,
    threads: threadsReducer
});

function activeThreadIdReducer(state='1-fca2', action) {
  if (action.type === 'OPEN_THREAD') {
    return action.id;
  } else {
    return state;
  }
}

function findThreadIndex(threads, action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      return threads.findIndex(
        (t) => t.id === action.threadId
      );
    }
    case 'DELETE_MESSAGE': {
      return threads.findIndex(
        (t) => t.messages.find((m) => (
          m.id === action.id
        ))
      );
    }
  }
}

function threadsReducer(state= [
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
], action) {
  switch (action.type) {
    case 'ADD_MESSAGE':
    case 'DELETE_MESSAGE':  {
      const threadIndex = findThreadIndex(state, action);

      const oldThread = state[threadIndex];
      const newThread = {
        ...oldThread,
        messages: messagesReducer(oldThread.messages, action),
      };

      return [
        ...state.slice(0, threadIndex),
        newThread,
        ...state.slice(
          threadIndex + 1, state.length
        ),
      ];
    }
    default: {
      return state;
    }
  }

}

function messagesReducer(state, action) {
  switch (action.type) {
    case 'ADD_MESSAGE': {
      const newMessage = {
        text: action.text,
        timestamp: Date.now(),
        id: uuid.v4(),
      };
      return state.concat(newMessage);
    }
    case 'DELETE_MESSAGE': {
      const messageIndex = state.findIndex((m) => m.id === action.id);
      return [
        ...state.slice(0, messageIndex),
        ...state.slice(
          messageIndex + 1, state.length
        ),
      ];
    }
    default: {
      return state;
    }

  }
}

const store = Redux.createStore(reducer);

//-- ActionCreators ------
function deleteMessage(id) {
  return {
    type: 'DELETE_MESSAGE',
    id: id,
  };
}

function addMessage(text, threadId) {
  return {
    type: 'ADD_MESSAGE',
    text: text,
    threadId: threadId
  };
}

function openThread(id) {
  return {
    type: 'OPEN_THREAD',
    id: id,
  }
}

//-- App ------
const App = () =>  (
  <div className='ui segment'>
    <ThreadTabs />
    <ThreadDisplay />
  </div>
);


//-- Tabs ------
const Tabs = (props) => (
  <div className="ui top attached tabular menu">
    {
      props.tabs.map((tab, index) => (
        <div
          key={index}
          className={tab.active ? 'active item' : 'item'}
          onClick={() => props.onClick(tab.id)}
        >
          {tab.title}
        </div>
      ))
    }
  </div>
)



const mapStateToTabsProps = (state) => {
  const tabs = state.threads.map(t => (
    {
      title: t.title,
      active: t.id === state.activeThreadId,
      id: t.id
    }
  ));
  return {
    tabs,
  }
}

const mapDispatchToTabsProps = (dispatch) => (
  {
    onClick: (id) => (
      dispatch(openThread(id))
    )
  }
)



//-- ThreadTabs ------
const ThreadTabs = ReactRedux.connect(
  mapStateToTabsProps,
  mapDispatchToTabsProps
)(Tabs);

//-- TextFieldSubmit ------
const TextFieldSubmit = (props) => {
  let input;

  return (
    <div className="ui input">
      <input
        ref={node => input = node}
        type="text"/>
      <button
        onClick={() => {
          props.onSubmit(input.value);
          input.value = '';
        }}
        className="ui primary button"
        type='submit'>
        Submit
      </button>
    </div>
  );
};

//-- MessageList ------
const MessageList = (props) => (
  <div className="ui comments">
    {
      props.messages.map((m, index) => (
        <div
          className="comment"
          key={index}
          onClick={() => props.onClick(m.id)}
        >
          <div className="text">
            {m.text}
            <span className="metadata">@{m.timestamp}</span>
          </div>
        </div>
      ))
    }
  </div>
);

//-- Thread ------
const Thread = (props) => (
  <div className="ui center aligned basic segment">
    <MessageList
      messages={props.thread.messages}
      onClick={props.onMessageClick}
    />
    <TextFieldSubmit
      onSubmit={props.onMessageSubmit}
    />
  </div>
)


const mapStateToThreadProps = (state) => (
  {
    thread: state.threads.find(
      t => t.id === state.activeThreadId
    )
  }
);

const mapDispatchToThreadProps = (dispatch) => (
  {
    onMessageClick: (id) => (
      dispatch(deleteMessage(id))
    ),
    dispatch: dispatch,
  }
)

const mergeThreadProps = (stateProps, dispatchProps) => (
  {
    ...stateProps,
    ...dispatchProps,
    onMessageSubmit: (text) => (
      dispatchProps.dispatch(
        addMessage(text, stateProps.thread.id)
      )
    )
  }
)


//-- ThreadDisplay ------
const ThreadDisplay = ReactRedux.connect(
  mapStateToThreadProps,
  mapDispatchToThreadProps,
  mergeThreadProps
)(Thread);

/*
class ThreadDisplay extends React.Component {
  componentDidMount() {
    store.subscribe(() => this.forceUpdate());
  }
  render() {
    const state = store.getState();
    const activeThreadId = state.activeThreadId;
    const activeThread = state.threads.find(
      t => t.id === activeThreadId
    );
    return (
      <Thread
        thread={activeThread}
        onMessageClick={(id) => (
          store.dispatch({
            type: 'DELETE_MESSAGE',
            id: id,
          })
        )}
        onMessageSubmit={(text) => (
          store.dispatch({
            type: 'ADD_MESSAGE',
            text: text,
            threadId: activeThreadId,
          })
        )}
      />
    )
  }
};
*/
ReactDOM.render(
  <ReactRedux.Provider store={store}>
    <App />
  </ReactRedux.Provider>,
  document.getElementById('content')
);
