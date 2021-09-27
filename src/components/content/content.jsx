import React from 'react';

import ProductItem from '../product-item';
import Search from '../search';

import './content.scss';

const Content = ({ onClickAdd, sneakers, onClickFavourite, isLoading }) => {
   const [searchValue, setSearchValue] = React.useState('');

   const onSearchValue = (value) => {
      setSearchValue(value);
   }

   const renderContent = () => {
      const filteredContent = sneakers.filter(item => item.title.toLowerCase().includes(searchValue.toLowerCase()));

      return (isLoading ? [...Array(4)] : filteredContent).map((item, index) => {
         return (
            <ProductItem
               onClickAdd={onClickAdd}
               onClickFavourite={onClickFavourite}
               productData={item}
               key={isLoading ? index : item.id}
               isLoading={isLoading}
            ></ProductItem>
         )
      });
   }

   return (
      <div className="content">
         <div className="content__title d-flex justify-between align-center">
            <h1>{searchValue ? `Поиск по запросу: ${searchValue}` : 'Все кроссовки'}</h1>
            <Search emitSearchValue={onSearchValue} />
         </div>
         <div className="sneakers-product">
            {
               renderContent()
            }
         </div>
      </div>
   );
};

export default Content;