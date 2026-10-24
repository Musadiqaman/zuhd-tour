import React from 'react';
import { Link } from 'react-router-dom';
export default function Logo({
  onClick
}) {
  return <Link to="/" className="logo supplied-logo" onClick={onClick} aria-label="Zuhd Tours home"><img src="/images/brand/zuhd-tours-logo-clear.webp" alt="Zuhd Tours" width="102" height="68" decoding="async" /></Link>;
}
