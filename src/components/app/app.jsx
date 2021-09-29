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

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const App = () => {
   const [drawer, setDrawer] = React.useState(false);
   const [cartItems, setCartItems] = React.useState([]);
   const [favourites, setFavourites] = React.useState([]);
   const [sneakers, setSneakers] = React.useState([]);
   const [contentIsLoading, setContentIsLoading] = React.useState(true);
   const [btnsDisable, setBtnsDisable] = React.useState(false);

   React.useEffect(() => {
      async function fetchData() {
         const sneakersResponse = await axios.get('https://6147484265467e0017384ad7.mockapi.io/products');
         const cartResponse = await axios.get('https://6147484265467e0017384ad7.mockapi.io/cart');
         const favouritesResponse = await axios.get('https://6147484265467e0017384ad7.mockapi.io/favourites');

         setContentIsLoading(false)

         setSneakers(sneakersResponse.data[0].items);
         setCartItems(cartResponse.data[0].items);
         setFavourites(favouritesResponse.data[0].items);
      };
      fetchData();
   }, []);

   React.useEffect(() => {
      async function fetchData() {
         setBtnsDisable(true)
         await delay(2000);
         await axios.put(`https://6147484265467e0017384ad7.mockapi.io/cart/1`, {
            items: cartItems
         });
         await delay(500);
         setBtnsDisable(false)
      }
      fetchData();
   }, [cartItems]);

   React.useEffect(() => {
      async function fetchData() {
         setBtnsDisable(true)
         await delay(2000);
         await axios.put(`https://6147484265467e0017384ad7.mockapi.io/products/1`, {
            items: sneakers
         });
         await delay(500);
         setBtnsDisable(false)
      }
      fetchData();
   }, [sneakers])

   React.useEffect(() => {
      async function fetchData() {
         setBtnsDisable(true)
         await delay(2000);
         await axios.put(`https://6147484265467e0017384ad7.mockapi.io/favourites/1`, {
            items: favourites
         });
         await delay(500);
         setBtnsDisable(false)
      }
      fetchData();
   }, [favourites])

   const cartOpen = () => {
      drawer ? document.body.classList.add('no-scroll') : document.body.classList.remove('no-scroll')

      setDrawer(prevDrawer => {
         return prevDrawer = !prevDrawer;
      });
   }

   const onClickFavourite = async (productData) => {
      if (!productData.favourite) {
         setFavourites(prev => {
            const newApiState = [...prev, { ...productData, favourite: true }];
            return newApiState;
         })
         setSneakers(prev => {
            const newArr = prev.slice();
            const newApiState = newArr.map(item => item.id === productData.id ? { ...item, favourite: true } : { ...item });
            return newApiState;
         })

      } else {
         setSneakers(prev => {
            const newArr = prev.slice();
            const newApiState = newArr.map(item => item.id === productData.id ? { ...item, favourite: false } : { ...item });
            return newApiState;
         })
         setFavourites((prev) => {
            const newApiState = prev.filter(item => item.id !== productData.id);
            return newApiState
         })
      }
   }

   const onClickAdd = async (data) => {
      if (data.added) {
         if (favourites.length > 0 && favourites.some(item => item.id === data.id)) {
            setFavourites(prev => {
               const newArr = prev.slice();
               return newArr.map(item => item.id === data.id ? { ...item, added: false } : { ...item });
            })
         }

         setSneakers(prev => {
            const newArr = prev.slice();
            const newApiState = newArr.map(item => item.id === data.id ? { ...item, added: false } : { ...item });
            return newApiState
         })

         setCartItems((prevCartItems) => {
            const newApiState = prevCartItems.filter(item => item.id !== data.id);
            return newApiState;
         })

      } else {

         if (favourites.length > 0 && favourites.some(item => item.id === data.id)) {
            setFavourites(prev => {
               const newArr = prev.slice();
               return newArr.map(item => item.id === data.id ? { ...item, added: true } : { ...item });
            })
         }

         setSneakers(prev => {
            const newArr = prev.slice();
            const newApiState = newArr.map(item => item.id === data.id ? { ...item, added: true } : { ...item });
            return newApiState;
         })

         setCartItems(prev => {
            const newArr = [...prev, data];
            return newArr;
         });
      }

   };

   const removeCartItem = (data) => {
      if (favourites.length > 0 && favourites.some(item => item.id === data.id)) {
         setFavourites(prev => {
            const newArr = prev.slice();
            return newArr.map(item => item.id === data.id ? { ...item, added: false } : { ...item });
         })
      }

      setSneakers(prev => {
         const newArr = prev.slice();
         const newApiState = newArr.map(item => item.id === data.id ? { ...item, added: false } : { ...item });
         return newApiState;
      })

      setCartItems((prevCartItems) => {
         const newApiState = prevCartItems.filter(item => item.id !== data.id);
         return newApiState;
      })
   }

   return (
      <AppContext.Provider value={{ cartItems, favourites, sneakers, setCartItems, setSneakers, setFavourites }}>
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
                  btnsDisable={btnsDisable}
               />
            </Route>

            <Route path='/favourites'>
               <Favourites
                  // items={favourites}
                  onClickAdd={onClickAdd}
                  onClickFavourite={onClickFavourite}
                  btnsDisable={btnsDisable}
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