export function initCarousel(root, items = [], onChange) {
  if (!root || !items.length) {
    return {
      next() {},
      prev() {},
      goTo() {},
      getIndex() {
        return 0;
      },
    };
  }

  let index = 0;
  const stage = root.querySelector("[data-carousel-stage]");
  const thumbs = [...root.querySelectorAll("[data-carousel-thumb]")];
  const prev = root.querySelector("[data-carousel-prev]");
  const next = root.querySelector("[data-carousel-next]");

  function update() {
    thumbs.forEach((thumb, thumbIndex) => {
      thumb.classList.toggle("is-active", thumbIndex === index);
    });
    if (typeof onChange === "function") {
      onChange(items[index], index, stage);
    }
  }

  function goTo(nextIndex) {
    index = (nextIndex + items.length) % items.length;
    update();
  }

  thumbs.forEach((thumb, thumbIndex) => {
    thumb.addEventListener("click", () => goTo(thumbIndex));
  });
  prev?.addEventListener("click", () => goTo(index - 1));
  next?.addEventListener("click", () => goTo(index + 1));

  update();

  return {
    next() {
      goTo(index + 1);
    },
    prev() {
      goTo(index - 1);
    },
    goTo,
    getIndex() {
      return index;
    },
  };
}
