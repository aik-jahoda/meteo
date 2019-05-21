export type AppActionTypes = UpdateSunAction | UpdateNoonAction;

type UpdateSunAction = ReturnType<typeof updateSun>;
type UpdateNoonAction = ReturnType<typeof updateMoon>;

export function updateSun() {
  return {
    type: "UPDATE_SUN" as "UPDATE_SUN"
  };
}

export function updateMoon() {
  return {
    type: "UPDATE_MOON" as "UPDATE_MOON"
  };
}
