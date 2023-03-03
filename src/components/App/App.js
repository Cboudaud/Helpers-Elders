import './styles.scss';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Header from '../Header/Header';
import Searchbar from '../Searchbar/Searchbar';
import Homepage from '../Homepage/Homepage';
import Footer from '../Footer/Footer';
import Background from '../Background/Background';
import Connexion from '../Connexion/Connexion';
import CreatePostForm from '../CreatePostForm/CreatePostForm';
import ResultPosts from '../ResultPosts/ResultPosts';
import DetailedPost from '../DetailedPost/DetailedPost';
import UserProfile from '../UserProfile/UserProfile';
import UserProfileEdit from '../UserProfile/UserProfileEdit';
import PrivateRoute from './PrivateRoute';
import Contact from '../Contact/Contact';
import { loadServices, redirectDone } from '../../actions/app';
import { clearInfoModal, loadServices, redirectDone } from '../../actions/app';
import InfoModal from '../InfoModal/InfoModal';
import DetailedPost from '../DetailedPost/DetailedPost';
import { saveJwt, saveLoggedUser } from '../../actions/authentication';

function App() {
  const dispatch = useDispatch();
  const { redirectPath, largeFontSize, infoMessages } = useSelector((state) => state.app);
  const navigate = useNavigate();

  // on first app render
  useEffect(
    () => {
      // loading services for searchbar and post creation form
      dispatch(loadServices());
      // if a user and jwt token are present in the sessionStorage, save them in the store
      if (sessionStorage.jwt && sessionStorage.user) {
        dispatch(saveJwt(sessionStorage.jwt));
        dispatch(saveLoggedUser(JSON.parse(sessionStorage.user)));
      }
    },
    [],
  );

  // global redirection system
  // redirectAction(path) can be dispatched from anywhere to put the said path into the state.
  // whenever the App component sees a redirection path in the state, it redirects to it
  // and then empties state.app.redirectPath by dispatching redirectDone()
  useEffect(
    () => {
      if (redirectPath !== '') {
        const path = redirectPath;
        dispatch(redirectDone());
        navigate(path);
      }
    },
    [redirectPath],
  );

  /* when a message is dispatched, a timer is set after which
  the message is cleared and the modal disappears */
  useEffect(
    () => {
      if (infoMessages.length !== 0) setTimeout(() => dispatch(clearInfoModal()), 4000);
    },
    [infoMessages],
  );

  return (
    <div className={largeFontSize ? 'app app--large' : 'app'}>
      <Background />
      <div className="wrapper">
        <div>
          <Header />
          <Searchbar />
          <InfoModal />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/annonce" element={<ResultPosts />} />
            <Route path="/mon-profil" element={<PrivateRoute element={<UserProfile />} />} />
            <Route path="/mon-profil/modifier" element={<PrivateRoute element={<UserProfileEdit />} />} />
            {/* <Route path="/profil/:id" element={<UserProfile />} /> */}
            <Route path="/annonce/:id" element={<DetailedPost />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/poster-une-annonce" element={<PrivateRoute element={<CreatePostForm />} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default App;
