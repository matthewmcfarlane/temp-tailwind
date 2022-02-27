import Channelbar from './components/ChannelBar';
import ContentContainer from './components/ContentContainer';
import SideBar from './components/SideBar';
import { useAuth0 } from '@auth0/auth0-react';

function App() {

  const { isLoading, loginWithRedirect, isAuthenticated, user } = useAuth0();



  if (isLoading) return <p>Loading....</p>

  return (
    !isAuthenticated &&(loginWithRedirect()),
    <div className="flex">
      <SideBar />
      <Channelbar />
      <ContentContainer />
    </div>
  );
}

export default App;
