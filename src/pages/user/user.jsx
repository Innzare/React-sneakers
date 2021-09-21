import React from 'react';
import { Link } from 'react-router-dom';

import './user.scss';

const User = () => {

   return (
      <div className="user">
         <div className="user__title d-flex align-center">
            <Link to="/">
               <button>
                  <svg width="7" height="12" viewBox="0 0 7 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                     <path d="M6 11L1 6L6 1" stroke="#C8C8C8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
               </button>
            </Link>
            <h1>Мои покупки</h1>
         </div>
         <div className="content"></div>
      </div>
   );
}

export default User;