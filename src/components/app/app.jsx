import React from 'react';
import { Route } from 'react-router-dom';

import axios from 'axios'

import Header from '../header';
import Content from '../content';
import Drawer from '../drawer';
import Favourites from './../../pages/favourites';
import User from './../../pages/user';

import './app.scss';

const App = () => {
   const [drawer, setDrawer] = React.useState(false);
   const [cartItems, setCartItems] = React.useState([]);
   const [favourites, setFavourites] = React.useState([]);
   const [sneakers, setSneakers] = React.useState([]);

   React.useEffect(() => {
      axios.get('https://6147484265467e0017384ad7.mockapi.io/products')
         .then(res => setSneakers(res.data))
      axios.get('https://6147484265467e0017384ad7.mockapi.io/cart')
         .then(res => setCartItems(res.data))
      axios.get('https://6147484265467e0017384ad7.mockapi.io/favourites')
         .then(res => setFavourites(res.data))
   }, []);

   const cartOpen = () => {
      drawer ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll')

      setDrawer(prevDrawer => {
         return prevDrawer = !prevDrawer;
      });
   }

   const onClickFavourite = async (productData) => {
      if (!productData.favourite) {
         const { data } = await axios.post('https://6147484265467e0017384ad7.mockapi.io/favourites', { ...productData, favourite: true, });
         axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${productData.catalogId}`, {
            ...productData, favourite: true, favouriteIdForDel: data.id
         })
         setSneakers(prev => {
            const newArr = prev.slice();
            return newArr.map(item => item.id === productData.id ? { ...item, favourite: true, favouriteIdForDel: data.id, } : { ...item });
         })
         setFavourites(prev => {
            return [...prev, { ...data, favouriteIdForDel: data.id }];
         })
      } else {
         await axios.delete(`https://6147484265467e0017384ad7.mockapi.io/favourites/${productData.favouriteIdForDel}`);
         await axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${productData.catalogId}`, {
            ...productData, favourite: false,
         })
         setSneakers(prev => {
            const newArr = prev.slice();
            return newArr.map(item => item.id === productData.catalogId ? { ...item, favourite: false } : { ...item });
         })
         setFavourites((prev) => {
            return prev.filter(item => item.id !== productData.favouriteIdForDel)
         })
      }
   }

   const onClickAdd = async (data) => {
      // setSneakers(prev => {
      //    const newArr = prev.slice();
      //    return newArr.map(item => item.id === data.id ? { ...item, added: !item.added } : { ...item });
      // })

      if (data.added) {
         axios.delete(`https://6147484265467e0017384ad7.mockapi.io/cart/${data.cartIdForDel}`)
         axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${data.catalogId}`, {
            ...data, added: false
         })
         axios.put(`https://6147484265467e0017384ad7.mockapi.io/favourites/${data.favouriteIdForDel}`, {
            ...data, added: false,
         })
         setCartItems((prevCartItems) => {
            return prevCartItems.filter(item => item.id !== data.cartIdForDel)
         })
         setSneakers(prev => {
            const newArr = prev.slice();
            return newArr.map(item => item.catalogId === data.catalogId ? { ...item, added: false } : { ...item });
         })
         setFavourites((prev) => {
            const newArr = prev.slice();
            return newArr.map(item => item.favouriteIdForDel === data.favouriteIdForDel ? { ...item, added: false, } : { ...item });
         })
      } else {
         const cartResp = await axios.post('https://6147484265467e0017384ad7.mockapi.io/cart', data);
         axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${data.catalogId}`, {
            ...data, added: true, cartIdForDel: cartResp.data.id
         })
         axios.put(`https://6147484265467e0017384ad7.mockapi.io/favourites/${data.favouriteIdForDel}`, {
            ...data, added: true, cartIdForDel: cartResp.data.id
         })
         setCartItems(prev => [...prev, cartResp.data])
         setSneakers(prev => {
            const newArr = prev.slice();
            return newArr.map(item => item.catalogId === data.catalogId ? { ...item, added: true, cartIdForDel: cartResp.data.id } : { ...item });
         })
         setFavourites((prev) => {
            const newArr = prev.slice();
            return newArr.map(item => item.favouriteIdForDel === data.favouriteIdForDel ? { ...item, added: true, cartIdForDel: cartResp.data.id } : { ...item });
         })
      }

   };

   const removeCartItem = (data) => {
      axios.delete(`https://6147484265467e0017384ad7.mockapi.io/cart/${data.id}`);
      axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${data.catalogId}`, { ...data, added: false })
      axios.put(`https://6147484265467e0017384ad7.mockapi.io/favourites/${data.favouriteIdForDel}`, {
         ...data, added: false
      })
      setSneakers(prev => {
         const newArr = prev.slice();
         return newArr.map(item => item.id === data.catalogId ? { ...item, added: false } : { ...item });
      })
      setFavourites((prev) => {
         const newArr = prev.slice();
         return newArr.map(item => item.favouriteIdForDel === data.favouriteIdForDel ? { ...item, added: false, } : { ...item });
      })
      setCartItems((prevCartItems) => {
         return prevCartItems.filter(item => item.id !== data.id)
      })
   }

   return (
      <div className="app clear">

         <Header
            drawer={cartOpen}
            cartCount={cartItems.length}
            favouritesCount={favourites.length}
         />

         <Drawer
            active={drawer}
            cartItems={cartItems}
            removeCartItem={removeCartItem}
            closeDrawer={cartOpen}
         />


         <Route path='/' exact>
            <Content
               sneakers={sneakers}
               onClickAdd={onClickAdd}
               onClickFavourite={onClickFavourite}
            />
         </Route>

         <Route path='/favourites'>
            <Favourites
               items={favourites}
               onClickAdd={onClickAdd}
               onClickFavourite={onClickFavourite}
            ></Favourites>
         </Route>

         <Route path='/user'>
            <User></User>
         </Route>

      </div>
   );
}

export default App;