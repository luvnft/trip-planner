import React from 'react';
import { Button } from '../ui/button';
import { Link } from 'react-router-dom';

function Footer() {
  const openInstagram = () => {
    window.open('https://x.com/wizardofhahz', '_blank', 'noopener,noreferrer');
  };
  return (
    <div className="flex items-center justify-center w-full p-4 footer min-h-32 text-muted-foreground">
      <h1>
        <Link to='https://x.com/wizardofhahz' target='_blank' rel='noreferrer'>
          <Button variant="link" onClick={openInstagram}> <p className='border-b-2 sm:font-semibold sm:text-lg text-muted-foreground'>Made by the Wizard of HAHZ </p></Button>
        </Link>
      </h1>
    </div>
  );
}

export default Footer;
