import PropTypes from 'prop-types';
import { useAuth } from '@/utils/context/authContext';
import Loading from '@/components/Loading';
import NavBar from '@/components/NavBar';

function ViewDirectorBasedOnUserAuthStatus({ children }) {
  const { userLoading } = useAuth();

  // if user state is null, then show loader
  if (userLoading) {
    return <Loading />;
  }

  // Show navbar for all pages (public website)
  // Certain pages/routes can check auth status individually if needed
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}

export default ViewDirectorBasedOnUserAuthStatus;

ViewDirectorBasedOnUserAuthStatus.propTypes = {
  children: PropTypes.node.isRequired,
};
