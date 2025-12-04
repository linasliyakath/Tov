import React from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../Products/ProductCard';

const User = () => {
  const products = [
    { id: "69259210ee33c75e40e7f076", image: "/assets/fashion1.jpg", alt: "Product 1" }
  ];

  return (
    <section className="pt-12"> {/* Add top padding here */}
      <section>
        {/* Desktop image wrapped in Link */}
        <Link to={`/product/${products[0].id}`} className='cursor-pointer hidden md:block'>
          <img src={products[0].image} alt={products[0].alt} />
        </Link>

        {/* Mobile image wrapped in Link */}
        <Link to={`/product/${products[0].id}`} className='cursor-pointer md:hidden'>
          <img src="/src/assets/F775.jpg" alt={products[0].alt} />
        </Link>
      </section>
      <ProductCard />
    </section>
  );
};

export default User;
