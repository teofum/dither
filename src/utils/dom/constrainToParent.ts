const constrainToParent = (el: HTMLDivElement) => {
  const parentRect = el.parentElement?.getBoundingClientRect();
  if (!parentRect) return;

  const elRect = el.getBoundingClientRect();
  const maxLeft = parentRect.width - elRect.width;
  const maxTop = parentRect.height - elRect.height;
  
  let left = elRect.left - parentRect.left;
  let top = elRect.top - parentRect.top;

  left = left < 0 ? 0 : (left > maxLeft ? maxLeft : left);
  top = top < 0 ? 0 : (top > maxTop ? maxTop : top);

  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
};

export default constrainToParent;