import React from 'react';
import PropTypes from 'prop-types';
import currencies from '../../constants/currencies';
import { formatPrice, formatTime } from '../../utils/formatters';
import getMonthTitle from '../../utils/getMonthTitle';
import getDayOfWeekTitle from '../../utils/getDayOfWeekTitle';
import './purchase-history.item.scss';

const Purchase = ({ purchaseIdx, purchase, products, deliveryCost, currentCurrency }) => {
  const purchaseProducts = [];
  Object.entries(purchase.items)
    .map(([productId, count]) => {
      const product = products.find((item) => +productId === item.id);
      if (product) {
        product.count = count;
        purchaseProducts.push(product);
      }
    });
  const title = `${purchaseIdx}. Bestellung`;
  const date = new Date(purchase.date);
  const dateTitle =
    `${getDayOfWeekTitle(date.getDay())},
     ${date.getDate()}.
     ${getMonthTitle(date.getMonth() + 1)},
     ${date.getFullYear()}.
     ${formatTime(date.getHours())}:${formatTime(date.getMinutes())}`;
  const totalPrice = formatPrice(
    purchaseProducts.reduce((sum, product) =>
      sum + product.price[currentCurrency] * product.count, 0) + deliveryCost[currentCurrency]);
  const currency = currencies[currentCurrency].title;

  return (
    <li className="purchase">
      <h3 className="purchase__title">
        {title}
      </h3>

      {
        purchaseProducts.map((product) => {
          const price = formatPrice(product.price[currentCurrency] * product.count);

          return (
            <div
              key={product.id}
              className="purchase__info">
              <div className="purchase__subtitle-and-size">
                <div className="purchase__subtitle">
                  {product.title}
                </div>
                {
                  product.size &&
                  <div className="purchase__size">
                    {product.size}
                  </div>
                }
              </div>

              <div className="purchase__count">
                {`x${product.count}`}
              </div>

              <div className="purchase__price">
                {`${price} ${currency}`}
              </div>
            </div>
          );
        })
      }

      <div className="purchase__date-and-total-price">
        <div className="purchase__date">
          {dateTitle}
        </div>

        <div className="purchase__total-price">
          {`Gesamtsumme: ${totalPrice} ${currency}`}
        </div>
      </div>
    </li>
  );
};

Purchase.propTypes = {
  purchaseIdx: PropTypes.number.isRequired,
  purchase: PropTypes.shape({
    items: PropTypes.object.isRequired
  }).isRequired,
  products: PropTypes.array.isRequired,
  deliveryCost: PropTypes.object.isRequired,
  currentCurrency: PropTypes.string.isRequired
};

export default Purchase;
