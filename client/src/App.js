import React from "react";
import Posts from "./core/components/Posts";
import Sidebar from "./core/components/sidebar/Sidebar";
import Layout from "./core/Layout.js";

const App = () => {
  return (
    <Layout>
      <div className="container  ">
        <div className="row">
          <div className="col-3">
            <Sidebar />
          </div>

          <div className="col-6">
            <Posts />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default App;
