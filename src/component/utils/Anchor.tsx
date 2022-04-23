import React, { AnchorHTMLAttributes, DetailedHTMLProps } from 'react';

type AnchorProps = DetailedHTMLProps<AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>;

function Anchor({ href, children, ...props }: AnchorProps) {
  return (
    <a href= { href } {...props } target = '_blank' rel = 'noopener noreferrer' >
      { children }
    </a>
  );
}

export default Anchor;