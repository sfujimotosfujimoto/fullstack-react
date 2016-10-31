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
          <img src="images/products/image-aqua.png" />
        </div>
        <div className="middle aligned content">
          <div className="description">
            <a href="">Fort Knight</a>
            <p>Authentic renaissance actors, delivered in just two weeks.</p>
          </div>
          <div className="extra">
            <span>Sumitted by:</span>
            <img className="ui avatar image" src="images/avatars/daniel.jpg" alt=""/>
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
