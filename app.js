class ProductList extends React.Component {
  render() {
    const product = Data[0];
    return (
      <div className="ui items">
        <Product
          id={product.id}
          title={product.title}
          description={product.description}
          url={product.url}
          votes={product.votes}
          submitter_avatar_url={product.submitter_avatar_url}
          product_image_url={product.product_image_url}
          />
      </div>
    );
  }
}



class Product extends React.Component {
  render() {
    return (
      <div className="item">
        <div className="image">
          <img src={this.props.product_image_url} />
        </div>
        <div className="middle aligned content">
          <div className="header">
            <a>
              <i className="large caret up icon"></i>
              {this.props.votes}
            </a>
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
