import React from 'react';

import './blockInfo.scss';

const BlockInfo = ({ title, description, img }) => {

   return (
      <div className='empty-cart'>
         <img src={img} alt="" />
         <p>{title}</p>
         <span>{description}</span>
      </div>
   );
}

export default BlockInfo;