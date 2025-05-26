export default function useDomControl() {
  const instance = getCurrentInstance()
  const elRefs = ref(instance?.proxy?.$refs as Record<string, HTMLDivElement> | null);

  function setRequired(refName: string, value: boolean) {
    const el = elRefs.value?.[refName] as HTMLElement | undefined;
    if(!el) throw new Error(`Element with ref "${refName}" not found.`);
    if (value) {
      el.setAttribute("required", "true");
    } else {
      el.removeAttribute("required");
    }
  }

  function setDisabled(refName: string, value: boolean) {
    const el = elRefs.value?.[refName] as HTMLElement | undefined;
    if(!el) throw new Error(`Element with ref "${refName}" not found.`);
    if (value) {
      el.setAttribute("disabled", "true");
    } else {
      el.removeAttribute("disabled");
    }
  }

  function setVisible(refName: string, value: boolean) {
    const el = elRefs.value?.[refName] as HTMLElement | undefined;
    if(!el) throw new Error(`Element with ref "${refName}" not found.`);
    if(value) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  }

  return { setRequired, setDisabled, setVisible };
}