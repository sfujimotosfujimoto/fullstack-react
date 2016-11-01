class ProductList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      products: [],
      direction: true
    };

    this.handleProductUpVote = this.handleProductUpVote.bind(this);
    this.handleProductDownVote = this.handleProductDownVote.bind(this);

  }

  componentDidMout() {
    this.updateState();
  }

  handleSortDirection() {
    this.setState({
      direction: !this.state.direction
    });
    console.log('from handleSortDirection: ', this.state.direction);
    this.updateState();
  }

  updateState() {
    console.log('from updateState: ', this.state.direction);
    let products = [];
    if (this.state.direction) {
      products = Data.sort((a, b) => {
        return b.votes - a.votes;
      });
    } else {
      products = Data.sort((a, b) => {
        return a.votes - b.votes;
      });
    }

    this.setState({
      products: products,
    });
  }

  handleProductUpVote(productId) {
    Data.map((el) => {
      if (el.id === productId) {
        el.votes = el.votes + 1;
        return;
      }
    });
    this.updateState();
  }

  handleProductDownVote(productId) {
    Data.map((el) => {
      if (el.id === productId) {
        el.votes = el.votes - 1;
        return;
      }
    });
    this.updateState();
  }

  render() {
    const products = Data.map((product) => {
      return (
          <Product
            id={product.id}
            key={product.id}
            title={product.title}
            description={product.description}
            url={product.url}
            votes={product.votes}
            submitter_avatar_url={product.submitter_avatar_url}
            product_image_url={product.product_image_url}
            onUpVote={this.handleProductUpVote}
            onDownVote={this.handleProductDownVote}
            />
      );
    });
    return (
      <div className="ui items">
        <button className="ui button" onClick={this.handleSortDirection.bind(this)}>
          Sort Direction
        </button>
        {products}
      </div>
    )
  }
}



class Product extends React.Component {
  constructor(props) {
    super(props);
    this.handleUpVote = this.handleUpVote.bind(this);
    this.handleDownVote = this.handleDownVote.bind(this);
  }

  handleUpVote() {
    this.props.onUpVote(this.props.id);
  }

  handleDownVote() {
    this.props.onDownVote(this.props.id);
  }

  render() {
    return (
      <div className="item">
        <div className="image">
          <img src={this.props.product_image_url} />
        </div>
        <div className="middle aligned content">
          <div className="header">
            <a onClick={this.handleUpVote}>
              <i className="large caret up icon"></i>
            </a>
            <a onClick={this.handleDownVote}>
              <i className="large caret down icon"></i>
            </a>
              {this.props.votes}
          </div>
          <div className="description">
            <a href={this.props.url}>
              {this.props.title}
            </a>
          </div>
          <div className="extra">
            <span>Submitted by:</span>
            <img
              className="ui avatar image"
              src={this.props.submitter_avatar_url} />
          </div>
        </div>
      </div>
    );
  }
}



ReactDOM.render(
  <ProductList />,
  document.getElementById('content')
);
