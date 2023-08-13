import React from "react";
import { Card, Image } from "react-bootstrap";

export default function ViewUpvoted({ upvotedBy }) {
  return (
    <Card>
      <Card.Header style={{ textAlign: "center", fontSize: "40px" }}>
        Voted By
      </Card.Header>
      <Card.Body>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {upvotedBy.length > 0 ? (
            upvotedBy.map((person) => (
              <li
                key={crypto.randomUUID()}
                style={{
                  fontSize: "30px",
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "10px",
                }}
              >
                {person}
              </li>
            ))
          ) : (
            <li style={{ fontSize: "20px" }}>
              There are no upvotes for this post yet!
            </li>
          )}
        </ul>
      </Card.Body>
    </Card>
  );
}
