import React from 'react';

import ProductItem from '../product-item';
import Search from '../search';

import './content.scss';

const Content = ({ onClickAdd, sneakers, onClickFavourite }) => {
   const [searchValue, setSearchValue] = React.useState('');

   const onSearchValue = (value) => {
      setSearchValue(value);
   }

   return (
      <div className="content">
         <div className="content__title d-flex justify-between align-center">
            <h1>{searchValue ? `Поиск по запросу: ${searchValue}` : 'Все кроссовки'}</h1>
            <Search emitSearchValue={onSearchValue} />
         </div>
         <div className="sneakers-product">
            {
               sneakers.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase())).map(item => {
                  return (
                     <ProductItem
                        onClickAdd={onClickAdd}
                        onClickFavourite={onClickFavourite}
                        productData={item}
                        key={item.id}
                     ></ProductItem>
                  )
               })
            }

         </div>
      </div>
   );
};

export default Content;