import React, { useState, useEffect } from "react";
import mockUser from "./mockData.js/mockUser";
import mockRepos from "./mockData.js/mockRepos";
import mockFollowers from "./mockData.js/mockFollowers";
import axios from "axios";

const rootUrl = "https://api.github.com";

const GithubContext = React.createContext();

const GithubProvider = ({ children }) => {
  const [githubUser, setGithubUser] = useState(mockUser);
  const [repos, setRepos] = useState(mockRepos);
  const [followers, setFollowers] = useState(mockFollowers);
  //request loading
  const [request, setRequest] = useState(0);
  const [loading, setLoading] = useState(false);
  // error
  const [error, setError] = useState({ show: false, msg: "" });

  // search user
  const searchGithubUser = async (user) => {
    toggleError();
    setLoading(true);
    const response = await axios(`${rootUrl}/users/${user}`).catch((err) =>
      console.log(err)
    );
    if (response) {
      setGithubUser(response.data);
      const { login, followers_url } = response.data;
      // [Repos](https://api.github.com/users/john-smilga/repos?per_page=100)
      axios(`${rootUrl}/users/${login}/repos?per_page=100`).then((response) =>
        setRepos(response.data)
      );
      // - [Followers](https://api.github.com/users/john-smilga/followers)
      axios(`${followers_url}`).then((response) => setFollowers(response.data));
    } else {
      toggleError(true, "there is no user with that user name");
    }
    checkRequest();
    setLoading(false);
  };

  // check rate
  const checkRequest = () => {
    axios(`${rootUrl}/rate_limit`)
      .then((response) => {
        let {
          data: {
            rate: { remaining },
          },
        } = response;
        setRequest(remaining);
        if (remaining === 0) {
          // throw error
          toggleError(true, "Sorry, you have exceeded your hourly rate limit");
        }
      })
      .catch((err) => console.log(err));
  };

  // error
  function toggleError(show = false, msg = "") {
    setError({ show, msg });
  }

  useEffect(() => {
    checkRequest();
  }, []);

  return (
    <GithubContext.Provider
      value={{
        loading,
        githubUser,
        repos,
        followers,
        request,
        error,
        searchGithubUser,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export { GithubContext, GithubProvider };
