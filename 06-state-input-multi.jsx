import React from 'react';

const content = document.createElement('div');
document.body.appendChild(content);

export default class Prac6 extends React.Component {
  constructor(props) {
    super(props);

    this.state = ({
      fields: {},
      people: [],
    });

    this.onFormSubmit = this.onFormSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onFormSubmit(evt) {
    const people = [
      ...this.state.people,
      this.state.fields,
    ];
    this.setState({ people, fields: {} });
    evt.preventDefault();
  }

  onInputChange(evt) {
    const fields = this.state.fields;
    fields[evt.target.name] = evt.target.value;
    this.setState({ fields });
    // fields[evt.target.name] = '';
  }

  render() {
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <input
            placeholder='Name'
            name='name'
            onChange={this.onInputChange}
          />

          <input
            placeholder='Email'
            name='email'
            // value={this.state.fields.email}
            onChange={this.onInputChange}
          />

          <input type='submit' />
        </form>

        <div>
          <h3>People</h3>
          <ul>
            { this.state.people.map(({ name, email }, i) =>
              <li key={i}>{name} ({ email })</li>
            ) }
          </ul>
        </div>
      </div>
    );
  }
};

/*
module.exports = React.createClass({
  displayName: __filename.split('/').slice(-1)[0],

  getInitialState() {
    return {
      fields: {},
      people: [],
    };
  },

  onFormSubmit(evt) {
    const people = [
      ...this.state.people,
      this.state.fields,
    ];
    this.setState({ people, fields: {} });
    evt.preventDefault();
  },

  onInputChange(evt) {
    const fields = this.state.fields;
    fields[evt.target.name] = evt.target.value;
    this.setState({ fields });
  },

  render() {
    return (
      <div>
        <h1>Sign Up Sheet</h1>

        <form onSubmit={this.onFormSubmit}>
          <input
            placeholder='Name'
            name='name'
            value={this.state.fields.name}
            onChange={this.onInputChange}
          />

          <input
            placeholder='Email'
            name='email'
            value={this.state.fields.email}
            onChange={this.onInputChange}
          />

          <input type='submit' />
        </form>

        <div>
          <h3>People</h3>
          <ul>
            { this.state.people.map(({ name, email }, i) =>
              <li key={i}>{name} ({ email })</li>
            ) }
          </ul>
        </div>
      </div>
    );
  },
});
*/
