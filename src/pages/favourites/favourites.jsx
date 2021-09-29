import React from 'react';
import { Link } from 'react-router-dom';

import ProductItem from './../../components/product-item';

import AppContext from '../../context';

import './favourites.scss';

const Favourites = ({ items, onClickAdd, onClickFavourite, btnsDisable }) => {

   const state = React.useContext(AppContext);

   return (
      <div className="favourites">
         <div className="favourites__title d-flex align-center">
            <Link to="/">
               <button>
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M6 11L1 6L6 1" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
            </Link>
            <h1>Избранное</h1>
         </div>
         <div className="content">
            {
               state.favourites.map(item => {
                  return (
                     <ProductItem
                        productData={{ ...item, addFromFavourite: true }}
                        onClickAdd={onClickAdd}
                        onClickFavourite={onClickFavourite}
                        key={item.id}
                        btnsDisable={btnsDisable}
                     />
                  )
               })
            }
         </div>
      </div>
   );
}

export default Favourites;