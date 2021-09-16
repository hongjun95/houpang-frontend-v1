import Categories from '@components/Categories';
import useAuth from '@hooks/useAuth';
import { getShoppingList } from '@store';
import { Link, Navbar, NavLeft, NavRight, NavTitle, Page } from 'framework7-react';
import React from 'react';

const HomePage = () => {
  const { currentUser } = useAuth();
  const shoppingList = getShoppingList(currentUser.id);

  return (
    <Page name="home">
      <Navbar>
        <NavLeft>
          <Link icon="las la-bars" panelOpen="left" />
        </NavLeft>
        <NavTitle>Houpang</NavTitle>
        <NavRight>
          <Link href="/shopping-list" iconF7="cart" iconBadge={shoppingList.length} badgeColor="red" />
        </NavRight>
      </Navbar>
      <Categories />
    </Page>
  );
};
export default React.memo(HomePage);
