import React from 'react';
import { Link } from 'react-router-dom';

import './header.scss';

const Header = ({ drawer, cartCount, favouritesCount }) => {
   return (
      <header className="header d-flex justify-between align-center">
         <Link to="/">
            <div className="logo d-flex align-center">
               <div className="logo__img">
                  <img src="/img/header/logo.svg" alt="Logo" />
               </div>
               <div className="logo__text">
                  <h3>react sneackers</h3>
                  <p>Магазин лучших кроссовок</p>
               </div>
            </div>
         </Link>
         <div className="header-right">
            <ul>
               <li onClick={drawer}>
                  {
                     cartCount !== 0 && <div className="cart-count">{cartCount}</div>
                  }
                  <img src="/img/header/cart.svg" alt="Cart" />
               </li>
               <li>
                  {
                     favouritesCount !== 0 && <div className="favourite-count">{favouritesCount}</div>
                  }
                  <Link to="/favourites">
                     <img src="/img/header/like.svg" alt="Favourites" />
                  </Link>
               </li>
               <li>
                  <Link to="/user">
                     <img src="/img/header/user.svg" alt="User" />
                  </Link>

               </li>
            </ul>
         </div>
      </header>
   );
};

export default Header;
