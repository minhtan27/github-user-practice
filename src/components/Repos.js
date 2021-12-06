import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  // piechar and doughnut
  const pieChart = (data) => {
    let obj = {};
    data.map((item) => {
      if (item.language) {
        obj[item.language]
          ? (obj[item.language] = {
              ...obj[item.language],
              value: obj[item.language].value + 1,
              stars: obj[item.language].stars + item.stargazers_count,
            })
          : (obj[item.language] = {
              label: item.language,
              value: 1,
              stars: item.stargazers_count,
            });
      } else {
        return;
      }
    });

    return Object.values(obj).sort((a, b) => b.value - a.value);
  };

  const doughnutData = pieChart(repos)
    .map((item) => {
      return { label: item.label, value: item.stars };
    })
    .sort((a, b) => b.value - a.value);

  // stars, forks
  let { stars, forks } = repos.reduce(
    (total, item) => {
      const { stargazers_count, name, forks } = item;
      total.stars[stargazers_count] = { label: name, value: stargazers_count };
      total.forks[forks] = { label: name, value: forks };
      return total;
    },
    { stars: {}, forks: {} }
  );

  stars = Object.values(stars).slice(-5).reverse();

  forks = Object.values(forks).slice(-5).reverse();

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={pieChart(repos)} />
        <Column3D data={stars} />
        <Doughnut2D data={doughnutData} />
        <Bar3D data={forks} />
      </Wrapper>
    </section>
  );
};

const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
