// Write your code here
import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import {BsStarFill, BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Cookies from 'js-cookie'
import SimilarProductItem from '../SimilarProductItem'
import './index.css'
import Header from '../Header'

const apiStatus = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    count: 1,
    ProductItem: {},
    SimilarItems: [],
    apiState: apiStatus.initial,
  }

  componentDidMount() {
    this.getProductItemDetails()
  }

  getFormatData = data => ({
    availability: data.availability,
    brand: data.brand,
    description: data.description,
    id: data.id,
    imageUrl: data.image_url,
    price: data.price,
    rating: data.rating,
    title: data.title,
    totalReviews: data.total_reviews,
  })

  getProductItemDetails = async () => {
    this.setState({
      apiState: apiStatus.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {match} = this.props
    const {params} = match
    const {id} = params

    const productDetailsApiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(productDetailsApiUrl, options)

    if (response.ok) {
      const DataFetched = await response.json()
      console.log(DataFetched)
      const UpdateData = this.getFormatData(DataFetched)
      const UpdatedSimilarData = DataFetched.similar_products.map(eachItem =>
        this.getFormatData(eachItem),
      )
      console.log(UpdateData)
      console.log(UpdatedSimilarData)
      this.setState({
        ProductItem: UpdateData,
        SimilarItems: UpdatedSimilarData,
        apiState: apiStatus.success,
      })
    } else {
      this.setState({
        apiState: apiStatus.failure,
      })
    }
  }

  DecrementCount = () => {
    const {count} = this.state
    if (count > 1) {
      this.setState(prevState => ({count: prevState.count - 1}))
    }
  }

  IncrementCount = () => {
    this.setState(prevState => ({count: prevState.count + 1}))
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height="50" width="50" />
    </div>
  )

  renderFailureView = () => (
    <div className="product-details-error-view-container">
      <img
        alt="failure view"
        src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
        className="error-view-image"
      />
      <h1 className="product-not-found-heading">Product Not Found</h1>
      <Link to="/products">
        <button type="button" className="button">
          Continue Shopping
        </button>
      </Link>
    </div>
  )

  renderProductItem = () => {
    const {count, ProductItem, SimilarItems} = this.state
    const {
      title,
      totalReviews,
      availability,
      brand,
      description,
      imageUrl,
      price,
      rating,
    } = ProductItem
    return (
      <div className="product-item-container1">
        <Header />
        <div className="product-item-container2">
          <img
            src={imageUrl}
            alt="product"
            className="Large-product-item-img"
          />
          <div className="product-item-container-content">
            <h1 className="product-item-heading1">{title}</h1>
            <p className="product-item-price">Rs {price}/-</p>
            <div className="rating-review-container-row">
              <p className="rating-para-design">
                {rating}
                <BsStarFill className="star-size" />
              </p>
              <p className="review-para-design">{totalReviews} Reviews</p>
            </div>
            <p className="discreption-para-style">{description}</p>
            <p className="avaiablity-para-style">
              Availability: {availability}
            </p>
            <p className="avaiablity-para-style">Brand: {brand}</p>
            <hr />
            <div className="contrainer-row-to-button">
              <button
                className="button-style"
                data-testid="minus"
                type="button"
                onClick={this.DecrementCount}
              >
                <BsDashSquare className="button-icon" />
              </button>
              <p className="count-para-style">{count}</p>
              <button
                className="button-style"
                data-testid="plus"
                type="button"
                onClick={this.IncrementCount}
              >
                <BsPlusSquare className="button-icon" />
              </button>
            </div>
            <button className="add-to-cart-button" type="button">
              ADD TO CART
            </button>
          </div>
        </div>

        <div className="similar-container0">
          <h1 className="similar-item-heading2">Similar Products</h1>
          <ul className="similar-products-container">
            {SimilarItems.map(eachItem => (
              <SimilarProductItem SimilarDetails={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </div>
    )
  }

  render() {
    const {apiState} = this.state

    switch (apiState) {
      case apiStatus.success:
        return this.renderProductItem()
      case apiStatus.failure:
        return this.renderFailureView()
      case apiStatus.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }
}

export default ProductItemDetails
