// Write your code here
import './index.css'
import {BsStarFill} from 'react-icons/bs'

const SimilarProductItem = props => {
  const {SimilarDetails} = props
  const {imageUrl, title, price, brand, rating} = SimilarDetails
  return (
    <li className="list-container">
      <img
        src={imageUrl}
        alt="similar product"
        className="img-list-similar-products"
      />
      <h1 className="similar-heading-style">{title}</h1>
      <p className="similar-para">{brand}</p>
      <div className="container-row-to-similar-price-rating">
        <p className="similar-bold-para-design">Rs {price}/-</p>
        <p className="rating-para-similar">
          {rating} <BsStarFill className="star-size-similar" />
        </p>
      </div>
    </li>
  )
}
export default SimilarProductItem
