import React from 'react';
import { Route } from 'react-router-dom';
import { ConfirmSignIn, ForgotPassword, RequireNewPassword, SignIn, withAuthenticator } from 'aws-amplify-react';
import theme from '../ui/Theme';
import EditMishnaPage from '../pages/EditMishnaPage';
import EditLinePage from '../pages/EditLinePage';

export type routeObject =  {
  tractate: string;
  chapter: string;
  mishna: string;
  line: string;
}
export const AdminRoutes = () => {
  return (
    <>
      <Route path="/admin/edit/:tractate/:chapter/:mishna/:line" element={EditLinePage} />
      <Route path="/admin/edit/:tractate/:chapter/:mishna" element={EditMishnaPage} />
      <Route path="/admin" />
    </>
  );
};

export default withAuthenticator(
  AdminRoutes,
  true,
  [<SignIn />, <ConfirmSignIn />, <ForgotPassword />, <RequireNewPassword />],
  null,
  theme
);
