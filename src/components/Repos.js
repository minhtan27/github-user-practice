import React from "react";
import styled from "styled-components";
import { GithubContext } from "../context/context";
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from "./Charts";
const Repos = () => {
  const { repos } = React.useContext(GithubContext);

  const pieChart = (data) => {
    let obj = {};
    data.map((item) => {
      if (item.language) {
        obj[item.language]
          ? (obj[item.language] = {
              ...obj[item.language],
              value: obj[item.language].value + 1,
            })
          : (obj[item.language] = { label: item.language, value: 1 });
      } else {
        obj["Others"]
          ? (obj["Others"] = {
              ...obj["Others"],
              value: obj["Others"].value + 1,
            })
          : (obj["Others"] = {
              label: "Others",
              value: 1,
            });
      }
    });

    return Object.values(obj).sort((a, b) => b.value - a.value);
  };

  return (
    <section className="section">
      <Wrapper className="section-center">
        <Pie3D data={pieChart(repos)} />
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
