
//-- TIMERDASHBOARD ------
class TimersDashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      timers: []
    });

    this.handleCreateFormSubmit = this.handleCreateFormSubmit.bind(this);
    this.handleEditFormSubmit = this.handleEditFormSubmit.bind(this);
    this.handleTrashClick = this.handleTrashClick.bind(this);
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
  }

  componentDidMount() {
    this.loadTimersFromServer();
    setInterval(this.loadTimersFromServer, 5000);
  }

  loadTimersFromServer() {
    client.getTimers((serverTimers) => (
      this.setState({
        timers: serverTimers })
      )
    )
  }

  handleCreateFormSubmit(timer) {
    this.createTimer(timer);
  }

  handleEditFormSubmit(attrs) {
    this.updateTimer(attrs);
  }

  handleTrashClick(timerId) {
    this.deleteTimer(timerId);
  }

  handleStartClick(timerId) {
    this.startTimer(timerId);
  }

  handleStopClick(timerId) {
    this.stopTimer(timerId);
  }

  createTimer(timer) {
    const t = helpers.newTimer(timer);
    this.setState({
      timers: this.state.timers.concat(t)
    });
  }

  updateTimer(attrs) {
    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === attrs.id) {
          return Object.assign({}, timer, {
            title: attrs.title,
            project: attrs.project,
          });
        } else {
          return timer;
        }
      })
    })
  }

  deleteTimer(timerId) {
    this.setState({
      timers: this.state.timers.filter(t => t.id !== timerId)
    });
  }

  startTimer(timerId) {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === timerId) {
          return Object.assign({}, timer, {
            runningSince: now,
          });
        } else {
          return timer;
        }
      })
    })
  }

  stopTimer(timerId) {
    const now = Date.now();

    this.setState({
      timers: this.state.timers.map((timer) => {
        if (timer.id === timerId) {
          const lastElapsed = now - timer.runningSince;
          return Object.assign({}, timer, {
            elapsed: timer.elapsed + lastElapsed,
            runningSince: null,
          });
        } else {
          return timer;
        }
      })
    })
  }

  render() {
    return (
      <div className="ui three column centered grid">
        <div className="column">
          <EditableTimerList
            timers={this.state.timers}
            onFormSubmit={this.handleEditFormSubmit}
            onTrashClick={this.handleTrashClick}
            onStartClick={this.handleStartClick}
            onStopClick={this.handleStopClick}
          />
          <ToggleableTimerForm
            onFormSubmit={this.handleCreateFormSubmit}
          />
        </div>
      </div>
    );
  }
}


//-- EDITABLETIMERLIST ------
class EditableTimerList extends React.Component {
  render() {
    const timers = this.props.timers.map((timer) => (
      <EditableTimer
        key={timer.id}
        id={timer.id}
        title={timer.title}
        project={timer.project}
        elapsed={timer.elapsed}
        runningSince={timer.runningSince}
        onFormSubmit={this.props.onFormSubmit}
        onTrashClick={this.props.onTrashClick}
        onStartClick={this.props.onStartClick}
        onStopClick={this.props.onStopClick}
      />
    ));

    return (
      <div id="timers">
        {timers}
      </div>
    );
  }
}


//-- EDITABLETIMER ------
class EditableTimer extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      editFormOpen: false,
      showEditDelete: false
    });

    this.handleEditClick = this.handleEditClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormClose = this.handleFormClose.bind(this);
  }

  handleEditClick() {
    this.openForm();
  }

  handleFormClose() {
    this.closeForm();
  }

  handleSubmit(timer) {
    this.props.onFormSubmit(timer);
    this.closeForm();
  }


  closeForm() {
    this.setState({ editFormOpen: false });
  }

  openForm() {
    this.setState({ editFormOpen: true });
  }




  render() {
    if (this.state.editFormOpen) {
      return (
        <TimerForm
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          onFormSubmit={this.handleSubmit}
          onFormClose={this.handleFormClose}
        />
      );
    } else {
      return (
        <Timer
          id={this.props.id}
          title={this.props.title}
          project={this.props.project}
          elapsed={this.props.elapsed}
          runningSince={this.props.runningSince}
          onEditClick={this.handleEditClick}
          onTrashClick={this.props.onTrashClick}
          onStartClick={this.props.onStartClick}
          onStopClick={this.props.onStopClick}
        />
      );
    }
  }
}


//-- TIMERFORM ------
class TimerForm extends React.Component {
  constructor(props){
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);

  }

  handleSubmit() {
    let title = this.refs.title.value;
    if (!title) {
      return;
    }

    this.props.onFormSubmit({
      id: this.props.id,
      title: this.refs.title.value,
      project: this.refs.project.value
    });
  }



  render() {
    const submitText = this.props.id ? 'Update' : 'Create';

    const error = (
      <div className="ui error message">
        <div className="header">Error</div>
        <p>You can only sign up for an account once with a given e-mail address.</p>
      </div>
    )

    return (
      <div className="ui centered card">
        <div className="content">
          <div className="ui form">
            <div className="field">
              <label>Title</label>
              <input
                type="text"
                ref='title'
                defaultValue={this.props.title} />
                {error}
            </div>

            <div className="field">
              <label>Project</label>
              <input
                type="text"
                ref='project'
                defaultValue={this.props.project} />
            </div>

            <div className="ui two bottom attached buttons">
              <button
                className="ui basic blue button"
                onClick={this.handleSubmit.bind(this)}
              >
                {submitText}
              </button>
              <button
                className="ui basic red button"
                onClick={this.props.onFormClose}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }
}


//-- TOGGLEABLETIMERFORM ------
class ToggleableTimerForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = ({
      isOpen: false
    });
  }

  handleFormOpen() {
    this.setState({ isOpen: true });
  }

  handleFormClose() {
    this.setState({ isOpen: false});
  }

  handleFormSubmit(timer) {
    this.props.onFormSubmit(timer);
    this.setState({ isOpen: false });
  }

  render() {
    if (this.state.isOpen) {
      return (
        <TimerForm
          onFormSubmit={this.handleFormSubmit.bind(this)}
          onFormClose={this.handleFormClose.bind(this)}
        />
      );
    } else {
      return (
        <div className="ui basic content center aligned segment">
          <button className="ui basic button icon" onClick={this.handleFormOpen.bind(this)}>
            <i className="plus icon"></i>
          </button>
        </div>
      );
    }
  }
}


//-- TIMER ------
class Timer extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({ showEditDelete: false });
    this.handleStartClick = this.handleStartClick.bind(this);
    this.handleStopClick = this.handleStopClick.bind(this);
    this.handleTrashClick = this.handleTrashClick.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }

  componentDidMount() {
    this.forceUpdateInterval = setInterval(() => this.forceUpdate(), 50);
  }

  componentWillUnmount() {
    clearInterval(this.forceUpdateInterval);
  }

  handleStartClick() {
    this.props.onStartClick(this.props.id);
  }

  handleStopClick() {
    this.props.onStopClick(this.props.id);
  }

  handleTrashClick() {
    this.props.onTrashClick(this.props.id);
  }

  handleMouseEnter() {
    this.setState({
      showEditDelete: true
    });
  }

  handleMouseLeave() {
    this.setState({
      showEditDelete: false
    });
  }


  render() {
    const elapsedString = helpers.renderElapsedString(this.props.elapsed, this.props.runningSince);

    let editTrashEl;

    if (this.state.showEditDelete) {
      editTrashEl = (
        <div className="extra content">
          <span
            className="right floated edit icon"
            onClick={this.props.onEditClick}>
            <i className="edit icon"></i>
          </span>
          <span
            className="right floated trash icon"
            onClick={this.handleTrashClick}>
            <i className="trash icon"></i>
          </span>
        </div>
      );
    } else {
      editTrashEl = (
        <div className="extra content">
          <span className="right floated icon">
            <i className=" icon"></i>
          </span>
          <span className="right floated icon" >
            <i className=" icon"></i>
          </span>
        </div>
      );
    }

    return (
      <div
        className="ui centered card"
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
      >
        <div className="content">
          <div className="header">
            {this.props.title}
          </div>
          <div className="meta">
            {this.props.project}
          </div>
          <div className="center aligned description">
            <h2>
              {elapsedString}
            </h2>
          </div>
            {editTrashEl}
        </div>

        <TimerActionButton
          timerIsRunning={!!this.props.runningSince} // casts runningSince null to boolean false
          onStartClick={this.handleStartClick}
          onStopClick={this.handleStopClick}
        />
      </div>
    );
  }
}

//-- TIMERACTIONBUTTON ------
class TimerActionButton extends React.Component {
  render() {
    if (this.props.timerIsRunning) {
      return (
        <div
          className="ui buttom attached red basic button"
          onClick={this.props.onStopClick}>
          Stop
        </div>
      );
    } else {
      return (
        <div
          className="ui bottom attached green basic button"
          onClick={this.props.onStartClick}
        >
          Start
        </div>
      );
    }

  }
}



ReactDOM.render(
  <TimersDashboard />,
  document.getElementById('content')
);
