import React from 'react';
import AppContext from '../../context';

// import axios from 'axios';

import CartItem from '../cart-item';
import BlockInfo from './../block-info';

import './drawer.scss';

const Drawer = ({ active, closeDrawer, removeCartItem }) => {

   const [price, setPrice] = React.useState('0 руб.');
   const [tax, setTax] = React.useState('0 руб.');
   const [isOrderComplete, setIsOrderComplete] = React.useState(false);

   const { setCartItems, setSneakers, setFavourites, cartItems } = React.useContext(AppContext);

   const onClickOrder = () => {
      setIsOrderComplete(true);
      setTimeout(() => {
         setIsOrderComplete(false);
      }, 3000)
      setCartItems([]);
      setSneakers(prev => {
         const newArr = prev.slice();
         return newArr.map(item => {
            return { ...item, added: false };
         })
      })
      setFavourites(prev => {
         const newArr = prev.slice();
         return newArr.map(item => {
            return { ...item, added: false };
         })
      })
   }
   React.useEffect(() => {
      setPrice(() => {
         return cartItems.reduce((sum, current) => sum + parseInt(current.price.replace(/\s/g, '')), 0) + ' руб.';
      });
   }, [cartItems]);

   React.useEffect(() => {
      setTax(() => {
         return Math.round(parseInt(price) * 0.05) + ' руб.';
      });
   }, [price]);

   return (
      <div className={active ? "drawer active" : "drawer"}>
         <div className="drawer__overlay" onClick={closeDrawer}></div>
         <div className="drawer__content">
            <div className='drawer__title'>
               <h2>Корзина</h2>
               <img width={25} src="/img/cart/delete.svg" alt="delete" onClick={closeDrawer} />
            </div>

            <div className="cart-content">
               {
                  cartItems.map(item => {
                     return <CartItem key={item.id} itemData={item} removeCartItem={removeCartItem} />
                  })
               }


            </div>
            {
               cartItems.length > 0 ?
                  <div className="drawer__bottom">
                     <div className='result'>
                        <span>Итого:</span>
                        <div className="border"></div>
                        <span className="num">{price}</span>
                     </div>
                     <div className='result'>
                        <span>Налог 5%:</span>
                        <div className="border"></div>
                        <span className="num">{tax}</span>
                     </div>
                     <button onClick={onClickOrder}>
                        Оформить заказ
                        <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                           <path d="M1 7H14.7143" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                           <path d="M8.71436 1L14.7144 7L8.71436 13" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                     </button>
                  </div> :
                  <BlockInfo
                     title={isOrderComplete ? 'Заказ оформлен!' : 'Корзина пуста'}
                     description={isOrderComplete ? 'Ваш заказ #18 скоро будет передан курьерской доставке' : 'Добавьте товар чтобы сделать заказ'}
                     img={isOrderComplete ? '/img/cart/done.png' : '/img/cart/cart.png'}
                  />
               // <div className='empty-cart'>
               //    <img src="/img/cart/cart.png" alt="" />
               //    <p>Корзина пуста</p>
               //    <span>Добавьте товар чтобы сделать заказ</span>
               // </div>
            }

         </div>
      </div>
   );
};

export default Drawer;