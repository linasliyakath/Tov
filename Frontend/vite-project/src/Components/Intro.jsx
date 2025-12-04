import React, { useEffect, useRef, useState } from "react";
import "../index.css";
import { Link } from "react-router-dom";


function Head() {
  const products = [
    { id: "69257aec2bf86d55967118ed", image: "/assets/@niklinio.jpeg", alt: "Product 1", gridClass: "col-span-6 md:row-span-12", overlayText: "NEW ARRIVAL" },
    { id: "69259105ee33c75e40e7f03e", image: "/assets/download (15).jpeg", alt: "Product 2", gridClass: "col-span-6 md:row-span-13 md:col-start-7", overlayText: "SHOP NOW" },
    { id: "692591ccee33c75e40e7f05e", image: "/assets/download (16).jpeg", alt: "Product 3", gridClass: "col-span-6 md:row-span-7 md:row-start-13", overlayText: "TRENDING" },
    { id: "69259159ee33c75e40e7f056", image: "/assets/download (14).jpeg", alt: "Product 4", gridClass: "col-span-6 md:row-span-12 md:col-start-7 md:row-start-14", overlayText: "MUST HAVE" },
    { id: "6925918fee33c75e40e7f05a", image: "/assets/by basechkaa.jpeg", alt: "Product 5", gridClass: "col-span-6 md:row-span-9 md:row-start-20", overlayText: "STYLE" },
    { id: "6", image: "/assets/Group 25.jpg", alt: "Product 6", gridClass: "col-span-6 md:col-start-7 md:row-span-3 md:row-start-26", overlayText: "" }, 
  ];

  const [isVisible, setIsVisible] = useState({});
  const productRefs = useRef([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      const initialVisibility = products.reduce((acc, p) => ({ ...acc, [p.id]: true }), {});
      setIsVisible(initialVisibility);
      return;
    }

    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -50px 0px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const productId = entry.target.getAttribute('data-product-id');
        if (entry.isIntersecting) {
          setIsVisible(prev => ({ ...prev, [productId]: true }));
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    productRefs.current.forEach(ref => {
      if (ref) {
        observer.observe(ref);
      }
    });

    return () => observer.disconnect();
  }, []);

  const setProductRef = (el, id) => {
    if (el) {
      productRefs.current = productRefs.current.filter(ref => ref?.getAttribute('data-product-id') !== id);
      productRefs.current.push(el);
    }
  };

  // Helper function to dynamically determine text size
  const getTextSizeClass = (index) => {
    switch (index % 3) {
      case 0:
        return "text-lg md:text-xl lg:text-3xl"; // Large
      case 1:
        return "text-base md:text-lg lg:text-xl"; // Medium
      case 2:
        return "text-sm md:text-base lg:text-lg"; // Small
      default:
        return "text-xl md:text-2xl"; // Default size
    }
  };

  // Helper function to dynamically determine the slide-in direction
  const getTextAnimationClass = (index, isVisible) => {
    let slideClass = '';

    // Cycle through 4 directions: Right, Left, Bottom, Top
    switch (index % 4) {
      case 0: // Slide from Right
        slideClass = isVisible ? 'translate-x-0' : 'translate-x-8'; // 32px displacement
        break;
      case 1: // Slide from Left
        slideClass = isVisible ? 'translate-x-0' : '-translate-x-8';
        break;
      case 2: // Slide from Bottom
        slideClass = isVisible ? 'translate-y-0' : 'translate-y-4'; // 16px displacement
        break;
      case 3: // Slide from Top
        slideClass = isVisible ? 'translate-y-0' : '-translate-y-4';
        break;
      default:
        slideClass = isVisible ? 'translate-y-0' : 'translate-y-4'; // Default to slide from bottom
    }
    
    // Combine opacity control and the translation class
    return `${isVisible ? 'opacity-100' : 'opacity-0'} ${slideClass}`;
  };

  return (
    <>
<header className="bg-gray-200 w-screen pt-12">
  <section className="relative">
    <Link to="/userDashboard">
      {/* Mobile Video */}
      <video
        className="md:hidden w-full"
        loop
        autoPlay
        muted
        src="/assets/mobileView.webm"
      ></video>
      {/* Desktop Video */}
      <video
        className="hidden md:block w-full cursor-"
        loop
        autoPlay
        muted
        src="/assets/LapView.webm"
      ></video>
    </Link>

    {/* Shop Now Button */}
    <Link
      to="/userDashboard"
      className="absolute inset-0 flex items-center justify-center"
    >
      <button className="cursor-pointer group flex items-center font-sans font-bold text-white uppercase text-base leading-normal bg-transparent border-0 outline-0 p-4 relative overflow-hidden">
        <span className="cursor-pointer block h-px w-0 bg-white mr-2 transition-all duration-420 ease-[cubic-bezier(.25,.8,.25,1)] group-hover:w-12"></span>
        T O V
      </button>
    </Link>
  </section>

  {/* Responsive Grid */}
  <div className="grid w-screen">
    <div className="grid grid-cols-1 md:grid-cols-12 md:grid-rows-12 gap-0">
      {products.map((product, index) => (
<div
  key={product.id}
  data-product-id={product.id}
  ref={(el) => setProductRef(el, product.id)}
  className={`
    ${product.gridClass}
    overflow-hidden
    shadow-lg
    bg-white
    flex items-center justify-center
    relative
  `}
>
  {/* Product Content (Image/Link) */}
  {product.id !== "6" ? (
    <Link
      to={`/product/${product.id}`}
      className="w-full h-full block cursor-pointer"
    >
      <img
        src={product.image}
        alt={product.alt}
        className="w-full h-full object-cover"
      />
    </Link>
  ) : (
    <img
      src={product.image}
      alt={product.alt}
      className="w-full h-full object-cover"
    />
  )}

  {/* Overlay */}
  {product.id !== "6" && (
    <div
      className={`
        absolute inset-0
        bg-black/20
        flex flex-col items-center justify-center
        transition-opacity duration-200 ease-in delay-1000
        ${isVisible[product.id] ? 'opacity-100' : 'opacity-0'}
        pointer-events-none
      `}
    >
      <Link
        to="/userDashboard"
        className="pointer-events-auto cursor-pointer flex flex-col items-center"
      >
        <p
          className={`
            text-white font-bold tracking-widest uppercase text-center px-4
            ${getTextSizeClass(index)}
            transition-all duration-500 ease-out delay-1200
            ${getTextAnimationClass(index, isVisible[product.id])}
          `}
        >
          {product.overlayText}
        </p>
        <p className="text-white text-xs mt-2 opacity-70">
          Explore
        </p>
      </Link>
    </div>
  )}
</div>

      ))}
    </div>
  </div>
</header>

    </>
  );
}

export default Head;
