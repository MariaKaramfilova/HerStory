import React from "react";

function SideBar(props) {
  const femaleRightsTopics = [
    "Gender Equality",
    "Reproductive Rights",
    "Violence Against Women",
    "Equal Pay",
    "Maternity Leave",
    "Women's Education",
  ];

  let id = 1;
  function randomID (){
    return id++
  }

  return (
    <div className="container-fluid" style ={styles.container}>
      <div className="row align-items-center" >
        <div className="col-auto min-vh-100 bg-light py-4 px-4 "  >
          <ul>
              <h6>5k Users</h6>
              <h6>10k Comments</h6>
          </ul>
          <hr></hr>

          <ul>
              <h3>Popular Topics</h3>
            <ul>
              {femaleRightsTopics.map((topic) => (
                <div key={randomID()}>
                    <h6>{topic}</h6>
                </div>
              ))}
            </ul>
          </ul>
          <hr></hr>
      
        </div>
      </div>
    </div>
  );
}

const styles = {
    container: {
        lineHeight: '3em',
    },
  };

export default SideBar;