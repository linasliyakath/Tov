import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Products/ProductCard';

const User = () => {
  const products = [
    {
      id: "6a91f1b7fe3f6592bd2ce282",
      desktopImage: "https://res.cloudinary.com/jgrhqydf/image/upload/v1787949924/tov_products/f6maoxg6ylzket7cw0cc.jpg",
      mobileImage: "https://res.cloudinary.com/jgrhqydf/image/upload/v1787949483/tov_products/ay8hykp17gcujjliq5um.jpg",
      alt: "Classic Italian Suit & Monk-Strap Shoes"
    }
  ];

  return (
    <section className="pt-12">
      <section>
        {/* Desktop image wrapped in Link */}
        <Link to={`/product/${products[0].id}`} className='cursor-pointer hidden md:block'>
          <img src={products[0].desktopImage} alt={products[0].alt} className="w-full" />
        </Link>

        {/* Mobile image wrapped in Link */}
        <Link to={`/product/${products[0].id}`} className='cursor-pointer md:hidden'>
          <img src={products[0].mobileImage} alt={products[0].alt} className="w-full" />
        </Link>
      </section>
      <ProductCard />
    </section>
  );
};

export default User;
