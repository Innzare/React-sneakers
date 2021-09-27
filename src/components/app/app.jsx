import React from 'react';
import { Route } from 'react-router-dom';

import axios from 'axios';

import AppContext from '../../context';

import Header from '../header';
import Content from '../content';
import Drawer from '../drawer';
import Favourites from './../../pages/favourites';
import User from './../../pages/user';

import './app.scss';

// export const AppContext = React.createContext({});

const App = () => {
   const [drawer, setDrawer] = React.useState(false);
   const [cartItems, setCartItems] = React.useState([]);
   const [favourites, setFavourites] = React.useState([]);
   const [sneakers, setSneakers] = React.useState([]);
   const [contentIsLoading, setContentIsLoading] = React.useState(true);

   React.useEffect(() => {
      async function fetchData() {
         const cartResponse = await axios.get('https://6147484265467e0017384ad7.mockapi.io/cart');
         const favouritesResponse = await axios.get('https://6147484265467e0017384ad7.mockapi.io/favourites');
         const sneakersResponse = await axios.get('https://6147484265467e0017384ad7.mockapi.io/products');

         setContentIsLoading(false)

         setCartItems(cartResponse.data);
         setFavourites(favouritesResponse.data);
         setSneakers(sneakersResponse.data);
      };

      fetchData();
      try {

      } catch (err) {
         alert('Произошла ошибка! Возможно слишком много запросов на MockAPI.');
         console.log(err);
      }

   }, []);

   const cartOpen = () => {
      drawer ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll')

      setDrawer(prevDrawer => {
         return prevDrawer = !prevDrawer;
      });
   }

   const onClickFavourite = async (productData) => {
      if (!productData.favourite) {
         try {
            const { data } = await axios.post('https://6147484265467e0017384ad7.mockapi.io/favourites', { ...productData, favourite: true, });
            axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${productData.catalogId}`, {
               ...productData, favourite: true, favouriteIdForDel: data.id
            })
            if (cartItems.length > 0 && cartItems.some(item => item.catalogId === productData.catalogId)) {
               axios.put(`https://6147484265467e0017384ad7.mockapi.io/cart/${productData.cartIdForDel}`, { ...productData, favourite: true });
               setCartItems(prev => {
                  const newArr = prev.slice();
                  return newArr.map(item => item.catalogId === productData.catalogId ? { ...item, favourite: true } : { ...item });
               })
            }
            setSneakers(prev => {
               const newArr = prev.slice();
               return newArr.map(item => item.id === productData.id ? { ...item, favourite: true, favouriteIdForDel: data.id, } : { ...item });
            })
            setFavourites(prev => {
               return [...prev, { ...data, favouriteIdForDel: data.id }];
            })
         } catch (err) {
            alert('Произошла ошибка! Возможно слишком много запросов на MockAPI.');
            console.log(err);
         }

      } else {
         try {
            await axios.delete(`https://6147484265467e0017384ad7.mockapi.io/favourites/${productData.favouriteIdForDel}`);
            await axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${productData.catalogId}`, {
               ...productData, favourite: false,
            })
            if (cartItems.length > 0 && cartItems.some(item => item.catalogId === productData.catalogId)) {
               axios.put(`https://6147484265467e0017384ad7.mockapi.io/cart/${productData.cartIdForDel}`, { ...productData, favourite: false })
               setCartItems(prev => {
                  const newArr = prev.slice();
                  return newArr.map(item => item.catalogId === productData.catalogId ? { ...item, favourite: false } : { ...item });
               })
            }
            setSneakers(prev => {
               const newArr = prev.slice();
               return newArr.map(item => item.id === productData.catalogId ? { ...item, favourite: false } : { ...item });
            })
            setFavourites((prev) => {
               return prev.filter(item => item.id !== productData.favouriteIdForDel)
            })
         } catch (err) {
            alert('Произошла ошибка! Возможно слишком много запросов на MockAPI.');
            console.log(err);
         }

      }
   }

   const onClickAdd = async (data) => {

      if (data.added) {
         try {
            axios.delete(`https://6147484265467e0017384ad7.mockapi.io/cart/${data.cartIdForDel}`)
            axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${data.catalogId}`, {
               ...data, added: false
            })

            setCartItems((prevCartItems) => {
               return prevCartItems.filter(item => item.id !== data.cartIdForDel)
            })
            setSneakers(prev => {
               const newArr = prev.slice();
               return newArr.map(item => item.catalogId === data.catalogId ? { ...item, added: false } : { ...item });
            })

            if (favourites.length > 0 && favourites.some(item => item.catalogId === data.catalogId)) {
               axios.put(`https://6147484265467e0017384ad7.mockapi.io/favourites/${data.favouriteIdForDel}`, {
                  ...data, added: false,
               })
               setFavourites((prev) => {
                  const newArr = prev.slice();
                  return newArr.map(item => item.favouriteIdForDel === data.favouriteIdForDel ? { ...item, added: false, } : { ...item });
               })
            }

         } catch (err) {
            alert('Произошла ошибка! Возможно слишком много запросов на MockAPI.');
            console.log(err);
         }

      } else {
         try {
            const cartResp = await axios.post('https://6147484265467e0017384ad7.mockapi.io/cart', data);
            axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${data.catalogId}`, {
               ...data, added: true, cartIdForDel: cartResp.data.id, favouriteIdForDel: data.favouriteIdForDel
            })

            setCartItems(prev => [...prev, cartResp.data])
            setSneakers(prev => {
               const newArr = prev.slice();
               return newArr.map(item => item.catalogId === data.catalogId ? { ...item, added: true, cartIdForDel: cartResp.data.id } : { ...item });
            })

            if (favourites.length > 0 && favourites.some(item => item.catalogId === data.catalogId)) {
               axios.put(`https://6147484265467e0017384ad7.mockapi.io/favourites/${data.favouriteIdForDel}`, {
                  ...data, added: true, cartIdForDel: cartResp.data.id
               })
               setFavourites((prev) => {
                  const newArr = prev.slice();
                  return newArr.map(item => item.catalogId === data.catalogId ? { ...item, added: true, cartIdForDel: cartResp.data.id } : { ...item });
               })
            }

         } catch (err) {
            alert('Произошла ошибка! Возможно слишком много запросов на MockAPI.');
            console.log(err);
         }
      }

   };

   const removeCartItem = (data) => {
      console.log(data);
      try {
         axios.delete(`https://6147484265467e0017384ad7.mockapi.io/cart/${data.id}`);
         axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/${data.catalogId}`, { ...data, added: false })
         setSneakers(prev => {
            const newArr = prev.slice();
            return newArr.map(item => item.catalogId === data.catalogId ? { ...item, added: false } : { ...item });
         })

         if (favourites.length > 0 && favourites.some(item => item.catalogId === data.catalogId)) {
            axios.put(`https://6147484265467e0017384ad7.mockapi.io/favourites/${data.favouriteIdForDel}`, {
               ...data, added: false
            })
            setFavourites((prev) => {
               const newArr = prev.slice();
               return newArr.map(item => item.catalogId === data.catalogId ? { ...item, added: false, } : { ...item });
            })
         }

         setCartItems((prevCartItems) => {
            return prevCartItems.filter(item => item.id !== data.id)
         })
      } catch (err) {
         alert('Произошла ошибка! Возможно слишком много запросов на MockAPI.');
         console.log(err);
      }
   }

   return (
      <AppContext.Provider value={{ cartItems, favourites, sneakers }}>
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
                  isLoading={contentIsLoading}
               />
            </Route>

            <Route path='/favourites'>
               <Favourites
                  // items={favourites}
                  onClickAdd={onClickAdd}
                  onClickFavourite={onClickFavourite}
               ></Favourites>
            </Route>

            <Route path='/user'>
               <User></User>
            </Route>

         </div>
      </AppContext.Provider>

   );
}

export default App;