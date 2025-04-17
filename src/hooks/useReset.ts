function baseClone(value:any) {
  if (value == null || typeof value !== "object") return value;
  return JSON.parse(JSON.stringify(value));
}

function useResetRef<T>(value: T) {
  const state = ref(value);
  const reset = () => {
    state.value = baseClone(value);
  };
  return [state, reset] as const;
}

function useResetReactive<T>(value: T) {
  const state = reactive(baseClone(value));
  const reset = () => {
    Object.keys(state).forEach((key) => delete state[key]);
    Object.assign(state, baseClone(value));
  };
  return [state, reset] as const;
}

export {
  useResetRef,
  useResetReactive
}