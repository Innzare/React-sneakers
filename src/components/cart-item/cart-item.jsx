import React from 'react';

import './cart-item.scss';

const CartItem = ({ itemData, removeCartItem }) => {

   return (
      <div className="cart-item">
         <img src={itemData.imgUrl} alt="sneakers" />
         <div className="cart-item__text">
            <p>{itemData.title}</p>
            <span>{itemData.price}</span>
         </div>
         <button onClick={() => removeCartItem(itemData)}>
            <img src="/img/cart/delete.svg" alt="delete" />
         </button>
      </div>
   );
};

export default CartItem;