import Channelbar from './components/ChannelBar';
import ContentContainer from './components/ContentContainer';
import SideBar from './components/SideBar';
import { useAuth0 } from '@auth0/auth0-react';
import TopNavigation from './components/TopNavigation'

function App() {

  const { isLoading, loginWithRedirect, isAuthenticated } = useAuth0();



  if (isLoading) return <p>Loading....</p>

  return (
    !isAuthenticated &&(loginWithRedirect()),
    <>
<TopNavigation />
<SideBar />
    <div className="flex">
      <ContentContainer />
    </div>
  </>
  );
}

export default App;
