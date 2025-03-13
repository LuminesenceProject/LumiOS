export function applyTheme(theme) {
  const root = document.documentElement;
  Object.keys(theme).forEach((cssVar) => {
    root.style.setProperty(cssVar, theme[cssVar]);
  });

  const crntusr = JSON.parse(localStorage.getItem("currentUser"));

  localStorage.setItem(crntusr && crntusr.name + "theme", JSON.stringify(theme));
}

export function createTheme({
    primary,
    primaryLight,
    secondary,
    secondaryLight, 
    textBase,
  }) {
    return {
      "--theme-primary": primary,
      "--theme-primary-light": primaryLight,
      "--theme-secondary": secondary,
      "--theme-secondary-light": secondaryLight,
      "--theme-text-base": textBase,
    };
  }

export function applyBackground(image) {
  const root = document.documentElement;
  
  root.style.setProperty('--background-image', `url(${image})`);

  // Save the background image URL to local storage
  localStorage.setItem("background", JSON.stringify(image));
}