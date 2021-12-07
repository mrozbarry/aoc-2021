const actFx = (dispatch, { action, props }) => {
  setTimeout(() => dispatch(action, props), 0);
};
export const act = (action, props) => [actFx, {action, props}]
