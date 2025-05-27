export default function useDomControl() {
  const instance = getCurrentInstance()

  function setRequired(refName: string, value: boolean, attr: string = '') {
    const el: HTMLElement | null = attr ? instance?.proxy?.$refs[refName]?.[attr] : instance?.proxy?.$refs[refName]
    if (!el) throw new Error(`Element with ref "${refName}" not found.`);
    if (value) {
      el.setAttribute("required", "true");
    } else {
      el.removeAttribute("required");
    }
  }

  function setDisabled(refName: string, value: boolean, attr: string = '') {
    const el: HTMLElement | null = attr ? instance?.proxy?.$refs[refName]?.[attr] : instance?.proxy?.$refs[refName]
    console.log("💬 ⋮ setDisabled ⋮ el => ", el)
    if (!el) throw new Error(`Element with ref "${refName}" not found.`);
    if (value) {
      // el.parentElement?.parentElement?.classList.add('is-disabled')
      // el.setAttribute("disabled", "");
      el.disabled = true
    } else {
      // el.parentElement?.parentElement?.classList.remove('is-disabled')
      // el.removeAttribute("disabled");
      el.disabled = false
    }
  }

  function setVisible(refName: string, value: boolean, attr: string = '') {
    const el: HTMLElement | null = attr ? instance?.proxy?.$refs[refName]?.[attr] : instance?.proxy?.$refs[refName]
    if (!el) throw new Error(`Element with ref "${refName}" not found.`);
    if (value) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  }

  return { setRequired, setDisabled, setVisible };
}