import React, { useState, useEffect } from "react";
import axios from "axios";
import styled, { createGlobalStyle } from "styled-components";

const App: React.FC = () => {
  const [metadata, setMetadata] = useState<any>([]);
  const [products, setProducts] = useState<any>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [sortPrices, setSortPrices] = useState<any>(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsError(false);
      setIsLoading(true);
      try {
        const getRequest = await axios.get("/challenge-3/response.json", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
        setMetadata(getRequest.data.metadata);
        setProducts(getRequest.data.results);
      } catch (error) {
        setIsError(true);
      }
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const logo = "https://s.catch.com.au/static/catch/images/logo-8b0ef96c7b.svg";

  const handleChange = () => {
    setSortPrices(!sortPrices);
  };

  let productPrice: any = [];
  const arrangeProducts = () =>
    products.map(({ salePrice }: any) => productPrice.push(salePrice));

  if (sortPrices) {
    arrangeProducts();
    productPrice.sort((a: number, b: number) => a - b);
  } else {
    arrangeProducts();
    productPrice.sort((a: number, b: number) => b - a);
  }

  console.log(productPrice);

  return (
    <>
      <GlobalStyle />
      {isError && <h2>Something went wrong...</h2>}
      {isLoading ? (
        <h2>Loading products...</h2>
      ) : (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              marginBottom: "2.5rem",
            }}
          >
            <Logo src={logo} alt="Catch Logo" />
            <form style={{ marginTop: "7.5rem" }}>
              <select
                onChange={handleChange}
                style={{
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  fontSize: "1rem",
                }}
                name="price"
                id="price"
              >
                <option value="lowest">Lowest Price</option>
                <option value="highest">Highest Price</option>
              </select>
            </form>
          </div>
          <h1 style={{ textTransform: "uppercase" }}>{metadata.query}</h1>
          <Wrap>
            {products.map(
              ({ id, imageUrl, name, retailPrice, quantityAvailable }: any) => (
                <Card key={id}>
                  <img src={imageUrl} alt={name} />
                  <div style={{ height: "6rem" }}>
                    <h2 style={{ fontSize: "1.25rem" }}>{name}</h2>
                  </div>
                  {retailPrice !== 0 && (
                    <h3>
                      <span>Retail Price</span> $
                      <span style={{ textDecoration: "line-through" }}>
                        {(retailPrice / 100).toFixed(2)}
                      </span>
                    </h3>
                  )}

                  {productPrice.map((value: any) => (
                    <>
                      {console.log(value)}

                      <h3>Sale Price ${(value / 100).toFixed(2)}</h3>
                    </>
                  ))}
                  {quantityAvailable === 0 && (
                    <h3 style={{ textTransform: "uppercase" }}>Sold Out</h3>
                  )}
                </Card>
              )
            )}
          </Wrap>
        </>
      )}
    </>
  );
};

export default App;

const Logo = styled.img`
  margin-top: 5%;
  width: 20rem;
`;

const Wrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  margin: 2.5% 5%;
`;

const Card = styled.div`
  width: 20rem;
  height: 27.5rem;
  border: 2px solid black;
  margin: 1rem;
  padding: 1rem;
  > img {
    padding: 1rem;
    height: 12rem;
  }
`;

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }
    *:before,
    *:after {
    box-sizing: border-box;
  }

  html, body {
    overflow-x: hidden;
    display: flex;
    justify-content: center;
    text-align: center;
    margin: 0;
    padding: 0;
    max-width: 100%;
    height: auto;
    font-size: 1rem;  
    font-family: 'arial'
}`;
