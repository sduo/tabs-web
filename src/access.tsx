export default function(state:any) {
  console.debug('access.state', state);
  const access = {
    user: state.user,
    isLogined: (state?.user?.length! > 0) && (state?.token?.length! > 0)
  };
  console.debug('access', access);
  return access;
}