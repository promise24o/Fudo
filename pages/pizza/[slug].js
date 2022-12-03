import Image from "next/image";
import Layout from "../../components/Layout";
import { client, urlFor } from "../../lib/client";
import css from "../../styles/Pizza.module.css";
import leftArrow from "../../assets/arrowLeft.png";
import rightArrow from "../../assets/arrowRight.png";
import { useState } from "react";
import { useStore } from "../../store/store";
import toast, {Toaster} from "react-hot-toast"

export default function Pizza({ pizza }) {
  const src = urlFor(pizza.image).url();
  const [Size, setSize] = useState(1);
  const [Quantity, setQuantity] = useState(1);
  const handleQuantity = (type) => {
    type === "inc"
      ? setQuantity((prev) => prev + 1)
      : Quantity === 1
      ? null
      : setQuantity((prev) => prev - 1);
  };

  const cartData = useStore((state) => state.cart);

  // Add to Cart Function
  const addPizza = useStore((state) => state.addPizza);
  const addToCart = () => {
    addPizza({
      ...pizza,
      price: pizza.price[Size],
      qauntity: Quantity,
      size: Size,
    });
    typeof window != 'undefined' && localStorage.setItem('cartItems', JSON.stringify(cartData.pizzas))
    toast.success(pizza.name + " Added to cart");
  };

  return (
    <Layout>
      <div className={css.container}>
        <div className={css.imageWrapper}>
          <Image
            loader={() => src}
            src={src}
            alt=""
            unoptimized
            objectFit="cover"
            layout="fill"
          />
        </div>
        {/* Right Size  */}
        <div className={css.right}>
          <span> {pizza.name} </span> <span> {pizza.details} </span>
          <span>
            <span style={{ color: "var(--themeRed)" }}> ₦ </span>
            {pizza.price[Size].toLocaleString("en-US")}
          </span>
          <div className={css.sizes}>
            <span> Sizes: </span>
            <div className={css.sizeVariant}>
              <div
                onClick={() => setSize(0)}
                className={Size === 0 ? css.selected : ""}
              >
                Small
              </div>
              <div
                onClick={() => setSize(1)}
                className={Size === 1 ? css.selected : ""}
              >
                Medium
              </div>
              <div
                onClick={() => setSize(2)}
                className={Size === 2 ? css.selected : ""}
              >
                Large
              </div>
            </div>
          </div>
          <div className={css.qauntity}>
            <div> Quantity </div>
            <div className={css.counter}>
              <Image
                src={leftArrow}
                alt={leftArrow}
                height={20}
                width={20}
                objectFit="contain"
                onClick={() => handleQuantity("dec")}
              />
              <span> {Quantity} </span>
              <Image
                src={rightArrow}
                alt={rightArrow}
                height={20}
                width={20}
                objectFit="contain"
                onClick={() => handleQuantity("inc")}
              />
            </div>
          </div>
          <div className={`btn ${css.btn}`} onClick={addToCart}> Add to Cart </div>
        </div>
        <Toaster/>
      </div>
    </Layout>
  );
}

export async function getStaticPaths() {
  const paths = await client.fetch(
    '*[_type=="pizza" && defined(slug.current)][].slug.current'
  );

  return {
    paths: paths.map((slug) => ({
      params: {
        slug,
      },
    })),
    fallback: "false",
  };
}

export async function getStaticProps(context) {
  const { slug = "" } = context.params;
  const pizza = await client.fetch(
    `*[_type=="pizza" && slug.current == '${slug}'][0]`
  );
  return {
    props: {
      pizza,
    },
  };
}
