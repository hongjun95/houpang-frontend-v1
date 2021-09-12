import React from 'react';
import { View } from 'framework7-react';

const LoggedOutViews = () => <View id="view-intro" main url="/intro" />;

export default React.memo(LoggedOutViews);
